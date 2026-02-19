
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCoachDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const [activeClients, totalRevenue, pendingApps, pendingConsultations] = await Promise.all([
        prisma.user.count({
            where: {
                role: "CLIENT",
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
