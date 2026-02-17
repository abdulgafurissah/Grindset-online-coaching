"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createCheckoutSession(priceId: string, _formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: session.user.email,
            metadata: {
                userId: userId,
            },
            success_url: `${APP_URL}/dashboard/billing?success=true`,
            cancel_url: `${APP_URL}/dashboard/billing?canceled=true`,
        });

        if (!checkoutSession.url) {
            throw new Error("Failed to create checkout session");
        }

        redirect(checkoutSession.url);
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}

export async function createCustomerPortal(_formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
    });

    if (!subscription?.stripeId) {
        throw new Error("No subscription found");
    }

    try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeId);
        const customerId = typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${APP_URL}/dashboard/billing`,
        });

        if (!portalSession.url) {
            throw new Error("Failed to create portal session");
        }

        redirect(portalSession.url);
    } catch (error) {
        console.error("Error creating portal session:", error);
        throw error;
    }
}

export async function getSubscriptionStatus() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
    });

    if (!subscription) return null;

    // Check if valid
    const isValid =
        subscription.status === "active" &&
        subscription.currentPeriodEnd.getTime() > Date.now();

    return {
        ...subscription,
        isValid
    };
}
