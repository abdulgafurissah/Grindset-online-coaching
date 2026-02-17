import { auth } from "@/auth";
import { getSubscriptionStatus } from "@/app/actions/stripe";
import { redirect } from "next/navigation";

export async function requireSubscription() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Admins and Coaches bypass subscription check
    const role = (session.user as any).role;
    if (role === "ADMIN" || role === "COACH") return;

    const sub = await getSubscriptionStatus();
    if (!sub?.isValid) {
        redirect("/dashboard/billing");
    }
}
