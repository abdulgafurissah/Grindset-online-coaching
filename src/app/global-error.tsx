"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black-rich text-white">
                <div className="flex h-screen w-full flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Critical Error</h2>
                    <p className="mb-6 text-white/60 text-center max-w-md">
                        A critical system error occurred.
                    </p>
                    <Button onClick={() => reset()} variant="secondary">
                        Try again
                    </Button>
                </div>
            </body>
        </html>
    );
}
