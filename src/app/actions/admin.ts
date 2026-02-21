"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// --- Stats & Dashboard ---

export async function getAdminStats() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null;

    try {
        const [userCount, pendingApps, activeSubs, completedPayments] = await Promise.all([
            prisma.user.count(),
            prisma.application.count({ where: { status: "PENDING" } }),
            prisma.subscription.count({ where: { status: "ACTIVE" } }),
            prisma.payment.findMany({ where: { status: "COMPLETED" }, select: { amount: true } })
        ]);

        const revenue = completedPayments.reduce((acc: number, current: { amount: number }) => acc + current.amount, 0);

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

// --- Consultations ---

export async function getAdminConsultations() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.consultation.findMany({
            include: {
                client: { select: { name: true, email: true, image: true } },
                coach: { select: { name: true, email: true } },
            },
            orderBy: { requestedAt: "asc" }
        });
    } catch (error) {
        console.error("Failed to fetch admin consultations:", error);
        return [];
    }
}

export async function updateConsultationStatus(id: string, status: "APPROVED" | "REJECTED" | "COMPLETED") {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.consultation.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update consultation:", error);
        return { error: "Failed to update consultation" };
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

        // If approved and it's a coach application, update the user role
        if (status === "APPROVED" && app.type === "COACH") {
            const user = await prisma.user.findUnique({ where: { email: app.email } });
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        role: "COACH",
                        approvalStatus: "APPROVED"
                    }
                });

                // Ensure a profile exists for the new coach
                const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
                if (!profile) {
                    await prisma.profile.create({
                        data: {
                            userId: user.id,
                            specialty: "General Coach",
                            commissionRate: 0.8,
                            bio: "New Coach",
                            qualification: "Pending Verification",
                            rating: 5.0
                        }
                    });
                }
            }
        }

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

export async function deleteUser(userId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath("/dashboard/admin");
        revalidatePath("/dashboard/admin/clients");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { error: "Failed to delete user" };
    }
}

export async function updateCoachProfile(coachId: string, data: { specialty: string; bio: string; commissionRate: number }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.profile.update({
            where: { userId: coachId },
            data
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update coach profile:", error);
        return { error: "Failed to update coach profile" };
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

export async function getAllCoaches() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.user.findMany({
            where: { role: "COACH" },
            include: { profile: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Failed to fetch all coaches:", error);
        return [];
    }
}

export async function getClients() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.user.findMany({
            where: { role: "CLIENT" },
            orderBy: { createdAt: 'desc' },
            include: {
                coach: { select: { id: true, name: true } },
                assignedPrograms: { select: { title: true } }
            }
        });
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        return [];
    }
}

export async function getPrograms() {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return [];

    try {
        return await prisma.program.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch programs:", error);
        return [];
    }
}

export async function createProgram(data: { title: string; description?: string; link: string }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.program.create({
            data: {
                ...data,
                creatorId: session.user.id,
            },
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to create program:", error);
        return { error: "Failed to create program" };
    }
}

export async function updateProgram(programId: string, data: { title: string; description?: string; link: string }) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.program.update({
            where: { id: programId },
            data,
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to update program:", error);
        return { error: "Failed to update program" };
    }
}

export async function deleteProgram(programId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.program.delete({
            where: { id: programId },
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete program:", error);
        return { error: "Failed to delete program" };
    }
}

export async function getClientById(id: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null;

    try {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                coach: { select: { id: true, name: true } },
                assignedPrograms: true,
            },
        });
    } catch (error) {
        console.error("Failed to fetch client:", error);
        return null;
    }
}

export async function assignProgramToClient(userId: string, programId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                assignedPrograms: {
                    connect: { id: programId },
                },
            },
        });

        revalidatePath(`/dashboard/admin/clients/${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to assign program:", error);
        return { error: "Failed to assign program" };
    }
}

export async function unassignProgramFromClient(userId: string, programId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                assignedPrograms: {
                    disconnect: { id: programId },
                },
            },
        });

        revalidatePath(`/dashboard/admin/clients/${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to unassign program:", error);
        return { error: "Failed to unassign program" };
    }
}

export async function updateClientProfile(userId: string, data: any) {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await prisma.profile.update({
            where: { userId },
            data: {
                ...data,
                // Ensure dates/numbers are parsed correctly if present
                weight: data.weight ? parseFloat(data.weight) : undefined,
                height: data.height ? parseFloat(data.height) : undefined,
            }
        });

        // Also update the name on the User model if provided
        if (data.name) {
            await prisma.user.update({
                where: { id: userId },
                data: { name: data.name }
            });
        }

        revalidatePath(`/dashboard/admin/clients/${userId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}
