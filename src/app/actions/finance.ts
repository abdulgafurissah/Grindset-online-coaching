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
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                coach: { select: { id: true, name: true, email: true } }
            }
        });
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        return [];
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

        return {
            totalEarnings,
            monthlyEarnings,
            pendingPayouts,
            payments,
            earningsPerClient
        };
    } catch (error) {
        console.error("Coach Financials Error:", error);
        return null;
    }
}

// --- Payment Plans ---

export async function getPaymentPlans(includeInactive = false) {
    try {
        return await prisma.paymentPlan.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { price: 'asc' }
        });
    } catch (error) {
        console.error("Failed to fetch payment plans:", error);
        return [];
    }
}

export async function createPaymentPlan(data: { name: string, price: number, interval: string, features: string[], isActive: boolean, promoPercentage: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.paymentPlan.create({
            data: {
                name: data.name,
                price: data.price,
                interval: data.interval,
                features: JSON.stringify(data.features),
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

export async function updatePaymentPlan(id: string, data: { name?: string, price?: number, interval?: string, features?: string[], isActive?: boolean, promoPercentage?: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const updateData: any = { ...data };
        if (data.features) updateData.features = JSON.stringify(data.features);

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
