import { Activity, Dumbbell, Trophy, Utensils } from "lucide-react";

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
                <div className="text-right">
                    <p className="text-sm text-brand font-bold uppercase tracking-widest">Current Phase</p>
                    <p className="text-xl font-bold text-white">Hypertrophy Block I</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card title="Workouts Completed" value="12" total="/ 20" icon={Dumbbell} change="+2 this week" />
                <Card title="Current Weight" value="84.5" unit="kg" icon={Activity} change="-0.5kg" isPositive />
                <Card title="Daily Calories" value="2,400" total="/ 2,800" icon={Utensils} />
                <Card title="Streak" value="14" unit="Days" icon={Trophy} className="border-brand/50 bg-brand/5" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black-light p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">Today's Training</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black-rich rounded-lg border border-white/5 hover:border-brand/30 transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-brand/10 rounded flex items-center justify-center text-brand">
                                    <Dumbbell className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Push A (Chest & Delts)</h4>
                                    <p className="text-sm text-white/50">45 - 60 mins • High Volume</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-brand text-black-rich text-xs font-bold uppercase rounded-sm hover:bg-brand-600">
                                Start
                            </button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black-light p-6">
                    <h3 className="mb-4 text-xl font-bold text-white">Nutrition Goals</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Protein</span>
                                <span className="text-white font-bold">140 / 220g</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-brand w-[65%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Carbs</span>
                                <span className="text-white font-bold">200 / 300g</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]" />
                            </div>
                        </div>
                    </div>
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
