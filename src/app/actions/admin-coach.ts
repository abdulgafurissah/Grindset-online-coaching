"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Schema for creating a coach
const CreateCoachSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    specialty: z.string().optional(),
    commissionRate: z.number().min(0).max(1).optional(),
});

export async function createCoach(prevState: any, formData: FormData) {
    const validatedFields = CreateCoachSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        specialty: formData.get("specialty"),
        commissionRate: formData.get("commissionRate") ? parseFloat(formData.get("commissionRate") as string) : 0.8,
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { name, email, password, specialty, commissionRate } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "Email already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "COACH",
                approvalStatus: "APPROVED", // Auto-approve admin created coaches
                profile: {
                    create: {
                        specialty,
                        commissionRate,
                        bio: "New Coach",
                        qualification: "Pending Verification",
                        rating: 5.0
                    }
                }
            }
        });

        revalidatePath("/dashboard/admin/coaches");
        return { success: true };
    } catch (error) {
        console.error("Create Coach Error:", error);
        return { error: "Failed to create coach" };
    }
}

export async function updateCoach(id: string, data: { specialty?: string; commissionRate?: number; qualification?: string }) {
    try {
        await prisma.profile.update({
            where: { userId: id },
            data: {
                ...data
            }
        });
        revalidatePath("/dashboard/admin/coaches");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update coach" };
    }
}
