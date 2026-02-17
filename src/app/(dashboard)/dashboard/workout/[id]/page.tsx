import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, CheckCircle2, Clock, BarChart, Info } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutLogger } from "./WorkoutLogger";
import { requireSubscription } from "@/lib/subscription-guard";

export default async function WorkoutPage({ params }: { params: { id: string } }) {
    await requireSubscription();
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = params;

    const workout = await prisma.workout.findUnique({
        where: { id },
        include: {
            exercises: {
                include: {
                    exercise: true,
                },
                orderBy: { order: "asc" },
            },
            program: true,
        },
    });

    if (!workout) {
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <Link
                href="/dashboard/program"
                className="inline-flex items-center gap-2 text-white/50 hover:text-brand transition-colors font-bold uppercase text-xs tracking-widest"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Program
            </Link>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-sm uppercase tracking-widest text-[10px] font-bold">
                        {workout.program.title}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-white/50 text-xs uppercase font-medium">Session ID: {workout.id.slice(-6)}</span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    {workout.title}
                </h1>
                <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                    {workout.description || "No description provided for this workout."}
                </p>
            </div>

            <div className="grid gap-6">
                {workout.exercises.map((workoutExercise: any, index: number) => (
                    <Card key={workoutExercise.id} className="bg-black-light border-white/10 text-white overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 bg-brand text-black-rich rounded-full flex items-center justify-center font-black text-lg">
                                    {index + 1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                        {workoutExercise.exercise.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/40">
                                        <span className="flex items-center gap-1">
                                            <BarChart className="h-3 w-3" /> {workoutExercise.sets} Sets
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> {workoutExercise.reps} Reps
                                        </span>
                                        {workoutExercise.rest && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {workoutExercise.rest}s Rest
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {workoutExercise.exercise.videoUrl && (
                                <a
                                    href={workoutExercise.exercise.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-brand hover:text-brand hover:bg-brand/10 uppercase tracking-widest text-[10px]")}
                                >
                                    Watch Tutorial
                                </a>
                            )}
                        </div>
                        {workoutExercise.exercise.description && (
                            <div className="px-6 pb-6 pt-0 border-t border-white/5 mt-4 pt-4">
                                <p className="text-xs text-white/50 leading-relaxed flex items-start gap-2">
                                    <Info className="h-3 w-3 mt-0.5 shrink-0 text-brand/50" />
                                    {workoutExercise.exercise.description}
                                </p>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <div className="sticky bottom-8 z-50">
                <WorkoutLogger workoutId={workout.id} exerciseCount={workout.exercises.length} />
            </div>
        </div>
    );
}
