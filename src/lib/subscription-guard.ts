import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireSubscription() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Admins and Coaches bypass subscription check
    const role = (session.user as any).role;
    if (role === "ADMIN" || role === "COACH") return;

    // --- PAYWALL DISABLED FOR TESTING ---
    if (process.env.NODE_ENV === 'development') {
        console.log("Subscription check bypassed for development.");
        return;
    }
    // --- END ---

    // Check DB subscription
    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    });

    if (!subscription || subscription.status !== "ACTIVE" || subscription.currentPeriodEnd < new Date()) {
        redirect("/dashboard/billing");
    }
}
