"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ... imports
import { logWorkoutSchema } from "@/lib/validations";

export async function logWorkout(workoutId: string, performanceData: any) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const validation = logWorkoutSchema.safeParse({ workoutId, metrics: performanceData });
    if (!validation.success) {
        return { error: "Invalid data", details: validation.error.flatten() };
    }

    try {
        // Find the user's progress log for today or create one
        // ... (rest of logic) ...

        // Update workout status or create a log entry
        // For now, let's just log it in ProgressLog as a completed workout
        await prisma.progressLog.create({
            data: {
                userId: session.user.id,
                date: new Date(),
                metrics: {
                    type: "WORKOUT_COMPLETION",
                    workoutId,
                    ...performanceData
                }
            }
        });

        revalidatePath("/dashboard/program");
        return { success: true };
    } catch (error) {
        console.error("Failed to log workout:", error);
        return { error: "Failed to log workout" };
    }
}
