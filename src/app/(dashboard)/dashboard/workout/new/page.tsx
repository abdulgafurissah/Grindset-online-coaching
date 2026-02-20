"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logWorkout } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewWorkoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await logWorkout(formData);

        if (result?.success) {
            toast.success("Workout logged");
            router.push("/dashboard");
            router.refresh();
        } else {
            toast.error(result?.error || "Failed to log workout");
        }

        setLoading(false);
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-black-rich">Log Workout</h1>
                    <p className="text-slate-500">Track your session and update your progress.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Workout Title</Label>
                            <Input id="title" name="title" required placeholder="e.g. Upper Body Strength" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration (minutes)</Label>
                                <Input id="duration" name="duration" type="number" min="0" step="1" placeholder="45" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" name="date" type="date" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="weight">Weight (lbs)</Label>
                                <Input id="weight" name="weight" type="number" min="1" step="0.1" placeholder="185" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                                <Input id="bodyFat" name="bodyFat" type="number" min="0" step="0.1" placeholder="18.5" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" name="notes" placeholder="How did it feel? PRs, notes, or feedback." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Link href="/dashboard">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-brand text-black-rich hover:bg-brand/90 font-bold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Log Workout
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
