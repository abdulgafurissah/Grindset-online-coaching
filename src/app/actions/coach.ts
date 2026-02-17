"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Program Management ---

// ... existing imports
import { createProgramSchema } from "@/lib/validations";

export async function createProgram(data: z.infer<typeof createProgramSchema>) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "COACH" && (session.user as any).role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const validation = createProgramSchema.safeParse(data);
    if (!validation.success) {
        return { error: "Invalid data", details: validation.error.flatten() };
    }
    const safeData = validation.data;

    try {
        const program = await prisma.program.create({
            data: {
                title: safeData.title,
                description: safeData.description,
                creatorId: session.user.id,
                workouts: {
                    create: safeData.workouts.map((workout: any, wIndex: number) => ({
                        title: workout.title,
                        description: workout.description,
                        order: wIndex,
                        exercises: {
                            create: workout.exercises.map((ex: any, eIndex: number) => ({
                                order: eIndex,
                                sets: ex.sets,
                                reps: ex.reps,
                                rest: ex.rest,
                                exercise: {
                                    connectOrCreate: {
                                        where: { name: ex.name },
                                        create: {
                                            name: ex.name,
                                            videoUrl: ex.videoUrl || undefined
                                        }
                                    }
                                }
                            }))
                        }
                    }))
                }
            }
        });

        revalidatePath("/dashboard/programs");
        return { success: true, program };
    } catch (error) {
        console.error("Failed to create program:", error);
        return { error: "Failed to create program" };
    }
}

export async function getCoachPrograms() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.program.findMany({
        where: { creatorId: session.user.id },
        include: {
            _count: {
                select: { assignments: true } // Assuming we map 'assignments' to 'activeClients' count logic roughly
            }
        }
    });
}

// --- Client Management ---

export async function getCoachClients() {
    const session = await auth();
    if (!session?.user?.id) return [];

    // For MVP, assuming all CLIENTS are visible to COACH/ADMIN
    // In real app, might filter by 'coachId' if User model had it
    const clients = await prisma.user.findMany({
        where: { role: "CLIENT" },
        include: {
            assignments: {
                where: { status: "ACTIVE" },
                include: { program: true }
            },
            progress: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    return clients.map((client: any) => ({
        id: client.id,
        name: client.name || "Unnamed Client",
        email: client.email,
        image: client.image,
        program: client.assignments[0]?.program?.title || "No Active Program",
        status: client.assignments.length > 0 ? "Active" : "Pending",
        lastCheckIn: client.progress[0]?.date ? new Date(client.progress[0].date).toLocaleDateString() : "Never"
    }));
}

export async function assignProgram(clientId: string, programId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role === "CLIENT") {
        return { error: "Unauthorized" };
    }

    try {
        // Deactivate old assignments
        await prisma.assignment.updateMany({
            where: { userId: clientId, status: "ACTIVE" },
            data: { status: "COMPLETED" }
        });

        // Create new assignment
        await prisma.assignment.create({
            data: {
                userId: clientId,
                programId: programId,
                status: "ACTIVE",
                startDate: new Date()
            }
        });

        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign program:", error);
        return { error: "Failed to assign program" };
    }
}
