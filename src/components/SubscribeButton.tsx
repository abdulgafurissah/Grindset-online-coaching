"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SubscribeButtonProps {
    planId: string;
    paymentLink: string;
}

export function SubscribeButton({ planId, paymentLink }: SubscribeButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        setIsLoading(true);
        // Store intended plan in a cookie before navigating away
        document.cookie = `checkout_plan_id=${planId}; path=/; max-age=${60 * 60 * 24}`; // 24 hours

        // Navigate to the PayPal link in the same tab
        window.location.href = paymentLink;
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-brand text-black-rich hover:bg-brand/90 shadow-brand/20 shadow-lg font-bold uppercase tracking-wider transition-all"
        >
            {isLoading ? "Redirecting..." : "Subscribe on PayPal"}
        </Button>
    );
}
