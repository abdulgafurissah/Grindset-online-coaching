"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- Client Management ---

export async function getCoachClients() {
    const session = await auth();
    if (!session?.user?.id) return [];

    // For MVP, assuming all CLIENTS are visible to COACH/ADMIN
    // In real app, might filter by 'coachId' if User model had it
    const clients = await prisma.user.findMany({
        where: { role: "CLIENT" },
        orderBy: { createdAt: 'desc' }
    });

    return clients.map((client: any) => ({
        id: client.id,
        name: client.name || "Unnamed Client",
        email: client.email,
        image: client.image,
        status: client.isActive ? "Active" : "Inactive",
        joinedAt: client.createdAt.toLocaleDateString()
    }));
}

export async function assignCoach(coachId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to select a coach." };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { coachId: coachId },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign coach:", error);
        return { error: "Failed to assign coach." };
    }
}

