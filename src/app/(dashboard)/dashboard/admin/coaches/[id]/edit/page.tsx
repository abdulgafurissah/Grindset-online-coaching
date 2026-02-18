"use client";

import { updateCoach } from "@/app/actions/admin-coach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { useState, use } from "react"; // Added 'use' import
import { toast } from "sonner";

export default function EditCoachPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap params with use()
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            specialty: formData.get("specialty") as string,
            commissionRate: parseFloat(formData.get("commissionRate") as string),
            qualification: formData.get("qualification") as string,
        };

        const result = await updateCoach(id, data);

        if (result.success) {
            toast.success("Coach updated");
            router.push("/dashboard/admin/coaches");
            router.refresh();
        } else {
            toast.error("Failed to update coach");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <Link href="/dashboard/admin/coaches" className="inline-flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Coaches
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-black-rich">Edit Coach</h1>
                    <p className="text-slate-500">Update coach details and commission.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" name="specialty" placeholder="e.g. HIIT" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="qualification">Qualification</Label>
                                <Input id="qualification" name="qualification" placeholder="e.g. NASM CPT" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="commissionRate">Commission Rate (0-1)</Label>
                            <Input id="commissionRate" name="commissionRate" type="number" step="0.01" min="0" max="1" placeholder="0.8" />
                            <p className="text-xs text-slate-400">0.8 = 80% to Coach</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard/admin/coaches">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-brand text-black-rich hover:bg-brand/90 font-bold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
