"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createCoachProgram } from "@/app/actions/coach";

export default function CreateCoachProgramForm() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            link: formData.get("link") as string,
        };

        try {
            const result = await createCoachProgram(data);
            if (result.success) {
                toast.success("Program created successfully");
                setOpen(false);
                // Reset form
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(result.error || "Failed to create program");
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
                <Button className="bg-brand text-white hover:bg-brand-600 shadow-sm gap-2">
                    <Plus className="h-4 w-4" /> Add Program
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Program</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Title</label>
                        <input name="title" required placeholder="e.g., 12-Week Hypertrophy" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" placeholder="Brief details about the program..." className="flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Link URL</label>
                        <input name="link" type="url" required placeholder="https://..." className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand text-white hover:bg-brand-600">
                            {isLoading ? "Creating..." : "Create Program"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
