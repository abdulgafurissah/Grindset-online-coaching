import { z } from "zod";

export const createProgramSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    workouts: z.array(z.object({
        title: z.string().min(1, "Workout title is required"),
        description: z.string().optional(),
        exercises: z.array(z.object({
            name: z.string().min(1, "Exercise name is required"),
            sets: z.number().min(1, "Sets must be at least 1"),
            reps: z.string().min(1, "Reps are required"),
            rest: z.number().min(0, "Rest cannot be negative"),
            videoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
        }))
    })).min(1, "At least one workout is required")
});

export const logWorkoutSchema = z.object({
    workoutId: z.string().min(1, "Invalid Workout ID"),
    // Allow loose structure for flexibility, but ensure it's an object
    metrics: z.record(z.string(), z.any()).optional(),
});

export const updateApplicationStatusSchema = z.object({
    appId: z.string().min(1, "Invalid Application ID"),
    status: z.enum(["APPROVED", "REJECTED"]),
});

export const assignCoachSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    coachId: z.string().min(1, "Coach ID is required").nullable(),
});
