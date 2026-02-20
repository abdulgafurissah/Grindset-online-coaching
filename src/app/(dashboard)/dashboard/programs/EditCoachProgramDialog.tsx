"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateCoachProgram } from "@/app/actions/coach";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Program } from "@prisma/client";

export default function EditCoachProgramDialog({ program }: { program: Program }) {
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
            const result = await updateCoachProgram(program.id, data);
            if (result.success) {
                toast.success("Program updated successfully");
                setOpen(false);
            } else {
                toast.error(result.error || "Failed to update program");
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-black-rich hover:bg-slate-100">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Program</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Title</label>
                        <input name="title" required defaultValue={program.title} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={program.description || ""} className="flex min-h-[80px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Link URL</label>
                        <input name="link" type="url" required defaultValue={program.link} className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
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
