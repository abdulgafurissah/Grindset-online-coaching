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

    // Allow all clients to access the dashboard. 
    // Subscription status is handled gracefully on individual pages (ClientDashboard, Billing).

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
