"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Dumbbell, ChevronRight, ChevronDown } from "lucide-react";
import { createProgram } from "@/app/actions/coach";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ExerciseDraft {
    name: string;
    sets: number;
    reps: string;
    rest: number;
}

interface WorkoutDraft {
    title: string;
    description: string;
    exercises: ExerciseDraft[];
}

export default function NewProgramPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [workouts, setWorkouts] = useState<WorkoutDraft[]>([]);

    // Temporary state for adding a new workout
    const [activeWorkoutIndex, setActiveWorkoutIndex] = useState<number | null>(null);

    const addWorkout = () => {
        setWorkouts([...workouts, { title: `Workout ${workouts.length + 1}`, description: "", exercises: [] }]);
        setActiveWorkoutIndex(workouts.length);
    };

    const removeWorkout = (index: number) => {
        setWorkouts(workouts.filter((_, i) => i !== index));
        if (activeWorkoutIndex === index) setActiveWorkoutIndex(null);
    };

    const updateWorkout = (index: number, field: keyof WorkoutDraft, value: any) => {
        const newWorkouts = [...workouts];
        newWorkouts[index] = { ...newWorkouts[index], [field]: value };
        setWorkouts(newWorkouts);
    };

    const addExercise = (workoutIndex: number) => {
        const newWorkouts = [...workouts];
        newWorkouts[workoutIndex].exercises.push({
            name: "",
            sets: 3,
            reps: "10",
            rest: 60
        });
        setWorkouts(newWorkouts);
    };

    const updateExercise = (workoutIndex: number, exerciseIndex: number, field: keyof ExerciseDraft, value: any) => {
        const newWorkouts = [...workouts];
        newWorkouts[workoutIndex].exercises[exerciseIndex] = {
            ...newWorkouts[workoutIndex].exercises[exerciseIndex],
            [field]: value
        };
        setWorkouts(newWorkouts);
    };

    const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
        const newWorkouts = [...workouts];
        newWorkouts[workoutIndex].exercises = newWorkouts[workoutIndex].exercises.filter((_, i) => i !== exerciseIndex);
        setWorkouts(newWorkouts);
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Please enter a program title");
            return;
        }
        if (workouts.length === 0) {
            toast.error("Please add at least one workout");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createProgram({
                title,
                description,
                workouts
            });

            if (result.success) {
                toast.success("Program created successfully!");
                router.push("/dashboard/programs");
            } else {
                toast.error("Failed to create program");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Create Program</h1>
                    <p className="text-white/60">Design a new training block.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-brand text-black-rich hover:bg-brand-600">
                        {isSubmitting ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Program</>}
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Program Details & Workout List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-black-light p-6 rounded-xl border border-white/10 space-y-4">
                        <div>
                            <Label htmlFor="title">Program Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Hypertrophy Block I"
                                className="bg-black-rich border-white/10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="desc">Description</Label>
                            <Input
                                id="desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief goal description..."
                                className="bg-black-rich border-white/10"
                            />
                        </div>
                    </div>

                    <div className="bg-black-light p-6 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">Workouts</h3>
                            <Button size="sm" variant="ghost" onClick={addWorkout} className="text-brand hover:text-brand-600 p-0 h-auto">
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {workouts.map((workout, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveWorkoutIndex(index)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${activeWorkoutIndex === index
                                            ? "bg-brand/10 border-brand/50"
                                            : "bg-black-rich border-white/5 hover:border-white/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded flex items-center justify-center ${activeWorkoutIndex === index ? "bg-brand text-black-rich" : "bg-white/5 text-white/50"}`}>
                                            <Dumbbell className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${activeWorkoutIndex === index ? "text-brand" : "text-white"}`}>
                                                {workout.title || `Workout ${index + 1}`}
                                            </p>
                                            <p className="text-xs text-white/40">{workout.exercises.length} exercises</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 h-6 w-6 text-white/40 hover:text-red-500"
                                        onClick={(e) => { e.stopPropagation(); removeWorkout(index); }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {workouts.length === 0 && (
                                <div className="text-center py-8 text-white/30 text-sm border-2 border-dashed border-white/5 rounded-lg">
                                    No workouts added yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Workout Editor */}
                <div className="lg:col-span-2">
                    {activeWorkoutIndex !== null && workouts[activeWorkoutIndex] ? (
                        <div className="bg-black-light p-6 rounded-xl border border-white/10 h-full">
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <div>
                                    <Label className="text-xs uppercase tracking-wider text-white/50">Editing Workout</Label>
                                    <Input
                                        value={workouts[activeWorkoutIndex].title}
                                        onChange={(e) => updateWorkout(activeWorkoutIndex, "title", e.target.value)}
                                        className="bg-transparent border-none text-xl font-bold p-0 h-auto focus-visible:ring-0 placeholder:text-white/20"
                                        placeholder="Workout Name"
                                    />
                                </div>
                                <Button onClick={() => addExercise(activeWorkoutIndex)} size="sm" className="bg-white/10 hover:bg-white/20 text-white border-none">
                                    <Plus className="h-4 w-4 mr-2" /> Add Exercise
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {workouts[activeWorkoutIndex].exercises.map((exercise, exIndex) => (
                                    <div key={exIndex} className="bg-black-rich p-4 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="flex gap-4 items-start">
                                            <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50 mt-2">
                                                {exIndex + 1}
                                            </div>
                                            <div className="flex-1 grid gap-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-xs text-white/40">Exercise Name</Label>
                                                        <Input
                                                            value={exercise.name}
                                                            onChange={(e) => updateExercise(activeWorkoutIndex, exIndex, "name", e.target.value)}
                                                            placeholder="e.g. Barbell Squat"
                                                            className="bg-black-light border-white/10 h-9"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <Label className="text-xs text-white/40">Sets</Label>
                                                        <Input
                                                            type="number"
                                                            value={exercise.sets}
                                                            onChange={(e) => updateExercise(activeWorkoutIndex, exIndex, "sets", parseInt(e.target.value))}
                                                            className="bg-black-light border-white/10 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-white/40">Reps</Label>
                                                        <Input
                                                            value={exercise.reps}
                                                            onChange={(e) => updateExercise(activeWorkoutIndex, exIndex, "reps", e.target.value)}
                                                            placeholder="e.g. 8-12"
                                                            className="bg-black-light border-white/10 h-9"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-white/40">Rest (sec)</Label>
                                                        <Input
                                                            type="number"
                                                            value={exercise.rest}
                                                            onChange={(e) => updateExercise(activeWorkoutIndex, exIndex, "rest", parseInt(e.target.value))}
                                                            className="bg-black-light border-white/10 h-9"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeExercise(activeWorkoutIndex, exIndex)}
                                                className="text-white/20 hover:text-red-500 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {workouts[activeWorkoutIndex].exercises.length === 0 && (
                                    <div className="text-center py-12 text-white/20">
                                        <Dumbbell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                        <p>No exercises in this workout yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-black-light p-6 rounded-xl border border-white/10 h-full flex flex-col items-center justify-center text-center text-white/40">
                            <Dumbbell className="h-16 w-16 mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-white mb-2">Select a Workout</h3>
                            <p className="max-w-xs">Choose a workout from the left to edit its details and add exercises.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
