import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/dashboards/ClientDashboard";
import { CoachDashboard } from "@/components/dashboards/CoachDashboard";

export default async function DashboardPage() {
    const session = await auth();
    // casting to any because of TS issue with extended session types in this file context, 
    // real app should have proper type augmentation in d.ts
    const userRole = (session?.user as any)?.role || "CLIENT";

    if (userRole === "ADMIN") {
        redirect("/dashboard/admin");
    }

    if (userRole === "COACH") {
        return <CoachDashboard />;
    }

    return <ClientDashboard user={session?.user} />;
}
