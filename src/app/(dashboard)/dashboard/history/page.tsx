import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function HistoryPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const logs = await prisma.progress.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
        take: 50,
    });

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-black-rich">Workout History</h1>
                    <p className="text-slate-500">Recent training logs and check-ins.</p>
                </div>

                {logs.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">
                        No workouts logged yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3 text-right">Duration</th>
                                    <th className="px-6 py-3 text-right">Weight</th>
                                    <th className="px-6 py-3 text-right">Body Fat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => {
                                    const metrics = log.metrics as any;
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-black-rich font-medium">
                                                {new Date(log.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {metrics?.title || "Workout Session"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">
                                                {metrics?.duration ? `${metrics.duration}m` : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">
                                                {metrics?.weight ? `${metrics.weight} lbs` : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-400">
                                                {metrics?.bodyFat ? `${metrics.bodyFat}%` : "-"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
