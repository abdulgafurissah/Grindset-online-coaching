"use client";

import { useState } from "react";
import { Program } from "@prisma/client";
import { assignProgramToClient, unassignProgramFromClient } from "@/app/actions/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AssignProgramFormProps {
    client: {
        id: string;
        assignedPrograms: Program[];
    };
    programs: Program[];
}

export default function AssignProgramForm({ client, programs }: AssignProgramFormProps) {
    const [assignedPrograms, setAssignedPrograms] = useState<string[]>(
        client.assignedPrograms.map((p) => p.id)
    );

    const handleProgramToggle = async (programId: string, isAssigned: boolean) => {
        try {
            if (isAssigned) {
                await unassignProgramFromClient(client.id, programId);
                setAssignedPrograms(assignedPrograms.filter((id) => id !== programId));
                toast.success("Program unassigned");
            } else {
                await assignProgramToClient(client.id, programId);
                setAssignedPrograms([...assignedPrograms, programId]);
                toast.success("Program assigned");
            }
        } catch {
            toast.error("Failed to update program assignment");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-black-rich">Assigned Programs</h2>
            </div>
            <div className="p-6 space-y-4">
                {programs.map((program) => {
                    const isAssigned = assignedPrograms.includes(program.id);
                    return (
                        <div key={program.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-black-rich">{program.title}</p>
                                <p className="text-sm text-slate-500">{program.description}</p>
                            </div>
                            <Checkbox
                                checked={isAssigned}
                                onCheckedChange={() => handleProgramToggle(program.id, isAssigned)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
