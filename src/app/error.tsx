"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error caught:", error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black-rich text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="mb-6 text-white/60 text-center max-w-md">
                We encountered an unexpected error. Please try again later.
            </p>
            <Button onClick={() => reset()} variant="secondary">
                Try again
            </Button>
        </div>
    );
}
