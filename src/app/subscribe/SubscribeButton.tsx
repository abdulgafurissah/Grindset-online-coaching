"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createSubscription } from "@/app/actions/finance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SubscribeButton({ planId, finalPrice }: { planId: string, finalPrice: number }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubscribe = async () => {
        setLoading(true);
        const res = await createSubscription(planId);
        if (res?.success) {
            toast.success("Successfully subscribed!");
            router.push("/dashboard");
        } else {
            toast.error(res?.error || "Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full h-12 text-base font-bold bg-black-rich hover:bg-black text-white hover:scale-[1.02] transition-transform flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {loading ? "Processing..." : finalPrice === 0 ? "Start Free Now" : "Subscribe Now"}
        </Button>
    );
}
