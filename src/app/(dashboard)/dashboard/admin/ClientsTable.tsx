"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { MoreVertical, UserCog, Loader2 } from "lucide-react";
import { assignCoachToClient } from "@/app/actions/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Client extends User {
    coach: { id: string; name: string | null } | null;
}

interface Coach {
    id: string;
    name: string | null;
}

interface ClientsTableProps {
    clients: Client[];
    coaches: Coach[];
}

export default function ClientsTable({ clients, coaches }: ClientsTableProps) {
    const [clientList, setClientList] = useState(clients);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAssignCoach = async (userId: string, coachId: string) => {
        setLoadingId(userId);
        try {
            const result = await assignCoachToClient(userId, coachId);
            if (result.success) {
                const assignedCoach = coaches.find(c => c.id === coachId);
                setClientList(prev => prev.map(u => u.id === userId ? { ...u, coach: assignedCoach || null, coachId: assignedCoach?.id || null } : u));
                toast.success(`Assigned coach: ${assignedCoach?.name}`);
            } else {
                // @ts-ignore
                toast.error(result.error || "Failed to assign coach");
            }
        } catch {
            toast.error("Error assigning coach");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-black-rich">Clients</h2>
                <p className="text-slate-500">Manage your clients and their programs.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Coach</th>
                            <th className="px-6 py-3">Program</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clientList.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-black-rich font-medium">{client.name}</td>
                                <td className="px-6 py-4 text-slate-600">{client.email}</td>
                                <td className="px-6 py-4 text-slate-600">{client.coach?.name || "Not Assigned"}</td>
                                <td className="px-6 py-4 text-slate-600">{"No Program"}</td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-black-rich hover:bg-slate-100">
                                                {loadingId === client.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700 shadow-lg p-1">
                                            <DropdownMenuItem asChild>
                                                <a href={`/dashboard/admin/clients/${client.id}`} className="focus:bg-slate-100 focus:text-black-rich cursor-pointer rounded-sm">
                                                    <UserCog className="mr-2 h-4 w-4" /> View Profile
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-100" />
                                            <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-wider px-2 py-1.5">Assign Coach</DropdownMenuLabel>
                                            {coaches.map(coach => (
                                                <DropdownMenuItem
                                                    key={coach.id}
                                                    onClick={() => handleAssignCoach(client.id, coach.id)}
                                                    className="focus:bg-slate-100 focus:text-black-rich cursor-pointer pl-6 rounded-sm"
                                                >
                                                    {coach.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
