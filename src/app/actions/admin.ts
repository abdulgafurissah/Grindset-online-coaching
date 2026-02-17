"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- Stats & Dashboard ---

export async function getAdminStats() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null;

    try {
        const [userCount, pendingApps, activeSubs] = await Promise.all([
            prisma.user.count(),
            prisma.application.count({ where: { status: "PENDING" } }),
            prisma.subscription.count({ where: { status: "active" } }),
        ]);

        // Mock revenue data for now
        const revenue = activeSubs * 99;

        return {
            userCount,
            pendingApps,
            revenue,
            activeSubs
        };
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return null;
    }
}

// --- Application Management ---

export async function getApplications(status?: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.application.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
    }
}

// ... imports
import { updateApplicationStatusSchema } from "@/lib/validations";

export async function updateApplicationStatus(appId: string, status: "APPROVED" | "REJECTED") {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    const validation = updateApplicationStatusSchema.safeParse({ appId, status });
    if (!validation.success) {
        return { error: "Invalid data", details: validation.error.flatten() };
    }

    try {
        const app = await prisma.application.update({
            where: { id: appId },
            data: { status }
        });

        // ... rest of logic

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update application:", error);
        return { error: "Failed to update application" };
    }
}

// --- User Management ---

export async function getAdminUsers() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                coach: { select: { id: true, name: true } },
                _count: { select: { clients: true } } // For coaches, see how many clients they have
            }
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function toggleUserStatus(userId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: "User not found" };

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive }
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle user status:", error);
        return { error: "Failed to toggle user status" };
    }
}

// ...
import { assignCoachSchema } from "@/lib/validations";

export async function assignCoachToClient(clientId: string, coachId: string | null) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    const validation = assignCoachSchema.safeParse({ clientId, coachId });
    if (!validation.success) {
        return { error: "Invalid data", details: validation.error.flatten() };
    }

    try {
        await prisma.user.update({
            where: { id: clientId },
            data: { coachId: coachId }
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign coach:", error);
        return { error: "Failed to assign coach" };
    }
}

export async function getAvailableCoaches() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.user.findMany({
            where: { role: "COACH", isActive: true },
            select: { id: true, name: true }
        });
    } catch (error) {
        console.error("Failed to fetch coaches:", error);
        return [];
    }
}
