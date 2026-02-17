import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is missing in webhook metadata", { status: 400 });
        }

        await prisma.subscription.create({
            data: {
                userId: session.metadata.userId,
                stripeId: subscription.id,
                status: subscription.status,
                priceId: subscription.items.data[0].price.id,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // Find the subscription in DB by stripeId
        const existingSub = await prisma.subscription.findUnique({
            where: { stripeId: subscription.id },
        });

        if (existingSub) {
            await prisma.subscription.update({
                where: { stripeId: subscription.id },
                data: {
                    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                    status: subscription.status,
                },
            });
        }
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
            where: { stripeId: subscription.id },
            data: {
                status: "canceled", // or subscription.status
            }
        });
    }

    // Handle other events like customer.subscription.updated if needed for status changes

    return new NextResponse(null, { status: 200 });
}
