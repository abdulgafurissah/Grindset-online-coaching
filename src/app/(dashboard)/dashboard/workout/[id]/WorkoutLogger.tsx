"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Trophy } from "lucide-react";
import { logWorkout } from "@/app/actions/workout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WorkoutLoggerProps {
    workoutId: string;
    exerciseCount: number;
}

export function WorkoutLogger({ workoutId, exerciseCount }: WorkoutLoggerProps) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const router = useRouter();

    async function handleComplete() {
        setLoading(true);
        const result = await logWorkout(workoutId, {
            exerciseCount,
            completedAt: new Date().toISOString(),
        });
        setLoading(false);

        if (result.success) {
            setCompleted(true);
            toast.success("Workout completed! Great work.");
            setTimeout(() => {
                router.push("/dashboard/program");
            }, 2000);
        } else {
            toast.error(result.error || "Failed to log workout");
        }
    }

    if (completed) {
        return (
            <div className="bg-brand text-black-rich p-6 rounded-xl shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10" />
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Session Complete!</h3>
                        <p className="font-bold text-sm opacity-80 uppercase tracking-widest">Victory logged to your profile</p>
                    </div>
                </div>
                <div className="h-10 w-10 flex items-center justify-center bg-black-rich text-brand rounded-full">
                    <Check className="h-6 w-6" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black-rich border border-white/10 p-6 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
            <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Finish Workout</h3>
                <p className="text-white/50 text-xs uppercase font-bold tracking-widest">Log details and sync with your coach</p>
            </div>
            <Button
                onClick={handleComplete}
                disabled={loading}
                className="w-full sm:w-auto px-12 py-6 bg-brand text-black-rich hover:bg-brand/90 font-black uppercase tracking-[0.2em] shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Complete Session"}
            </Button>
        </div>
    );
}
