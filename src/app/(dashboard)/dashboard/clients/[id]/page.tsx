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
        <div className="p-8">
            <Link href="/dashboard/clients" className="flex items-center text-white/50 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
            </Link>

            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-brand shadow-2xl relative">
                        {client.image ? (
                            <Image
                                src={client.image}
                                alt={client.name || "Client"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src={`https://ui-avatars.com/api/?name=${client.name || "User"}&background=random`}
                                alt={client.name || "Client"}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{client.name}</h1>
                        <p className="text-white/60 mb-2">{client.email}</p>
                        <div className="flex gap-3">
                            {activeProgram ? (
                                <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-brand/20">
                                    {activeProgram.title}
                                </span>
                            ) : (
                                <span className="bg-white/5 text-white/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    No Active Program
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-black-light p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-white/60">Total Workouts</p>
                        <Dumbbell className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalWorkouts}</div>
                </div>
                <div className="bg-black-light p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-white/60">Last Workout</p>
                        <Calendar className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-white">{lastWorkout === "N/A" ? "-" : lastWorkout}</div>
                    {lastWorkout !== "N/A" && <p className="text-xs text-white/40 mt-1">Checked in</p>}
                </div>
                <div className="bg-black-light p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-white/60">Current Weight</p>
                        <TrendingUp className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {(weightLogs[0]?.metrics as any)?.weight || "-"} <span className="text-sm font-normal text-white/40">lbs</span>
                    </div>
                </div>
                <div className="bg-black-light p-6 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-white/60">Program Status</p>
                        <CheckCircle className="h-4 w-4 text-brand" />
                    </div>
                    <div className="text-3xl font-bold text-white">{activeProgram ? "Active" : "Pending"}</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Workouts List */}
                <div className="bg-black-light rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-bold text-white">Recent Workouts</h3>
                    </div>
                    <div className="p-0">
                        {workoutLogs.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-white/40 font-medium text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Workout</th>
                                        <th className="px-6 py-3 text-right">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {workoutLogs.slice(0, 5).map((log: any) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-white/70">
                                                {/* If we stored workout title in metrics, use it, else generic */}
                                                {(log.metrics as any)?.title || "Workout Session"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-white/50">
                                                {(log.metrics as any)?.duration || "45m"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-white/30">
                                No workouts logged yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Weight History List (Simple Table for MVP) */}
                <div className="bg-black-light rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-bold text-white">Weight History</h3>
                    </div>
                    <div className="p-0">
                        {weightLogs.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-white/40 font-medium text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Weight (lbs)</th>
                                        <th className="px-6 py-3 text-right">Body Fat %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {weightLogs.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-white font-medium">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-white font-bold">
                                                {(log.metrics as any)?.weight}
                                            </td>
                                            <td className="px-6 py-4 text-right text-white/50">
                                                {(log.metrics as any)?.bodyFat || "-"}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-white/30">
                                No weight logs yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
