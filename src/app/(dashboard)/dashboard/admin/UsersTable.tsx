"use client";

import { useState } from "react";
import { MoreVertical, UserCog, Ban, CheckCircle, Loader2 } from "lucide-react";
import { toggleUserStatus, assignCoachToClient } from "@/app/actions/admin";
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

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    isActive: boolean;
    coach: { id: string; name: string | null } | null;
    _count: { clients: number };
}

interface Coach {
    id: string;
    name: string | null;
}

export default function UsersTable({ users, coaches }: { users: User[], coaches: Coach[] }) {
    const [userList, setUserList] = useState(users);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleToggleStatus = async (userId: string) => {
        setLoadingId(userId);
        try {
            const result = await toggleUserStatus(userId);
            if (result.success) {
                setUserList(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
                toast.success("User status updated");
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Error updating status");
        } finally {
            setLoadingId(null);
        }
    };

    const handleAssignCoach = async (userId: string, coachId: string) => {
        try {
            const result = await assignCoachToClient(userId, coachId);
            if (result.success) {
                const assignedCoach = coaches.find(c => c.id === coachId);
                setUserList(prev => prev.map(u => u.id === userId ? { ...u, coach: assignedCoach || null, coachId: assignedCoach?.id } : u));
                toast.success(`Assigned coach: ${assignedCoach?.name}`);
            } else {
                // @ts-ignore
                toast.error(result.error || "Failed to assign coach");
            }
        } catch {
            toast.error("Error assigning coach");
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Coach / Clients</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {userList.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-black-rich mb-0.5">{user.name || "Unnamed"}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${user.role === "ADMIN" ? "bg-red-100 text-red-700 border-red-200" :
                                    user.role === "COACH" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                        "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.isActive ? (
                                    <span className="flex items-center text-green-600 text-xs font-bold gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Active
                                    </span>
                                ) : (
                                    <span className="flex items-center text-red-600 text-xs font-bold gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                        Suspended
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                                {user.role === "CLIENT" ? (
                                    user.coach ? (
                                        <span className="text-brand font-bold">{user.coach.name}</span>
                                    ) : (
                                        <span className="text-slate-400 italic">No Coach</span>
                                    )
                                ) : (
                                    <span>{user._count.clients} Clients</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-black-rich hover:bg-slate-100">
                                            {loadingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700 shadow-lg p-1">
                                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)} className="focus:bg-slate-100 focus:text-black-rich cursor-pointer rounded-sm">
                                            {user.isActive ? <><Ban className="mr-2 h-4 w-4 text-red-500" /> Suspend User</> : <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Activate User</>}
                                        </DropdownMenuItem>
                                        {user.role === "CLIENT" && (
                                            <>
                                                <DropdownMenuSeparator className="bg-slate-100" />
                                                <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-wider px-2 py-1.5">Assign Coach</DropdownMenuLabel>
                                                {coaches.map(coach => (
                                                    <DropdownMenuItem
                                                        key={coach.id}
                                                        onClick={() => handleAssignCoach(user.id, coach.id)}
                                                        className="focus:bg-slate-100 focus:text-black-rich cursor-pointer pl-6 rounded-sm"
                                                    >
                                                        {coach.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
