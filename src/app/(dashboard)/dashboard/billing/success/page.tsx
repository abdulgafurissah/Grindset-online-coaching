"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { finalizePaymentLinkSubscription } from "@/app/actions/payment";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingSuccessPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const router = useRouter();
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) return;

        async function processPayment() {
            hasProcessed.current = true;
            try {
                // Read the cookie
                const match = document.cookie.match(new RegExp('(^| )checkout_plan_id=([^;]+)'));
                const planId = match ? match[2] : null;

                if (!planId) {
                    setStatus("error");
                    return;
                }

                // Finalize the subscription
                const result = await finalizePaymentLinkSubscription(planId);

                if (result.success) {
                    // Clear the cookie
                    document.cookie = "checkout_plan_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error("Payment finalization failed:", error);
                setStatus("error");
            }
        }

        processPayment();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 max-w-lg mx-auto text-center">
            {status === "loading" && (
                <>
                    <Loader2 className="w-16 h-16 text-brand animate-spin mb-6 mx-auto" />
                    <h1 className="text-3xl font-black text-black-rich uppercase tracking-tight mb-2">Processing Payment...</h1>
                    <p className="text-slate-500">Please wait while we confirm your subscription.</p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle2 className="w-20 h-20 text-green-500 mb-6 mx-auto bg-green-50 rounded-full p-2" />
                    <h1 className="text-3xl font-black text-black-rich uppercase tracking-tight mb-2">Payment Successful!</h1>
                    <p className="text-slate-500 mb-8">Welcome to the Grindset. Your premium plan is now active.</p>
                    <Button
                        onClick={() => router.push("/dashboard/billing")}
                        className="bg-brand text-black-rich hover:bg-brand/90 font-bold uppercase w-full max-w-xs mx-auto"
                    >
                        Return to Billing
                    </Button>
                </>
            )}

            {status === "error" && (
                <>
                    <AlertCircle className="w-20 h-20 text-red-500 mb-6 mx-auto bg-red-50 rounded-full p-2" />
                    <h1 className="text-3xl font-black text-black-rich uppercase tracking-tight mb-2">Payment Verification Failed</h1>
                    <p className="text-slate-500 mb-8">We couldn't verify your payment. If you were charged, please contact support.</p>
                    <Button
                        onClick={() => router.push("/dashboard/billing")}
                        variant="outline"
                        className="font-bold uppercase w-full max-w-xs mx-auto"
                    >
                        Return to Billing
                    </Button>
                </>
            )}
        </div>
    );
}
