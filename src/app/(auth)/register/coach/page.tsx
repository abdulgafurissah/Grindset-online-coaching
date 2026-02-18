import { Navbar } from "@/components/Navbar";
import CoachRegistrationForm from "@/components/auth/CoachRegistrationForm";
import Link from "next/link";

export default function CoachRegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Navbar Clone for consistency without full processing */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6">
                <Link href="/" className="font-bold text-xl text-black-rich tracking-widest">GRINDSET</Link>
            </nav>

            <main className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-black-rich mb-4 uppercase tracking-tight">Become a Coach</h1>
                    <p className="text-slate-600 text-lg">Join the elite team of Grindset coaches. Submit your application below.</p>
                </div>

                <CoachRegistrationForm />
            </main>
        </div>
    );
}
