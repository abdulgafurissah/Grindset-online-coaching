import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { priceId } = await req.json();

        // Check if user already has a stripe customer id (mocked check for now)
        // const user = await prisma.user.findUnique(...)

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/pricing?canceled=true`,
            metadata: {
                userId: session.user.id!,
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
