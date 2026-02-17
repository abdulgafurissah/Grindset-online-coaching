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
        <>
            <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-white/10">
                    <div className="absolute inset-0 bg-black-rich" />
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 block">
                        <Image
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                            alt="Register background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-10 w-10">
                                <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                            </div>
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Joining Grindset was the best investment I&apos;ve made in myself. The comprehensive approach to health and performance is unmatched.&rdquo;
                            </p>
                            <footer className="text-sm text-brand">Marcus Johnson, Elite Member</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8 bg-black-rich h-full flex items-center">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {/* Mobile Logo */}
                        <div className="flex justify-center mb-4 lg:hidden">
                            <Link href="/">
                                <div className="relative h-12 w-12">
                                    <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                                Join the Elite
                            </h1>
                            <p className="text-sm text-muted-foreground text-white/60">
                                Create your account to start your journey
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <form onSubmit={onSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white" htmlFor="name">
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
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-black-light px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white" htmlFor="email">
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
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-black-light px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white" htmlFor="password">
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
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-black-light px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand text-black-rich hover:bg-brand/90 h-10 px-4 py-2 uppercase tracking-wide font-bold"
                                    >
                                        {isLoading && (
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black-rich border-t-transparent"></span>
                                        )}
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>

                        <p className="px-8 text-center text-sm text-muted-foreground text-white/50">
                            <Link href="/login" className="hover:text-brand underline underline-offset-4">
                                Already have an account? Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
