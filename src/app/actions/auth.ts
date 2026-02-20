"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.string().optional(),
    dob: z.string().optional(),
    phoneNumber: z.string().optional(),
    nationality: z.string().optional(),
    whatsappNumber: z.string().optional(),
    emergencyContact: z.string().optional(),
    weight: z.string().optional(),
    height: z.string().optional(),
    medicalConditions: z.string().optional(),
    allergies: z.string().optional(),
    goals: z.string().optional(),
    lifestyleHabits: z.string().optional(),
    anyRelevantHealthInfo: z.string().optional(),
});

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "CLIENT", // Default role
                profile: {
                    create: {
                        gender: validatedFields.data.gender || null,
                        dob: validatedFields.data.dob ? new Date(validatedFields.data.dob) : null,
                        phoneNumber: validatedFields.data.phoneNumber || null,
                        nationality: validatedFields.data.nationality || null,
                        whatsappNumber: validatedFields.data.whatsappNumber || null,
                        emergencyContact: validatedFields.data.emergencyContact || null,
                        weight: validatedFields.data.weight ? parseFloat(validatedFields.data.weight) : null,
                        height: validatedFields.data.height ? parseFloat(validatedFields.data.height) : null,
                        medicalConditions: validatedFields.data.medicalConditions || null,
                        allergies: validatedFields.data.allergies || null,
                        goals: validatedFields.data.goals || null,
                        lifestyleHabits: validatedFields.data.lifestyleHabits || null,
                        anyRelevantHealthInfo: validatedFields.data.anyRelevantHealthInfo || null,
                    }
                }
            },
        });

        // We can't automatically sign in with server actions easily without redirecting to a credential login flow
        // But we can try calling signIn directly. 
        // However, usually it's better to redirect to login or auto-login.
        // Let's try to just return success and let the client redirect to login.

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: error instanceof Error ? error.message : "Failed to create account" };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
