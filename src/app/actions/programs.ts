
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function createProgram(formData: FormData): Promise<ActionResponse> {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const link = formData.get("link") as string;
        const image = formData.get("image") as string; // Ideally handle file upload, for now assume URL string

        if (!title || !link) {
            return { success: false, error: "Title and Link are required" };
        }

        await prisma.program.create({
            data: {
                title,
                description,
                link,
                image,
                creatorId: session.user.id!,
            },
        });

        revalidatePath("/dashboard/admin/programs");
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Create Program Error:", error);
        return { success: false, error: "Failed to create program" };
    }
}

export async function updateProgram(formData: FormData): Promise<ActionResponse> {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const link = formData.get("link") as string;
        const image = formData.get("image") as string;

        if (!id || !title || !link) {
            return { success: false, error: "Missing required fields" };
        }

        await prisma.program.update({
            where: { id },
            data: {
                title,
                description,
                link,
                image,
            },
        });

        revalidatePath("/dashboard/admin/programs");
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Update Program Error:", error);
        return { success: false, error: "Failed to update program" };
    }
}

export async function deleteProgram(id: string): Promise<ActionResponse> {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.program.delete({
            where: { id },
        });

        revalidatePath("/dashboard/admin/programs");
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Delete Program Error:", error);
        return { success: false, error: "Failed to delete program" };
    }
}

export async function getPrograms() {
    try {
        const programs = await prisma.program.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: { name: true, email: true }
                }
            }
        });
        return programs;
    } catch (error) {
        console.error("Get Programs Error:", error);
        return [];
    }
}
