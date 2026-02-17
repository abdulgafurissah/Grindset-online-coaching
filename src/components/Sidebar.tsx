"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
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
    ShieldCheck
} from "lucide-react";

const commonLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const clientLinks = [
    { href: "/dashboard/program", label: "My Program", icon: Dumbbell },
    { href: "/dashboard/nutrition", label: "Nutrition", icon: Utensils },
    { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
];

const coachLinks = [
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/programs", label: "Program Builder", icon: Dumbbell },
];

const adminLinks = [
    { href: "/dashboard/admin", label: "System Admin", icon: ShieldCheck },
    { href: "/dashboard/clients", label: "All Users", icon: Users },
];

export function Sidebar() {
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
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black-rich flex flex-col">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 mb-8">
                    <div className="relative h-10 w-10">
                        <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-widest">GRINDSET</span>
                </Link>
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
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand text-black-rich font-bold"
                                        : "text-white/70 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-white/10 p-4">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
