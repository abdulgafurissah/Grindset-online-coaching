"use server";

import prisma from "@/lib/prisma";

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
