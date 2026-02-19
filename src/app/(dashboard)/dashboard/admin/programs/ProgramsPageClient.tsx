
"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProgram, updateProgram, deleteProgram } from "@/app/actions/programs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Program {
    id: string;
    title: string;
    description: string | null;
    link: string;
    image: string | null;
}

export default function ProgramsPage({ programs }: { programs: Program[] }) {
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleCreate(formData: FormData) {
        setLoading(true);
        const res = await createProgram(formData);
        setLoading(false);
        if (res.success) {
            toast.success("Program created successfully");
            setIsCreateOpen(false);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to create program");
        }
    }

    async function handleUpdate(formData: FormData) {
        setLoading(true);
        formData.append("id", selectedProgram!.id);
        const res = await updateProgram(formData);
        setLoading(false);
        if (res.success) {
            toast.success("Program updated successfully");
            setIsEditOpen(false);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to update program");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this program?")) return;
        setLoading(true);
        const res = await deleteProgram(id);
        setLoading(false);
        if (res.success) {
            toast.success("Program deleted successfully");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to delete program");
        }
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-black-rich">Programs</h1>
                    <p className="text-slate-500">Manage external workout programs displayed on client dashboards.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-black-rich font-bold hover:bg-brand/90">
                            <Plus className="w-4 h-4 mr-2" /> Add Program
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Program</DialogTitle>
                        </DialogHeader>
                        <form action={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Program Title</Label>
                                <Input id="title" name="title" required placeholder="e.g. 12-Week Hyrox Prep" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Brief description of the program..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">External Link</Label>
                                <Input id="link" name="link" required placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Cover Image URL (Optional)</Label>
                                <Input id="image" name="image" placeholder="https://..." />
                            </div>
                            <Button type="submit" className="w-full bg-brand text-black-rich font-bold" disabled={loading}>
                                {loading ? "Creating..." : "Create Program"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                    <div key={program.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="h-40 bg-slate-100 relative">
                            {program.image ? (
                                <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <span className="text-4xl font-bold opacity-20">PROGRAM</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => { setSelectedProgram(program); setIsEditOpen(true); }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(program.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-black-rich mb-2">{program.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{program.description}</p>
                            <a href={program.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand font-bold text-sm hover:underline">
                                Open Program <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Program</DialogTitle>
                    </DialogHeader>
                    {selectedProgram && (
                        <form action={handleUpdate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-title">Program Title</Label>
                                <Input id="edit-title" name="title" defaultValue={selectedProgram.title} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea id="edit-description" name="description" defaultValue={selectedProgram.description || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-link">External Link</Label>
                                <Input id="edit-link" name="link" defaultValue={selectedProgram.link} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-image">Cover Image URL (Optional)</Label>
                                <Input id="edit-image" name="image" defaultValue={selectedProgram.image || ""} />
                            </div>
                            <Button type="submit" className="w-full bg-brand text-black-rich font-bold" disabled={loading}>
                                {loading ? "Updating..." : "Update Program"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
