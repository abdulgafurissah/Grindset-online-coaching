
import { auth } from "@/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function JoinAsCoachCTA() {
    const session = await auth();
    const role = (session?.user as any)?.role;

    // If user is Admin or Coach, don't show the button
    if (role === "ADMIN" || role === "COACH") {
        return null;
    }

    return (
        <div className="flex justify-center mt-12 mb-8 w-full">
            <Link
                href="/register/coach"
                className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-black text-black bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
                <span className="relative z-10 font-bold uppercase tracking-wider">Become a Coach</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
            </Link>
        </div>
    );
}
