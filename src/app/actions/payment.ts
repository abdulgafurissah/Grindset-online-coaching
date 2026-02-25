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

export async function finalizePaymentLinkSubscription(planId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const plan = await prisma.paymentPlan.findUnique({
        where: { id: planId }
    });

    if (!plan) throw new Error("Plan not found");

    // Standardize interval
    const currentPeriodEnd = new Date();
    if ((plan.interval || "").toLowerCase() === "year") {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    const subscriptionId = `sub_link_${Date.now()}`;

    // Update or create subscription
    await prisma.subscription.upsert({
        where: { userId: session.user.id },
        update: {
            paypalSubscriptionId: subscriptionId,
            status: "ACTIVE",
            planId: plan.id,
            currentPeriodEnd
        },
        create: {
            userId: session.user.id,
            paypalSubscriptionId: subscriptionId,
            status: "ACTIVE",
            planId: plan.id,
            currentPeriodEnd
        }
    });

    // Record the Payment for Admin dashboard
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const coachId = user?.coachId || null;
    let coachShare = 0;
    let finalPlatformShare = plan.price;

    if (coachId) {
        coachShare = plan.price * 0.8;
        finalPlatformShare = plan.price * 0.2;
    }

    await prisma.payment.create({
        data: {
            amount: plan.price,
            status: "COMPLETED",
            userId: session.user.id,
            coachId,
            coachShare,
            platformShare: finalPlatformShare,
            isPaidOut: false,
        }
    });

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard/admin");
    return { success: true };
}
