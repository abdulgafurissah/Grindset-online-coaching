import {
    Activity,
    Calendar,
    Dumbbell,
    Utensils,
    Clock,
    Trophy,
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

    const [programs, clientData, logs, consultations] = await Promise.all([
        getPrograms(),
        prisma.user.findUnique({
            where: { id: user.id },
            include: { coach: { select: { name: true, email: true, image: true } } }
        }),
        prisma.progress.findMany({
            where: {
                userId: user.id,
                metrics: {
                    path: ['type'],
                    equals: "WORKOUT_COMPLETION"
                }
            },
            orderBy: { date: 'desc' },
            take: 3
        }),
        prisma.consultation.findMany({
            where: { clientId: user.id },
            include: { coach: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
            take: 5
        })
    ]);

    const firstName = clientData?.name?.split(" ")[0] || "Athlete";
    const coach = clientData?.coach;

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
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/workout/new"
                        className="px-5 py-2.5 bg-black-rich text-white font-bold rounded-lg hover:bg-brand transition-all shadow-lg shadow-black/20"
                    >
                        Log Workout
                    </Link>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Featured Programs Section - Primary Focus */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-black-rich">Your Programs</h2>
                            <span className="text-sm font-bold text-brand">{programs.length} Available</span>
                        </div>

                        {programs.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {programs.map((program: any) => (
                                    <div key={program.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            {program.image ? (
                                                <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900">
                                                    <Dumbbell className="w-16 h-16 opacity-20" />
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
                                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No programs assigned yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Today's Focus - Simplified */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-brand font-bold uppercase tracking-widest text-xs mb-2">
                                <Activity className="w-4 h-4" /> Today's Focus
                            </div>
                            <h3 className="text-xl font-bold text-black-rich">
                                {programs[0] ? `Continue: ${programs[0].title}` : "Rest & Recovery"}
                            </h3>
                        </div>
                        <button className="bg-slate-100 hover:bg-brand hover:text-white text-black-rich font-bold p-3 rounded-lg transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-black-rich">Recent Activity</h3>
                            <Link href="/dashboard/history" className="text-sm text-brand font-bold hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {logs.length > 0 ? (
                                logs.map((log: any) => (
                                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                                                <Dumbbell className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-black-rich text-sm">{(log.metrics as any)?.title || "Workout"}</p>
                                                <p className="text-xs text-slate-400">{new Date(log.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-black-rich text-sm">{(log.metrics as any)?.duration || "-"} min</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    No recent activity.
                                </div>
                            )}
                        </div>
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

                    {/* My Consultations */}
                    {clientData?.role === "CLIENT" && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-brand/10 rounded-lg text-brand">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-black-rich">Consultations</h3>
                            </div>
                            <div className="space-y-3">
                                {consultations && consultations.length > 0 ? (
                                    consultations.map((consultation: any) => (
                                        <div key={consultation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div>
                                                <p className="font-bold text-xs text-black-rich">{consultation.coach.name}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(consultation.requestedAt).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${consultation.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                consultation.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {consultation.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-2">No consultations scheduled.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Nutrition Quick Add */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-brand/10 rounded-lg text-brand">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-black-rich">Nutrition</h3>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500 font-medium">Daily Goal</span>
                                <span className="font-bold text-black-rich">1,250 / 2,400</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand w-[52%] rounded-full"></div>
                            </div>
                        </div>
                        <Link href="/dashboard/nutrition" className="block w-full py-3 border border-slate-200 text-black-rich text-center rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                            Log Meal
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
