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
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                scrolled || mobileMenuOpen
                    ? "bg-white/90 backdrop-blur-md border-slate-200 py-4 shadow-sm"
                    : "bg-transparent border-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative h-10 w-10">
                        {/* Assuming logo might need a dark background wrapper or is compatible. 
                             If logo is white text, we might need a background circle or invert it. 
                             For now, let's wrap it in a brand colored circle if it's white, or assume it works.
                             The logo.svg is likely the one users provided. 
                             Let's add a subtle background just in case if safe. 
                             Actually, 'text-brand' usually implies colored logo. */}
                        <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                    </div>
                    <span className={cn("text-xl font-bold uppercase tracking-tighter transition-colors",
                        scrolled || mobileMenuOpen ? "text-black-rich" : "text-black-rich"
                    )}>
                        Grindset
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {["Home", "Coaches", "Pricing"].map((item) => (
                        <Link
                            key={item}
                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                            className="text-sm font-medium text-black-rich/70 hover:text-brand transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                    {session?.user && (
                        <Link href="/dashboard" className="text-sm font-medium text-black-rich/70 hover:text-brand transition-colors">
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-6">
                    {session?.user ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-black-rich">{session.user.name}</p>
                                    <p className="text-xs text-black-rich/60">{session.user.email}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-black-rich/50 hover:text-red-500 font-medium text-xs uppercase tracking-widest transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-black-rich hover:text-brand transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-brand hover:bg-brand-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-brand/30 transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wide"
                            >
                                Join Now
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-black-rich p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col p-6 gap-6 shadow-xl animate-in slide-in-from-top-5">
                    {session?.user && (
                        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                            <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center text-brand border border-brand/20">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-black-rich">{session.user.name}</p>
                                <p className="text-xs text-black-rich/60">{session.user.email}</p>
                            </div>
                        </div>
                    )}

                    <Link
                        href="/"
                        className="text-lg font-medium text-black-rich hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/coaches"
                        className="text-lg font-medium text-black-rich hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Coaches
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-lg font-medium text-black-rich hover:text-brand transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </Link>

                    {session?.user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-lg font-medium text-black-rich hover:text-brand transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <hr className="border-slate-100" />
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
                            <hr className="border-slate-100" />
                            <Link
                                href="/login"
                                className="text-lg font-medium text-black-rich hover:text-brand transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-brand hover:bg-brand-600 text-white font-bold py-4 px-6 text-center rounded-lg shadow-md uppercase text-sm tracking-widest transition-all"
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
