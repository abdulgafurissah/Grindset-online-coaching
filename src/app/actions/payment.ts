"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSubscriptionStatus() {
    const session = await auth();

    if (!session?.user?.id) {
        return { isValid: false, plan: null };
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    });

    if (!subscription) {
        return { isValid: false, plan: null };
    }

    const isValid =
        subscription.status === "ACTIVE" &&
        subscription.currentPeriodEnd.getTime() > Date.now();

    return {
        isValid,
        plan: subscription.planId
    };
}

export async function createPayPalSubscription(subscriptionId: string, planId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.subscription.upsert({
        where: { userId: session.user.id },
        update: {
            paypalSubscriptionId: subscriptionId,
            status: "ACTIVE",
            planId: planId,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Mock 30 days for now or get from PayPal details
        },
        create: {
            userId: session.user.id,
            paypalSubscriptionId: subscriptionId,
            status: "ACTIVE",
            planId: planId,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });

    revalidatePath("/dashboard/billing");
    return { success: true };
}
