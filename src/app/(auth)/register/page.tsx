"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { registerUser } from "@/app/actions/auth"; // Import action
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await registerUser(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Account created! Please log in.");
                router.push("/login");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-[100dvh] lg:grid lg:grid-cols-2">
            {/* Visual Side */}
            <div className="hidden lg:relative lg:flex h-full w-full flex-col bg-slate-900 p-10 text-white dark:border-r">
                <div className="absolute inset-0 bg-black-rich" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-10 w-10">
                            <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold uppercase tracking-tighter">Grindset</span>
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Joining Grindset was the best investment I&apos;ve made in myself. The comprehensive approach to health and performance is unmatched.&rdquo;
                        </p>
                        <footer className="text-sm font-bold text-brand">Marcus Johnson, Elite Member</footer>
                    </blockquote>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                    {/* Mobile Logo */}
                    <div className="flex flex-col items-center gap-2 mb-2 lg:hidden">
                        <Link href="/">
                            <div className="relative h-12 w-12">
                                <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                            </div>
                        </Link>
                    </div>

                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-black-rich">
                            Join the Elite
                        </h1>
                        <p className="text-sm text-black-rich/60">
                            Create your account to start your journey
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none text-black-rich" htmlFor="name">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        required
                                        disabled={isLoading}
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black-rich ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none text-black-rich" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        required
                                        disabled={isLoading}
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black-rich ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none text-black-rich" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        required
                                        minLength={6}
                                        disabled={isLoading}
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black-rich ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-white hover:bg-brand-600 h-11 px-4 py-2 shadow-lg shadow-brand/20"
                                >
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    )}
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="px-8 text-center text-sm text-black-rich/60">
                        <Link href="/login" className="hover:text-brand underline underline-offset-4">
                            Already have an account? <span className="font-bold text-brand">Sign In</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
