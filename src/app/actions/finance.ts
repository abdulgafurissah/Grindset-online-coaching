"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getGlobalFinancials() {
    try {
        const payments = await prisma.payment.findMany({
            where: { status: "COMPLETED" },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } }, // Client
                coach: { select: { name: true } } // Coach
            }
        });

        const totalRevenue = payments.reduce((acc: number, p: any) => acc + p.amount, 0);
        const platformProfit = payments.reduce((acc: number, p: any) => acc + p.platformShare, 0);
        const coachPayouts = payments.reduce((acc: number, p: any) => acc + p.coachShare, 0);

        return {
            payments,
            summary: {
                totalRevenue,
                platformProfit,
                coachPayouts
            }
        };
    } catch (error) {
        console.error("Global Financials Error:", error);
        return null;
    }
}

export async function getCoachEarnings(coachId: string) {
    try {
        const payments = await prisma.payment.findMany({
            where: {
                coachId,
                status: "COMPLETED"
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true } } // Client Name
            }
        });

        const totalEarnings = payments.reduce((acc: number, p: any) => acc + p.coachShare, 0);

        return {
            payments,
            totalEarnings
        };
    } catch (error) {
        console.error("Coach Earnings Error:", error);
        return null;
    }
}

import { revalidatePath } from "next/cache";

export async function deletePayment(id: string) {
    try {
        await prisma.payment.delete({ where: { id } });
        revalidatePath("/dashboard/admin/finances");
        return { success: true };
    } catch (error) {
        console.error("Delete Payment Error:", error);
        return { success: false, error: "Failed to delete payment" };
    }
}

export async function clearAllPayments() {
    try {
        await prisma.payment.deleteMany({});
        revalidatePath("/dashboard/admin/finances");
        return { success: true };
    } catch (error) {
        console.error("Clear All Payments Error:", error);
        return { success: false, error: "Failed to clear payments" };
    }
}

export async function getAdminPayments() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { payments: [], revenuePerCoach: [], revenuePerProgram: [] };

    try {
        const payments = await prisma.payment.findMany({
            where: { status: "COMPLETED" },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                coach: { select: { id: true, name: true, email: true } }
            }
        });

        // Calculate Revenue per Coach
        const coachEarningsMap = new Map();
        payments.forEach((p: any) => {
            if (p.coachId && p.coach?.name) {
                const current = coachEarningsMap.get(p.coach.name) || 0;
                coachEarningsMap.set(p.coach.name, current + p.coachShare);
            }
        });
        const revenuePerCoach = Array.from(coachEarningsMap.entries()).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);

        // Calculate Revenue per Program
        // We need to fetch user's assigned programs to attribute payments to programs Since we don't have programId on Payment model
        const authUsers = await prisma.user.findMany({
            where: { role: "CLIENT" },
            include: { assignedPrograms: { select: { title: true } } }
        });

        const programEarningsMap = new Map();
        payments.forEach((p: any) => {
            const clientName = p.user?.name || "Unknown Client";
            const client = authUsers.find((u: any) => u.name === clientName);
            const progName = client?.assignedPrograms?.[0]?.title || "General Coaching";

            const current = programEarningsMap.get(progName) || 0;
            programEarningsMap.set(progName, current + p.amount); // Platform uses total amount for revenue per program
        });
        const revenuePerProgram = Array.from(programEarningsMap.entries()).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);

        return {
            payments,
            revenuePerCoach,
            revenuePerProgram
        };
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        return { payments: [], revenuePerCoach: [], revenuePerProgram: [] };
    }
}

export async function getSubscriptions() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.subscription.findMany({
            orderBy: { currentPeriodEnd: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true, image: true } }
            }
        });
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
    }
}

export async function updatePayment(id: string, data: { status?: string, amount?: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.payment.update({
            where: { id },
            data
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update payment:", error);
        return { error: "Failed to update payment" };
    }
}

export async function updateSubscription(id: string, data: { status?: string, currentPeriodEnd?: Date }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.subscription.update({
            where: { id },
            data
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update subscription:", error);
        return { error: "Failed to update subscription" };
    }
}

export async function markPaymentPaidOut(id: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.payment.update({
            where: { id },
            data: { isPaidOut: true }
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to mark payment as paid out:", error);
        return { error: "Failed to mark payment as paid out" };
    }
}

export async function getCoachFinancialStats() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return null;
    const coachId = session.user.id;

    try {
        const payments = await prisma.payment.findMany({
            where: {
                coachId,
                status: "COMPLETED"
            },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, email: true, image: true } }
            }
        });

        const totalEarnings = payments.reduce((acc: number, p: { coachShare: number }) => acc + p.coachShare, 0);

        // Group by client
        const clientEarningsMap = new Map();
        payments.forEach((p: any) => {
            const clientName = p.user?.name || "Unknown Client";
            if (!clientEarningsMap.has(clientName)) {
                clientEarningsMap.set(clientName, 0);
            }
            clientEarningsMap.set(clientName, clientEarningsMap.get(clientName) + p.coachShare);
        });

        const earningsPerClient = Array.from(clientEarningsMap.entries()).map(([name, amount]) => ({
            name,
            amount
        })).sort((a, b) => b.amount - a.amount);

        // Calculate this month's earnings
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyEarnings = payments
            .filter((p: { createdAt: Date }) => new Date(p.createdAt) >= startOfMonth)
            .reduce((acc: number, p: { coachShare: number }) => acc + p.coachShare, 0);

        // Calculate pending payouts vs paid payouts based on the isPaidOut flag
        let pendingPayouts = 0;

        payments.forEach((p: { coachShare: number, isPaidOut: boolean }) => {
            if (!p.isPaidOut) {
                pendingPayouts += p.coachShare;
            }
        });

        // Earnings by Program: For simplicity in the MVP, since payments are subscription-based, 
        // we'll attribute client earnings to their current assigned program.
        const authUsers = await prisma.user.findMany({
            where: { coachId },
            include: { assignedPrograms: true }
        });

        const programEarningsMap = new Map();
        authUsers.forEach((client: any) => {
            const progName = client.assignedPrograms?.[0]?.title || "General Coaching";
            const lifetimeValue = clientEarningsMap.get(client.name) || 0;
            if (!programEarningsMap.has(progName)) {
                programEarningsMap.set(progName, 0);
            }
            programEarningsMap.set(progName, programEarningsMap.get(progName) + lifetimeValue);
        });

        // Accurate real-time derivation
        payments.forEach((p: any) => {
            const clientName = p.user?.name || "Unknown Client";
            // find client in authUsers
            const client = authUsers.find((u: any) => u.name === clientName);
            const progName = client?.assignedPrograms?.[0]?.title || "General Coaching";
            if (!programEarningsMap.has(progName)) {
                programEarningsMap.set(progName, 0);
            }
            if (!clientEarningsMap.has(clientName)) {
                programEarningsMap.set(progName, programEarningsMap.get(progName) + p.coachShare);
            }
        });

        const earningsPerProgram = Array.from(programEarningsMap.entries()).map(([name, amount]) => ({
            name,
            amount
        })).sort((a, b) => b.amount - a.amount);

        return {
            totalEarnings,
            monthlyEarnings,
            pendingPayouts,
            payments,
            earningsPerClient,
            earningsPerProgram
        };
    } catch (error) {
        console.error("Coach Financials Error:", error);
        return null;
    }
}

// --- Payment Plans ---

export async function getPaymentPlans(includeInactive = false) {
    try {
        const plans = await prisma.paymentPlan.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { price: 'asc' }
        });

        return plans.map((plan: any) => {
            let featuresArray = plan.features;
            if (typeof plan.features === 'string') {
                try {
                    featuresArray = JSON.parse(plan.features);
                } catch (e) {
                    featuresArray = [];
                }
            }
            return {
                ...plan,
                features: Array.isArray(featuresArray) ? featuresArray : []
            };
        });
    } catch (error) {
        console.error("Failed to fetch payment plans:", error);
        return [];
    }
}

export async function createPaymentPlan(data: { name: string, price: number, interval: string, category: string, paymentLink?: string, features: string[], isActive: boolean, promoPercentage: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.paymentPlan.create({
            data: {
                name: data.name,
                price: data.price,
                interval: data.interval,
                category: data.category,
                paymentLink: data.paymentLink || null,
                features: data.features,
                isActive: data.isActive,
                promoPercentage: data.promoPercentage
            }
        });
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to create payment plan:", error);
        return { error: "Failed to create payment plan" };
    }
}

export async function updatePaymentPlan(id: string, data: { name?: string, price?: number, interval?: string, category?: string, paymentLink?: string, features?: string[], isActive?: boolean, promoPercentage?: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const updateData: any = { ...data };
        if (data.features) updateData.features = data.features;

        await prisma.paymentPlan.update({
            where: { id },
            data: updateData
        });
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update payment plan:", error);
        return { error: "Failed to update payment plan" };
    }
}

export async function deletePaymentPlan(id: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.paymentPlan.delete({ where: { id } });
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete payment plan:", error);
        return { error: "Failed to delete" };
    }
}

export async function createSubscription(planId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const userId = session.user.id;

    try {
        const plan = await prisma.paymentPlan.findUnique({ where: { id: planId } });
        if (!plan) return { error: "Plan not found" };

        const currentPeriodEnd = new Date();
        if ((plan.interval || "").toLowerCase() === "year") {
            currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        } else {
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        }

        await prisma.subscription.upsert({
            where: { userId },
            update: {
                planId: plan.id,
                status: "ACTIVE",
                currentPeriodEnd,
                paypalSubscriptionId: `sub_sim_${Date.now()}`
            },
            create: {
                userId,
                planId: plan.id,
                status: "ACTIVE",
                currentPeriodEnd,
                paypalSubscriptionId: `sub_sim_${Date.now()}`
            }
        });

        // Ensure user is marked as CLIENT
        await prisma.user.update({
            where: { id: userId },
            data: { role: "CLIENT" }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to subscribe:", error);
        return { error: "Subscription failed" };
    }
}
