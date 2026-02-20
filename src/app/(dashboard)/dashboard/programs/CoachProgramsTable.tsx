"use client";

import { Program } from "@prisma/client";
import CreateCoachProgramForm from "./CreateCoachProgramForm";
import EditCoachProgramDialog from "./EditCoachProgramDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteCoachProgram } from "@/app/actions/coach";

interface CoachProgramsTableProps {
    programs: Program[];
}

export default function CoachProgramsTable({ programs }: CoachProgramsTableProps) {
    const handleDelete = async (programId: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return;

        try {
            const result = await deleteCoachProgram(programId);
            if (result.success) {
                toast.success("Program deleted successfully");
            } else {
                toast.error(result.error || "Failed to delete program");
            }
        } catch {
            toast.error("Error deleting program");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-black-rich">Active Programs</h2>
                    <p className="text-slate-500">Your custom training and nutrition plans.</p>
                </div>
                <CreateCoachProgramForm />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Link</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {programs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 select-none">
                                    You haven't created any programs yet.
                                </td>
                            </tr>
                        ) : programs.map((program) => (
                            <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-black-rich font-medium">{program.title}</td>
                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{program.description || "-"}</td>
                                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">
                                    <a href={program.link} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                                        {program.link}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end pr-2 gap-2">
                                        <EditCoachProgramDialog program={program} />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(program.id)}
                                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
