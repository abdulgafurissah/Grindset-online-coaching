"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { authenticate } from "@/app/actions/auth";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        // ... auth logic
        // For now, since we don't have the actual generic auth function in the snippet, 
        // I will assume the existing logic structure is what we keep, just updating UI.
        // Actually, the previous file showed `authenticate(undefined, formData)`.

        try {
            const result = await authenticate(undefined, formData);
            if (result) {
                setError(result);
            }
        } catch (e) {
            setError("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-[100dvh] lg:grid lg:grid-cols-2">
            {/* Visual Side (Hidden on Mobile) */}
            <div className="hidden lg:relative lg:flex h-full w-full flex-col bg-slate-900 p-10 text-white dark:border-r">
                <div className="absolute inset-0 bg-black-rich" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-50" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Assuming logo has white text version or we need filter */}
                        <div className="relative h-10 w-10">
                            <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold uppercase tracking-tighter">Grindset</span>
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform completely changed my approach to fitness. The coaching is world-class and the results speak for themselves.&rdquo;
                        </p>
                        <footer className="text-sm font-bold text-brand">Sofia Davis, Elite Member</footer>
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
                            Welcome Back
                        </h1>
                        <p className="text-sm text-black-rich/60">
                            Enter your credentials to access your dashboard
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={onSubmit}>
                            <div className="grid gap-4">
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
                                        disabled={isLoading}
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black-rich ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium leading-none text-black-rich" htmlFor="password">
                                            Password
                                        </label>
                                        <Link href="#" className="text-sm font-medium text-brand hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black-rich ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-white hover:bg-brand-600 h-11 px-4 py-2 shadow-lg shadow-brand/20"
                                >
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    )}
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="px-8 text-center text-sm text-black-rich/60">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-brand hover:underline underline-offset-4">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
