
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCoachDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [activeClients, totalRevenue, pendingApps, pendingConsultations] = await Promise.all([
        // Only count clients assigned to this coach
        prisma.user.count({
            where: {
                coachId: session.user.id,
                isActive: true
            }
        }),
        prisma.payment.aggregate({
            _sum: {
                coachShare: true
            },
            where: {
                coachId: session.user.id,
                status: "COMPLETED"
            }
        }),
        prisma.application.count({
            where: {
                status: "PENDING"
            }
        }),
        prisma.consultation.findMany({
            where: {
                coachId: session.user.id,
                status: "PENDING"
            },
            include: {
                client: {
                    select: { name: true, image: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return {
        activeClients,
        monthlyRevenue: totalRevenue._sum.coachShare || 0,
        pendingApps,
        pendingConsultations
    };
}

export async function getClientDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [workoutLogs, weightLogs, consultations] = await Promise.all([
        prisma.progress.findMany({
            where: {
                userId: session.user.id,
                metrics: {
                    path: ['type'],
                    equals: 'WORKOUT_COMPLETION'
                }
            },
            orderBy: { date: 'desc' },
            take: 5
        }),
        prisma.progress.findMany({
            where: {
                userId: session.user.id,
                metrics: {
                    path: ['weight'],
                    not: null
                }
            },
            orderBy: { date: 'desc' },
            take: 1
        }),
        prisma.consultation.findMany({
            where: {
                clientId: session.user.id
            },
            include: {
                coach: { select: { name: true, image: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 3
        })
    ]);

    // Nutrition logs would be fetched here too

    return {
        recentWorkouts: workoutLogs,
        currentWeight: (weightLogs[0]?.metrics as any)?.weight || null,
        consultations
    };
}

export async function logWorkout(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const title = (formData.get("title") as string)?.trim();
    const durationRaw = formData.get("duration") as string;
    const dateRaw = formData.get("date") as string;
    const notes = (formData.get("notes") as string)?.trim();
    const weightRaw = formData.get("weight") as string;
    const bodyFatRaw = formData.get("bodyFat") as string;

    if (!title) {
        return { success: false, error: "Workout title is required" };
    }

    const duration = durationRaw ? Number(durationRaw) : null;
    const weight = weightRaw ? Number(weightRaw) : null;
    const bodyFat = bodyFatRaw ? Number(bodyFatRaw) : null;

    if (duration !== null && (Number.isNaN(duration) || duration < 0)) {
        return { success: false, error: "Invalid duration" };
    }

    if (weight !== null && (Number.isNaN(weight) || weight <= 0)) {
        return { success: false, error: "Invalid weight" };
    }

    if (bodyFat !== null && (Number.isNaN(bodyFat) || bodyFat < 0)) {
        return { success: false, error: "Invalid body fat percentage" };
    }

    const entryDate = dateRaw ? new Date(dateRaw) : new Date();
    if (Number.isNaN(entryDate.getTime())) {
        return { success: false, error: "Invalid date" };
    }

    await prisma.progress.create({
        data: {
            userId: session.user.id,
            date: entryDate,
            metrics: {
                type: "WORKOUT_COMPLETION",
                title,
                duration: duration ?? undefined,
                notes: notes || undefined,
                weight: weight ?? undefined,
                bodyFat: bodyFat ?? undefined,
            },
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/clients");
    return { success: true };
}
