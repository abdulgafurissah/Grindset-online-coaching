"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoach } from "@/app/actions/admin-coach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AddCoachPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await createCoach(null, formData);

        if (result?.error) {
            setError(typeof result.error === "string" ? result.error : "Failed to create coach");
            setLoading(false);
        } else {
            toast.success("Coach created successfully");
            router.push("/dashboard/admin/coaches");
            router.refresh();
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <Link href="/dashboard/admin/coaches" className="inline-flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Coaches
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-black-rich">Add New Coach</h1>
                    <p className="text-slate-500">Create a profile for a new coach.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" name="specialty" placeholder="e.g. Bodybuilding" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="commissionRate">Commission Rate (0-1)</Label>
                                <Input id="commissionRate" name="commissionRate" type="number" step="0.01" min="0" max="1" defaultValue="0.8" />
                                <p className="text-xs text-slate-400">0.8 = 80% to Coach</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard/admin/coaches">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-brand text-black-rich hover:bg-brand/90 font-bold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Coach
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
