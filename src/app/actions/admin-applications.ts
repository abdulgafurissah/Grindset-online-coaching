"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveCoach(id: string) {
    try {
        await prisma.user.update({
            where: { id },
            data: { approvalStatus: "APPROVED" }
        });
        revalidatePath("/dashboard/admin/applications");
    } catch (error) {
        console.error("Error approving coach:", error);
    }
}

export async function rejectCoach(id: string) {
    try {
        await prisma.user.update({
            where: { id },
            data: { approvalStatus: "REJECTED" }
        });
        revalidatePath("/dashboard/admin/applications");
    } catch (error) {
        console.error("Error rejecting coach:", error);
    }
}
