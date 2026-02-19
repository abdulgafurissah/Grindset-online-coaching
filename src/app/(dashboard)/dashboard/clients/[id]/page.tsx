import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Dumbbell, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
    const session = await auth();
    // In real app, ensure user is coach/admin

    const client = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            profile: true,
            assignments: {
                where: { status: "ACTIVE" },
                include: { program: true }
            },
            progress: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!client) return notFound();

    // Process logs
    const workoutLogs = client.progress.filter((log: any) => log.metrics?.type === "WORKOUT_COMPLETION");
    const weightLogs = client.progress.filter((log: any) => log.metrics?.weight).slice(0, 10); // Last 10 weight entries

    const activeProgram = client.assignments[0]?.program;
    const totalWorkouts = workoutLogs.length;
    const lastWorkout = workoutLogs[0] ? new Date(workoutLogs[0].date).toLocaleDateString() : "N/A";

    return (
        <div className="p-8 text-black-rich">
            <Link href="/dashboard/clients" className="flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
            </Link>

            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-xl relative">
                        {client.image ? (
                            <Image
                                src={client.image}
                                alt={client.name || "Client"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-4xl">
                                {client.name?.[0] || "U"}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-black-rich mb-1">{client.name}</h1>
                        <p className="text-slate-500 mb-4">{client.email}</p>
                        <div className="flex gap-3">
                            {activeProgram ? (
                                <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-brand/20">
                                    {activeProgram.title}
                                </span>
                            ) : (
                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">
                                    No Active Program
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-slate-500">Total Workouts</p>
                        <Dumbbell className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-black-rich">{totalWorkouts}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-slate-500">Last Workout</p>
                        <Calendar className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-black-rich">{lastWorkout === "N/A" ? "-" : lastWorkout}</div>
                    {lastWorkout !== "N/A" && <p className="text-xs text-slate-400 mt-1">Checked in</p>}
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-slate-500">Current Weight</p>
                        <TrendingUp className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-black-rich">
                        {(weightLogs[0]?.metrics as any)?.weight || "-"} <span className="text-sm font-normal text-slate-400">lbs</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-slate-500">Program Status</p>
                        <CheckCircle className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-black-rich">{activeProgram ? "Active" : "Pending"}</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Workouts List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-black-rich">Recent Workouts</h3>
                    </div>
                    <div className="p-0">
                        {workoutLogs.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Workout</th>
                                        <th className="px-6 py-3 text-right">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {workoutLogs.slice(0, 5).map((log: any) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-black-rich font-medium">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {(log.metrics as any)?.title || "Workout Session"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">
                                                {(log.metrics as any)?.duration || "45m"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                No workouts logged yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Weight History List */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-black-rich">Weight History</h3>
                    </div>
                    <div className="p-0">
                        {weightLogs.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Weight (lbs)</th>
                                        <th className="px-6 py-3 text-right">Body Fat %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {weightLogs.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-black-rich font-medium">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-black-rich font-bold">
                                                {(log.metrics as any)?.weight}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">
                                                {(log.metrics as any)?.bodyFat || "-"}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                No weight logs yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
