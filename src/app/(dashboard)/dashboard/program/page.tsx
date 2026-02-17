import { ChevronRight, PlayCircle, Clock, BarChart } from "lucide-react";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getProgram } from "@/app/actions/program";
import { requireSubscription } from "@/lib/subscription-guard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProgramPage() {
    await requireSubscription();
    const programData = await getProgram();
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const assignment = await prisma.assignment.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
        include: {
            program: {
                include: {
                    workouts: {
                        include: {
                            exercises: true
                        },
                        orderBy: { order: "asc" }
                    }
                }
            }
        }
    });

    if (!assignment) {
        return (
            <div className="p-8 text-center space-y-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">No Active Program</h1>
                <p className="text-white/50 max-w-md mx-auto">Your coach hasn't assigned an active program to you yet. Check back soon or message your coach.</p>
                <Link href="/dashboard/messages" className="inline-block mt-4 px-6 py-3 bg-brand text-black-rich font-bold uppercase tracking-widest text-xs">
                    Message Coach
                </Link>
            </div>
        );
    }

    const { program } = assignment;

    // Fetch completion status (simulated for now, would ideally check ProgressLog filtered by workout completions)
    const completions = await prisma.progressLog.findMany({
        where: {
            userId: session.user.id,
            metrics: {
                path: ['type'],
                equals: 'WORKOUT_COMPLETION'
            }
        }
    });

    const completedWorkoutIds = completions.map((c: any) => (c.metrics as any).workoutId);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
                    {program.title}
                </h1>
                <div className="flex items-center gap-4 text-white/50 text-sm font-bold uppercase tracking-[0.1em]">
                    <span className="bg-brand text-black-rich px-3 py-1 rounded-sm">
                        Current Program
                    </span>
                    <span>Started {new Date(assignment.startDate).toLocaleDateString()}</span>
                </div>
                <p className="mt-8 text-white/70 max-w-2xl text-lg leading-relaxed">
                    {program.description}
                </p>
            </div>

            <div className="grid gap-4">
                {program.workouts.map((workout: any, index: any) => {
                    const isCompleted = completedWorkoutIds.includes(workout.id);
                    return (
                        <div
                            key={workout.id}
                            className={`group relative overflow-hidden rounded-xl border p-8 transition-all duration-300 ${isCompleted
                                ? "bg-white/[0.02] border-brand/20 opacity-60"
                                : "bg-black-light border-white/10 hover:border-brand/50 hover:bg-brand/[0.02]"
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10 relative">
                                <div className="flex items-center gap-8">
                                    <div className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${isCompleted
                                        ? "bg-brand/20 border-brand text-brand"
                                        : "bg-white/5 border-white/10 text-white group-hover:bg-brand group-hover:border-brand group-hover:text-black-rich"
                                        }`}>
                                        {isCompleted ? (
                                            <span className="font-black text-2xl animate-in zoom-in-50 duration-500">✓</span>
                                        ) : (
                                            <PlayCircle className="h-8 w-8" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl font-black uppercase tracking-tight ${isCompleted ? "text-brand" : "text-white"}`}>
                                            {workout.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-6 mt-2 text-sm text-white/40 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand/50" /> 60 Min</span>
                                            <span className="flex items-center gap-2"><BarChart className="h-4 w-4 text-brand/50" /> High Intensity</span>
                                            <span>{workout.exercises.length} Exercises</span>
                                        </div>
                                    </div>
                                </div>

                                {!isCompleted ? (
                                    <Link
                                        href={`/dashboard/workout/${workout.id}`}
                                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black-rich font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-brand transition-all hover:scale-[1.05]"
                                    >
                                        Start Workout <ChevronRight className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <span className="text-brand font-black uppercase tracking-widest text-xs px-6 py-3 border border-brand/20 bg-brand/5 rounded-full">
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
