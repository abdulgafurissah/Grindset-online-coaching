
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/actions";

export async function createConsultation(data: FormData): Promise<ActionResponse> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Please log in to book a consultation." };
        }

        const coachId = data.get("coachId") as string;
        const message = data.get("message") as string;
        const requestedAtString = data.get("requestedAt") as string;

        if (!coachId || !requestedAtString) {
            return { success: false, error: "Missing required fields" };
        }

        const requestedAt = new Date(requestedAtString);
        if (isNaN(requestedAt.getTime())) {
            return { success: false, error: "Invalid date" };
        }

        await prisma.consultation.create({
            data: {
                clientId: session.user.id,
                coachId,
                message,
                requestedAt,
                status: "PENDING"
            }
        });

        // revalidatePath("/coaches"); // Maybe? 
        return { success: true };
    } catch (error) {
        console.error("Create Consultation Error:", error);
        return { success: false, error: "Failed to book consultation" };
    }
}

export async function createAdminConsultation(data: FormData): Promise<ActionResponse> {
    try {
        const session = await auth();
        // Allow not logged in users for now, or require login?
        // Hero button is public. The user wants them to talk to admin first.
        // We'll require login because Consultation requires a clientId in the schema.
        if (!session?.user?.id) {
            return { success: false, error: "Please log in to book a consultation." };
        }

        const message = data.get("message") as string;
        const requestedAtString = data.get("requestedAt") as string;

        if (!requestedAtString) {
            return { success: false, error: "Missing requested date" };
        }

        const requestedAt = new Date(requestedAtString);
        if (isNaN(requestedAt.getTime())) {
            return { success: false, error: "Invalid date" };
        }

        // Find the first ADMIN user
        const admin = await prisma.user.findFirst({
            where: { role: "ADMIN" }
        });

        if (!admin) {
            return { success: false, error: "No admin available to book with at this time." };
        }

        await prisma.consultation.create({
            data: {
                clientId: session.user.id,
                coachId: admin.id,
                message,
                requestedAt,
                status: "PENDING"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Create Admin Consultation Error:", error);
        return { success: false, error: "Failed to book consultation" };
    }
}
