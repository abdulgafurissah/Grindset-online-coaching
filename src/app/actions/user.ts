"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(data: { name: string; bio: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Unauthorized" };

        const userId = session.user.id;

        // Update the main User table for name
        await prisma.user.update({
            where: { id: userId },
            data: { name: data.name },
        });

        // Update the Profile table for bio (creates if it doesn't exist)
        await prisma.profile.upsert({
            where: { userId },
            update: { bio: data.bio },
            create: {
                userId,
                bio: data.bio,
            }
        });

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}
