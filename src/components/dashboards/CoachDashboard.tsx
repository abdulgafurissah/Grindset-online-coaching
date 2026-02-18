import { Users, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

export function CoachDashboard() {
    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                        Coach <span className="text-brand">Dashboard</span>
                    </h1>
                    <p className="text-white/60">Manage your roster and track business growth.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card title="Active Clients" value="24" icon={Users} change="+3 this month" isPositive />
                <Card title="Monthly Revenue" value="$4,200" icon={DollarSign} change="+12%" isPositive />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black-light p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">Action Items</h3>
                    <div className="text-white/40 text-sm">No pending actions.</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black-light p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">Recent Applications</h3>
                    <div className="flex items-center justify-center h-48 text-white/40">
                        No new applications.
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
        <div className={`p-6 rounded-xl border border-white/10 bg-black-light ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white/60">{title}</span>
                <Icon className="h-4 w-4 text-brand" />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{value}</span>
            </div>
            {change && (
                <p className={`text-xs mt-2 ${isPositive ? "text-green-500" : "text-white/40"}`}>
                    {change}
                </p>
            )}
        </div>
    )
}
