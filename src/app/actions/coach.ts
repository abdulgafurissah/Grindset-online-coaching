"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- Client Management ---

export async function getCoachClients() {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Only return clients assigned to this coach
    const clients = await prisma.user.findMany({
        where: { coachId: session.user.id },
        include: { assignedPrograms: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' }
    });

    return clients.map((client: any) => ({
        id: client.id,
        name: client.name || "Unnamed Client",
        email: client.email,
        image: client.image,
        status: client.isActive ? "Active" : "Inactive",
        joinedAt: client.createdAt.toLocaleDateString(),
        program: client.assignedPrograms?.[0] || null, // Assume single program per client
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

// --- Program Management for Coaches ---

export async function getCoachPrograms() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return [];

    try {
        return await prisma.program.findMany({
            where: { creatorId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch coach programs:", error);
        return [];
    }
}

export async function createCoachProgram(data: { title: string; description?: string; link: string }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return { error: "Unauthorized" };

    try {
        await prisma.program.create({
            data: {
                ...data,
                creatorId: session.user.id,
            },
        });

        revalidatePath("/dashboard/coach/programs");
        return { success: true };
    } catch (error) {
        console.error("Failed to create program:", error);
        return { error: "Failed to create program" };
    }
}

export async function updateCoachProgram(programId: string, data: { title: string; description?: string; link: string }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return { error: "Unauthorized" };

    try {
        // Verify ownership
        const program = await prisma.program.findUnique({ where: { id: programId } });
        if (!program || program.creatorId !== session.user.id) {
            return { error: "Unauthorized to edit this program. Coaches can only edit their own programs." };
        }

        await prisma.program.update({
            where: { id: programId },
            data,
        });

        revalidatePath("/dashboard/coach/programs");
        return { success: true };
    } catch (error) {
        console.error("Failed to update program:", error);
        return { error: "Failed to update program" };
    }
}

export async function deleteCoachProgram(programId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return { error: "Unauthorized" };

    try {
        // Verify ownership
        const program = await prisma.program.findUnique({ where: { id: programId } });
        if (!program || program.creatorId !== session.user.id) {
            return { error: "Unauthorized to delete this program. Coaches can only delete their own programs." };
        }

        await prisma.program.delete({
            where: { id: programId },
        });

        revalidatePath("/dashboard/coach/programs");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete program:", error);
        return { error: "Failed to delete program" };
    }
}

export async function assignProgramToClient(clientId: string, programId: string | null) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH") return { error: "Unauthorized" };

    try {
        // Verify the client is assigned to this coach
        const client = await prisma.user.findUnique({ where: { id: clientId } });
        if (!client || client.coachId !== session.user.id) {
            return { error: "Unauthorized. This client is not assigned to you." };
        }

        if (programId) {
            // Verify the program belongs to this coach
            const program = await prisma.program.findUnique({ where: { id: programId } });
            if (!program || program.creatorId !== session.user.id) {
                return { error: "Unauthorized. You can only assign your own programs." };
            }

            // Assign program (disconnect all others first for simplicity, or just connect based on schema)
            // Assuming 1 program per client for now, or adding to a list. Based on schema: users User[] @relation
            // We'll set the programs for the user by clearing existing and setting new one
            await prisma.user.update({
                where: { id: clientId },
                data: {
                    programs: {
                        set: [{ id: programId }]
                    }
                }
            });
        } else {
            // Unassign all programs
            await prisma.user.update({
                where: { id: clientId },
                data: {
                    programs: {
                        set: []
                    }
                }
            });
        }

        // Revalidate the coach dashboard and specific client view if it exists
        revalidatePath("/dashboard/clients");
        revalidatePath(`/dashboard/clients/${clientId}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to assign program:", error);
        return { error: "Failed to assign program" };
    }
}

