import { redirect } from "next/navigation";

export default function SubscribePage() {
    // Redirect all legacy traffic from /subscribe to the new PayPal checkout flow
    redirect("/dashboard/billing");
}
