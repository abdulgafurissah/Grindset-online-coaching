import DashboardLayoutClient from "@/components/DashboardLayoutClient";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Safety check, middleware should handle auth but just in case
    if (!session?.user) {
        redirect("/login");
    }

    const role = (session.user as any).role;

    // Subscription Guard for CLIENTS
    if (role === "CLIENT") {
        const subscription = await prisma.subscription.findUnique({
            where: { userId: session.user.id }
        });

        const hasActiveSubscription = subscription && new Date(subscription.currentPeriodEnd) > new Date();

        // If no active subscription, force them to the subscribe page
        if (!hasActiveSubscription) {
            redirect("/subscribe");
        }
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
