"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Don't show navbar on dashboard pages if there's a separate layout, but request says "everypage"
    // Assuming dashboard has its own sidebar, but maybe we still want this navbar or a different one?
    // Usually logged in users on landing page see "Dashboard" button.
    // Let's implement the requested "show user name and logout button".

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled || mobileMenuOpen
                    ? "bg-black-rich/90 backdrop-blur-md border-white/10 py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative h-12 w-12">
                        <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-white/80 hover:text-brand transition-colors">
                        Home
                    </Link>
                    <Link href="/coaches" className="text-sm font-medium text-white/80 hover:text-brand transition-colors">
                        Coaches
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-white/80 hover:text-brand transition-colors">
                        Pricing
                    </Link>
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-6">
                    {session?.user ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-white">{session.user.name}</p>
                                    <p className="text-xs text-white/60">{session.user.email}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-brand/20 flex items-center justify-center text-brand border border-brand/50">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-white hover:text-brand transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-none uppercase text-xs tracking-widest transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-white hover:text-brand transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-2 px-6 rounded-none uppercase text-xs tracking-widest transition-all"
                            >
                                Join Now
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black-rich border-b border-white/10 flex flex-col p-6 gap-6 shadow-2xl animate-in slide-in-from-top-5">
                    {session?.user && (
                        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                            <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center text-brand border border-brand/50">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-white">{session.user.name}</p>
                                <p className="text-xs text-white/60">{session.user.email}</p>
                            </div>
                        </div>
                    )}

                    <Link
                        href="/"
                        className="text-lg font-medium text-white hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/coaches"
                        className="text-lg font-medium text-white hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Coaches
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-lg font-medium text-white hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </Link>

                    {session?.user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-lg font-medium text-white hover:text-brand transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <hr className="border-white/10" />
                            <button
                                onClick={() => {
                                    signOut({ callbackUrl: "/" });
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left text-lg font-medium text-red-500 hover:text-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <hr className="border-white/10" />
                            <Link
                                href="/login"
                                className="text-lg font-medium text-white hover:text-brand transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-4 px-6 text-center uppercase text-sm tracking-widest transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Join Now
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
