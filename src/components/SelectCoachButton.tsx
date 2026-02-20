"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignCoach } from "@/app/actions/coach";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SelectCoachButtonProps {
    coachId: string;
    coachName: string;
}

export function SelectCoachButton({ coachId, coachName }: SelectCoachButtonProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSelect = async () => {
        if (status === "unauthenticated") {
            router.push(`/register?coachId=${coachId}`);
            return;
        }

        setLoading(true);
        const result = await assignCoach(coachId);
        setLoading(false);

        if (result.success) {
            toast.success(`You are now training with ${coachName}!`);
            router.push("/dashboard");
        } else {
            toast.error(result.error || "Failed to select coach.");
        }
    };

    return (
        <Button
            onClick={handleSelect}
            disabled={loading || status === "loading"}
            className="block w-full py-3 bg-black-rich hover:bg-brand text-white text-center font-bold uppercase text-sm tracking-widest rounded-lg transition-colors"
        >
            {loading ? <Loader2 className="animate-spin" /> : `Train with ${coachName}`}
        </Button>
    );
}
