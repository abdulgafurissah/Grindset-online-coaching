"use client";

import { useEffect, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPayPalSubscription } from "@/app/actions/payment";

/*
  For Sandbox Testing:
  - Create a sandbox Business account (seller) and Personal account (buyer) at developer.paypal.com.
  - Create a Subscription Plan in the Sandbox Business account dashboard or via API.
  - Copy the Plan ID (e.g., P-1234567890).
*/

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";
// In production, ensure this env var is set!

interface PayPalSubscriptionProps {
    planId: string;
    onSuccess?: () => void;
}

export function PayPalSubscription({ planId, onSuccess }: PayPalSubscriptionProps) {
    const router = useRouter();

    return (
        <PayPalScriptProvider options={{
            "clientId": PAYPAL_CLIENT_ID,
            "vault": true,
            "intent": "subscription"
        }}>
            <PayPalButtons
                style={{
                    shape: "rect",
                    color: "gold",
                    layout: "vertical",
                    label: "subscribe"
                }}
                createSubscription={(data, actions) => {
                    return actions.subscription.create({
                        plan_id: planId // Replace with your actual Plan ID from PayPal Dashboard
                    });
                }}
                onApprove={async (data, actions) => {
                    // Start backend verification
                    try {
                        // In a real app, you might want to call your backend to verify the subscription status
                        // For now we trust the client callback success for MVP, but update our DB
                        // data.subscriptionID is crucial
                        await createPayPalSubscription(data.subscriptionID, planId);

                        toast.success("Subscription active! Welcome to the Grind.");
                        if (onSuccess) onSuccess();
                        router.refresh(); // Refresh to update UI state
                    } catch (error) {
                        console.error("Subscription error", error);
                        toast.error("Failed to activate subscription locally. Please contact support.");
                    }
                }}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    toast.error("An error occurred with PayPal.");
                }}
            />
        </PayPalScriptProvider>
    );
}
