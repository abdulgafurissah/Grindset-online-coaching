import {
    Calendar,
    ArrowRight,
    Play,
    MessageSquare,
    User
} from "lucide-react";
import Link from "next/link";
import { getPrograms } from "@/app/actions/programs";
import prisma from "@/lib/prisma";

export async function ClientDashboard({ user }: { user?: any }) {
    if (!user?.id) return null;

    const clientData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            coach: { select: { id: true, name: true, email: true, image: true } },
            assignedPrograms: true // Fetch explicitly assigned programs
        }
    });

    const firstName = clientData?.name?.split(" ")[0] || "Athlete";
    const coach = clientData?.coach;

    let displayPrograms = clientData?.assignedPrograms || [];

    // If the client has no coach and no explicitly assigned programs, fetch general admin programs
    if (!coach && displayPrograms.length === 0) {
        // Find general programs created by any ADMIN
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
        const adminIds = admins.map((a: { id: string }) => a.id);

        displayPrograms = await prisma.program.findMany({
            where: {
                creatorId: { in: adminIds }
            },
            orderBy: { createdAt: 'desc' },
            take: 4 // Limit general programs shown
        });
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-black-rich uppercase tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">
                        Welcome back, <span className="font-bold text-brand">{firstName}</span>.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Featured Programs Section - Primary Focus */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-black-rich">
                                {coach ? "Your Assigned Programs" : "General Programs"}
                            </h2>
                            <span className="text-sm font-bold text-brand">{displayPrograms.length} Available</span>
                        </div>

                        {displayPrograms.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {displayPrograms.map((program: any) => (
                                    <div key={program.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            {program.image ? (
                                                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900">
                                                    <div className="w-16 h-16 opacity-20 bg-slate-700 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-black text-xl">GS</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-white font-bold text-xl leading-tight shadow-sm mb-1">{program.title}</h3>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col bg-white">
                                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">{program.description || "No description provided."}</p>
                                            <a
                                                href={program.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-black-rich text-white font-bold rounded-lg hover:bg-brand transition-colors text-sm uppercase tracking-wide"
                                            >
                                                <Play className="w-4 h-4 fill-white" /> Start Program
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
                                <p>No programs assigned yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">

                    {/* Coach Card */}
                    <div className="bg-black-rich rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-brand" /> Your Coach
                            </h3>

                            {coach ? (
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-brand flex items-center justify-center overflow-hidden">
                                            {coach.image ? (
                                                <img src={coach.image} alt={coach.name || "Coach"} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-brand">{coach.name?.[0] || "C"}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg leading-tight">{coach.name}</p>
                                            <p className="text-slate-400 text-sm">{coach.email}</p>
                                        </div>
                                    </div>
                                    <Link href="/dashboard/messages" className="block w-full py-3 bg-brand text-black-rich text-center rounded-lg font-bold text-sm hover:bg-brand/90 transition-colors">
                                        Message Coach
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-slate-400 mb-4 text-sm">No coach assigned yet.</p>
                                    <Link href="/coaches" className="block w-full py-2 bg-white/10 border border-white/20 text-white text-center rounded-lg font-bold text-sm hover:bg-white/20 transition-colors">
                                        Browse Coaches
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
