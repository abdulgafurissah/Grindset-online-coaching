"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    // Use ref to not trigger re-render on initial mount but check screen size
    const isMobile = useRef(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-black-rich text-white duration-300">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 sticky top-0 bg-black-rich z-30">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white p-1 hover:bg-white/10 rounded-md transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="relative h-8 w-8">
                            <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-widest">GRINDSET</span>
                    </Link>
                </div>
            </header>

            {/* Sidebar */}
            {/* 
                - On desktop (md): translated-x-0 always.
                - On mobile: -translate-x-full by default, translated-x-0 if sidebarOpen.
            */}
            <Sidebar
                onClose={() => setSidebarOpen(false)}
                className={cn(
                    // Default state (mobile closed)
                    "-translate-x-full",
                    // Mobile Open state
                    sidebarOpen && "translate-x-0",
                    // Desktop state (always open)
                    "md:translate-x-0"
                )}
            />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main Content */}
            <main className="md:pl-64 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
