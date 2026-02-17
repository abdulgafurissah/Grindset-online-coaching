"use client";

import { useState, useRef } from "react";
import { Utensils, Search, Plus, Trash2, X } from "lucide-react";
import { addNutritionLog, deleteNutritionLog, addHydrationLog } from "@/app/actions/nutrition";
import { format } from "date-fns";
import { toast } from "sonner";

// Default goals (could be fetched from user profile in future)
const GOALS = {
    calories: 2800,
    protein: 220,
    carbs: 300,
    fats: 80,
    water: 4000 // ml
};

export function NutritionTracker({ nutritionLogs, hydrationLogs }: { nutritionLogs: any[], hydrationLogs: any[] }) {
    const [isAddingMeal, setIsAddingMeal] = useState(false);

    // Calculate totals
    const totalCalories = nutritionLogs.reduce((acc, log) => acc + log.calories, 0);
    const totalProtein = nutritionLogs.reduce((acc, log) => acc + log.protein, 0);
    const totalCarbs = nutritionLogs.reduce((acc, log) => acc + log.carbs, 0);
    const totalFats = nutritionLogs.reduce((acc, log) => acc + log.fats, 0);

    const totalWater = hydrationLogs.reduce((acc, log) => acc + log.amount, 0);

    const handleAddWater = async () => {
        const result = await addHydrationLog(250);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Water added!");
        }
    };

    const handleDeleteLog = async (id: string) => {
        const result = await deleteNutritionLog(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Meal removed");
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
                        Nutrition <span className="text-brand">Tracker</span>
                    </h1>
                    <p className="text-white/60">Log your meals and track your macros.</p>
                </div>
                <button
                    onClick={() => setIsAddingMeal(true)}
                    className="flex items-center gap-2 bg-brand hover:bg-brand-600 text-black-rich font-bold py-3 px-6 rounded-none uppercase text-sm tracking-widest transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Log Meal
                </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Daily Overview */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Macro Summary */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <MacroCard label="Protein" current={totalProtein} target={GOALS.protein} unit="g" color="bg-brand" />
                        <MacroCard label="Carbs" current={totalCarbs} target={GOALS.carbs} unit="g" color="bg-blue-500" />
                        <MacroCard label="Fats" current={totalFats} target={GOALS.fats} unit="g" color="bg-yellow-500" />
                    </div>

                    {/* Meal Log */}
                    <div className="rounded-xl border border-white/10 bg-black-light p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Today's Meals</h3>
                        </div>

                        {nutritionLogs.length === 0 ? (
                            <div className="text-center py-8 text-white/40">
                                No meals logged yet today.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {nutritionLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-4 bg-black-rich rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white">{log.name}</h4>
                                            <p className="text-xs text-white/50">{format(new Date(log.createdAt), "hh:mm a")} • {log.calories} kcal</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-4 text-xs font-mono">
                                                <div className="text-center">
                                                    <span className="block text-brand font-bold">{log.protein}g</span>
                                                    <span className="text-white/30">P</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-blue-500 font-bold">{log.carbs}g</span>
                                                    <span className="text-white/30">C</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-yellow-500 font-bold">{log.fats}g</span>
                                                    <span className="text-white/30">F</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteLog(log.id)}
                                                className="text-white/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black-light p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-brand" />
                            Calories Remaining
                        </h3>
                        <div className="text-center py-6">
                            <div className="text-5xl font-black text-white mb-2">
                                {Math.max(0, GOALS.calories - totalCalories)}
                            </div>
                            <p className="text-white/60 text-sm">kcal left from {GOALS.calories} goal</p>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${Math.min(100, (totalCalories / GOALS.calories) * 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black-light p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Hydration</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-3xl font-bold text-blue-400">{(totalWater / 1000).toFixed(1)}L</div>
                            <span className="text-white/40">/ {(GOALS.water / 1000).toFixed(1)}L Goal</span>
                        </div>
                        <div className="grid grid-cols-8 gap-1 mb-4">
                            {Array.from({ length: 8 }).map((_, i) => {
                                const chunk = GOALS.water / 8;
                                const filled = totalWater >= (i + 1) * chunk;
                                return (
                                    <div key={i} className={`h-8 rounded-sm transition-all duration-300 ${filled ? "bg-blue-500/80" : "bg-white/5"}`} />
                                );
                            })}
                        </div>
                        <button
                            onClick={handleAddWater}
                            className="w-full mt-4 py-2 border border-white/10 rounded-md text-sm text-white hover:border-brand hover:text-brand transition-colors"
                        >
                            + Add Water (250ml)
                        </button>
                    </div>
                </div>
            </div>

            {isAddingMeal && (
                <AddMealModal onClose={() => setIsAddingMeal(false)} />
            )}
        </div>
    );
}

function MacroCard({ label, current, target, unit, color }: any) {
    const percentage = Math.min(100, (current / target) * 100);

    return (
        <div className="rounded-xl border border-white/10 bg-black-light p-6">
            <div className="flex justify-between items-end mb-2">
                <span className="text-white/60 font-medium">{label}</span>
                <span className="text-brand font-bold text-lg">{current} / {target}{unit}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}

function AddMealModal({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await addNutritionLog(formData);
        setIsLoading(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Meal added successfully");
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-rich/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-black-light border border-white/10 rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Log Meal</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Meal Name</label>
                        <input name="name" required placeholder="e.g. Chicken Salad" className="w-full bg-black-rich border border-white/10 rounded-md px-3 py-2 text-white focus:border-brand focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Calories</label>
                            <input name="calories" type="number" required placeholder="0" className="w-full bg-black-rich border border-white/10 rounded-md px-3 py-2 text-white focus:border-brand focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Protein (g)</label>
                            <input name="protein" type="number" required placeholder="0" className="w-full bg-black-rich border border-white/10 rounded-md px-3 py-2 text-white focus:border-brand focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Carbs (g)</label>
                            <input name="carbs" type="number" required placeholder="0" className="w-full bg-black-rich border border-white/10 rounded-md px-3 py-2 text-white focus:border-brand focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70">Fats (g)</label>
                            <input name="fats" type="number" required placeholder="0" className="w-full bg-black-rich border border-white/10 rounded-md px-3 py-2 text-white focus:border-brand focus:outline-none" />
                        </div>
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-brand text-black-rich font-bold py-3 rounded-md hover:bg-brand-600 transition-colors mt-2"
                    >
                        {isLoading ? "Saving..." : "Add to Log"}
                    </button>
                </form>
            </div>
        </div>
    )
}
