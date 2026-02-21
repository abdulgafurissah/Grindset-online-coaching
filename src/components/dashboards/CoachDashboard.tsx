import { Users, DollarSign, TrendingUp, CheckCircle, Clock, Dumbbell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCoachDashboardStats } from "@/app/actions/dashboard";
import { formatCurrency } from "@/lib/utils";

export async function CoachDashboard() {
    const stats = await getCoachDashboardStats();

    if (!stats) return null;

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black-rich uppercase tracking-tight">
                        Coach <span className="text-brand">Dashboard</span>
                    </h1>
                    <p className="text-slate-500">Manage your roster and track business growth.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card title="Active Clients" value={stats.activeClients.toString()} icon={Users} change="" isPositive />
                <Card title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={DollarSign} change="" isPositive />
                <Card
                    title="Active Programs"
                    value={stats.activePrograms.toString()}
                    icon={Dumbbell}
                    change="Published workouts"
                    isPositive={true}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Consultation Requests */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-bold text-black-rich flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand" />
                        Consultation Requests
                    </h3>
                    <div className="space-y-4">
                        {stats.pendingConsultations.length > 0 ? (
                            stats.pendingConsultations.map((consultation: any) => (
                                <div key={consultation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                                            {consultation.client.image ? (
                                                <img src={consultation.client.image} alt="Client" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-500">
                                                    {consultation.client.name?.[0] || "U"}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-black-rich">{consultation.client.name}</p>
                                            <p className="text-xs text-slate-400">{new Date(consultation.requestedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full">
                                        Pending
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                No pending consultation requests.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                    <h3 className="mb-4 text-xl font-bold text-black-rich flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-brand" />
                        Program Management
                    </h3>
                    <div className="flex-1 flex flex-col justify-center gap-4 text-slate-500 text-sm">
                        <p>You have <strong className="text-black-rich">{stats.activePrograms}</strong> active programs available for your clients.</p>
                        <p>Create generic or specialized workout plans, link your instructional videos, and assign them directly to your athletes.</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <Link href="/dashboard/programs" className="w-full flex items-center justify-center gap-2 py-3 bg-black-rich text-white font-bold rounded-lg hover:bg-brand transition-colors text-sm uppercase tracking-wide">
                            Manage Programs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    value,
    icon: Icon,
    change,
    isPositive,
    className
}: any) {
    return (
        <div className={`p-6 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">{title}</span>
                <Icon className="h-4 w-4 text-brand" />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-black-rich">{value}</span>
            </div>
            {change && (
                <p className={`text-xs mt-2 ${isPositive ? "text-green-600" : "text-brand"}`}>
                    {change}
                </p>
            )}
        </div>
    )
}
