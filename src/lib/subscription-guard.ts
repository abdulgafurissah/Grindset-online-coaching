import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireSubscription() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Admins and Coaches bypass subscription check
    const role = (session.user as any).role;
    if (role === "ADMIN" || role === "COACH") return;

    // Check DB subscription
    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id }
    });

    if (!subscription || subscription.status !== "ACTIVE" || subscription.currentPeriodEnd < new Date()) {
        redirect("/dashboard/billing");
    }
}
