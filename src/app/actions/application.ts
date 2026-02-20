"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const type = formData.get("type") as string; // 'CLIENT' or 'COACH'
    const details = formData.get("details") as string;

    if (!name || !email || !type) {
        return { error: "Missing required fields" };
    }

    try {
        await prisma.application.create({
            data: {
                name,
                email,
                type,
                details: details ? { message: details } : null,
            },
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to submit application:", error);
        return { error: "Failed to submit application" };
    }
}
