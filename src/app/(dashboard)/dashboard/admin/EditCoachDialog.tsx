"use client";

import { useState, useEffect } from "react";
import { Edit2, Loader2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateCoachProfile } from "@/app/actions/admin";
import { toast } from "sonner";

interface EditCoachDialogProps {
    coachId: string;
}

export default function EditCoachDialog({ coachId }: EditCoachDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // We'll manage state internally for now
    const [specialty, setSpecialty] = useState("General Coach");
    const [bio, setBio] = useState("");
    const [commissionRate, setCommissionRate] = useState(0.8);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateCoachProfile(coachId, {
            specialty,
            bio,
            commissionRate: Number(commissionRate)
        });

        if (result.success) {
            toast.success("Coach profile updated successfully.");
            setOpen(false);
            window.location.reload();
        } else {
            toast.error(result.error || "Update failed.");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="focus:bg-slate-100 focus:text-black-rich cursor-pointer rounded-sm flex items-center px-2 py-1.5 text-sm hover:bg-slate-100 w-full text-left">
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Coach Profile
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-black-rich text-center py-4">
                        Edit Coach Profile
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Specialty</label>
                        <input
                            type="text"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 focus:bg-white focus:outline-brand transition-colors text-black-rich"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Commission Rate (e.g. 0.8 for 80%)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 focus:bg-white focus:outline-brand transition-colors text-black-rich"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 focus:bg-white focus:outline-brand transition-colors text-black-rich h-24 resize-none"
                            placeholder="Brief coach description..."
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-brand text-white hover:bg-brand/90 font-bold rounded-xl transition-all hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
