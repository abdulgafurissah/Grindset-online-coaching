"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-white hover:text-brand transition-colors">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-2 px-6 rounded-none uppercase text-xs tracking-widest transition-all"
                    >
                        Join Now
                    </Link>
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
                </div>
            )}
        </nav>
    );
}
