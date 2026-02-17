"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function addNutritionLog(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const calories = parseInt(formData.get("calories") as string);
    const protein = parseInt(formData.get("protein") as string);
    const carbs = parseInt(formData.get("carbs") as string);
    const fats = parseInt(formData.get("fats") as string);

    if (!name || isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fats)) {
        return { error: "Invalid data" };
    }

    try {
        await prisma.nutritionLog.create({
            data: {
                userId: session.user.id,
                name,
                calories,
                protein,
                carbs,
                fats,
            },
        });
        revalidatePath("/dashboard/nutrition");
        return { success: true };
    } catch (error) {
        console.error("Error logging meal:", error);
        return { error: "Failed to log meal" };
    }
}

export async function deleteNutritionLog(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        // Ensure user owns the log
        const log = await prisma.nutritionLog.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!log || log.userId !== session.user.id) {
            return { error: "Unauthorized" };
        }

        await prisma.nutritionLog.delete({
            where: { id },
        });
        revalidatePath("/dashboard/nutrition");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete meal" };
    }
}

export async function addHydrationLog(amount: number) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        await prisma.hydrationLog.create({
            data: {
                userId: session.user.id,
                amount,
            },
        });
        revalidatePath("/dashboard/nutrition");
        return { success: true };
    } catch (error) {
        return { error: "Failed to log water" };
    }
}
