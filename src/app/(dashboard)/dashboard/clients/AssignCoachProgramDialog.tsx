"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assignProgramToClient } from "@/app/actions/coach";
import { toast } from "sonner";
import { Dumbbell } from "lucide-react";
import { Program } from "@prisma/client";

export default function AssignCoachProgramDialog({ client, programs }: { client: any, programs: Program[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string>(client.program?.id || "NONE");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const programId = selectedProgram === "NONE" ? null : selectedProgram;

        try {
            const result = await assignProgramToClient(client.id, programId);
            if (result.success) {
                toast.success("Program assigned successfully");
                setOpen(false);
            } else {
                toast.error(result.error || "Failed to assign program");
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
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                    <Dumbbell className="h-4 w-4" />
                    {client.program ? "Change Program" : "Assign Program"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Program to {client.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Select Specialized Program</label>
                        <select
                            value={selectedProgram}
                            onChange={(e) => setSelectedProgram(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"
                        >
                            <option value="NONE">-- No Program Assigned --</option>
                            {programs.map(program => (
                                <option key={program.id} value={program.id}>
                                    {program.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand text-white hover:bg-brand-600">
                            {isLoading ? "Saving..." : "Save Assignment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
