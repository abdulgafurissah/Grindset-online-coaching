"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

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

