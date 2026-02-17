import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    return (
        <div className="h-screen flex items-center justify-center bg-black-rich text-white">
            <div className="text-center p-8 max-w-md">
                <div className="mx-auto mb-6 h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 animate-in zoom-in duration-500">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-4">You're In.</h1>
                <p className="text-white/60 mb-8">
                    Welcome to the elite. Your subscription is active and your coach has been notified.
                    Prepare to work.
                </p>
                <Link
                    href="/dashboard"
                    className="block w-full bg-brand hover:bg-brand-600 text-black-rich font-bold py-4 uppercase tracking-widest transition-all"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
