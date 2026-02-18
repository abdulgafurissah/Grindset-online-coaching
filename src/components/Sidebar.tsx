"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Dumbbell,
    Utensils,
    MessageSquare,
    TrendingUp,
    Settings,
    LogOut,
    Users,
    ShieldCheck,
    X,
    Menu,
    DollarSign
} from "lucide-react";

const commonLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const clientLinks: any[] = [];

const coachLinks = [
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/finances", label: "My Earnings", icon: TrendingUp },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/coaches", label: "Coaches", icon: Dumbbell },
    { href: "/dashboard/admin/finances", label: "Financials", icon: DollarSign },
    { href: "/dashboard/clients", label: "Users", icon: Users },
];

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // cast to any because our session type augmentation might not be picked up by IDE perfectly yet
    // or we can just treat it as unknown and check property
    const info = (session?.user as any) || {};
    const role = info.role || "CLIENT";

    let links = [...commonLinks.slice(0, 1), ...clientLinks, ...commonLinks.slice(1)];

    if (role === "COACH") {
        links = [...commonLinks.slice(0, 1), ...coachLinks, ...commonLinks.slice(1)];
    } else if (role === "ADMIN") {
        links = [...commonLinks.slice(0, 1), ...adminLinks, ...commonLinks.slice(1)];
    }

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
                className
            )}
        >
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
                    <div className="relative h-8 w-8 md:h-10 md:w-10">
                        <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                    </div>
                    <span className="text-lg md:text-xl font-bold text-black-rich tracking-widest">GRINDSET</span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-slate-500 hover:text-black-rich">
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-brand text-white shadow-md shadow-brand/20"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-brand"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-100 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
