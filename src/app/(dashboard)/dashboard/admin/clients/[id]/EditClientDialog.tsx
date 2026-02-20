"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateClientProfile } from "@/app/actions/admin";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export default function EditClientDialog({ client }: { client: any }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const result = await updateClientProfile(client.id, data);
            if (result.success) {
                toast.success("Profile updated successfully");
                setOpen(false);
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Client Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Name</label>
                            <input name="name" defaultValue={client.name || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Phone</label>
                            <input name="phoneNumber" defaultValue={client.profile?.phoneNumber || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">WhatsApp</label>
                            <input name="whatsappNumber" defaultValue={client.profile?.whatsappNumber || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Emergency Contact</label>
                            <input name="emergencyContact" defaultValue={client.profile?.emergencyContact || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Weight (kg)</label>
                            <input name="weight" type="number" step="0.1" defaultValue={client.profile?.weight || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Height (cm)</label>
                            <input name="height" type="number" step="0.1" defaultValue={client.profile?.height || ""} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Medical Conditions</label>
                        <textarea name="medicalConditions" defaultValue={client.profile?.medicalConditions || ""} className="flex min-h-[60px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Allergies</label>
                        <textarea name="allergies" defaultValue={client.profile?.allergies || ""} className="flex min-h-[60px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Fitness Goals</label>
                        <textarea name="goals" defaultValue={client.profile?.goals || ""} className="flex min-h-[60px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand text-white hover:bg-brand-600">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
