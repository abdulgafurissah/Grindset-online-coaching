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
                toast.error("Failed to assign coach");
            }
        } catch {
            toast.error("Error assigning coach");
        }
    };

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black-light">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60 font-medium uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Coach / Clients</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {userList.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-white mb-0.5">{user.name || "Unnamed"}</div>
                                <div className="text-xs text-white/40">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${user.role === "ADMIN" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                        user.role === "COACH" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-white/5 text-white/40 border-white/10"
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.isActive ? (
                                    <span className="flex items-center text-green-400 text-xs font-bold gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        Active
                                    </span>
                                ) : (
                                    <span className="flex items-center text-red-400 text-xs font-bold gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                        Suspended
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-white/60">
                                {user.role === "CLIENT" ? (
                                    user.coach ? (
                                        <span className="text-brand">{user.coach.name}</span>
                                    ) : (
                                        <span className="text-white/20 italic">No Coach</span>
                                    )
                                ) : (
                                    <span>{user._count.clients} Clients</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/40 hover:text-white">
                                            {loadingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black-rich border-white/10 text-white">
                                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)} className="focus:bg-white/10 cursor-pointer">
                                            {user.isActive ? <><Ban className="mr-2 h-4 w-4" /> Suspend User</> : <><CheckCircle className="mr-2 h-4 w-4" /> Activate User</>}
                                        </DropdownMenuItem>
                                        {user.role === "CLIENT" && (
                                            <>
                                                <DropdownMenuSeparator className="bg-white/10" />
                                                <DropdownMenuLabel className="text-xs text-white/40 uppercase tracking-wider">Assign Coach</DropdownMenuLabel>
                                                {coaches.map(coach => (
                                                    <DropdownMenuItem
                                                        key={coach.id}
                                                        onClick={() => handleAssignCoach(user.id, coach.id)}
                                                        className="focus:bg-white/10 cursor-pointer pl-6"
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
