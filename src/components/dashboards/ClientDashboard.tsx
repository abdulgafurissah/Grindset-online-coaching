import { Activity } from "lucide-react";

export function ClientDashboard({ user }: { user?: any }) {
    const firstName = user?.name?.split(" ")[0] || "Athlete";

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                        Welcome back, <span className="text-brand">{firstName}</span>
                    </h1>
                    <p className="text-white/60">Here is your daily briefing.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">

            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black-light p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">Upcoming Sessions</h3>
                    <div className="text-white/40 text-sm">No upcoming sessions scheduled.</div>
                </div>
            </div>
        </div>
    );
}

function Card({
    title,
    value,
    total,
    unit,
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
                {total && <span className="text-sm text-white/40">{total}</span>}
                {unit && <span className="text-sm text-white/40">{unit}</span>}
            </div>
            {change && (
                <p className={`text-xs mt-2 ${isPositive ? "text-green-500" : "text-white/40"}`}>
                    {change}
                </p>
            )}
        </div>
    )
}
