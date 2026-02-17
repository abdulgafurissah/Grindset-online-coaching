"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function getProgram() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // Find active assignment for the user
    const assignment = await prisma.assignment.findFirst({
        where: {
            userId: session.user.id,
            status: "ACTIVE"
        },
        include: {
            program: {
                include: {
                    workouts: {
                        orderBy: { order: "asc" },
                        include: {
                            exercises: {
                                orderBy: { order: "asc" },
                                include: { exercise: true }
                            }
                        }
                    }
                }
            }
        }
    });

    return assignment?.program || null;
}
