"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Application {
    id: string;
    name: string;
    email: string;
    type: string;
    status: string;
    details: any;
    createdAt: Date;
}

export default function ApplicationsTable({ applications }: { applications: Application[] }) {
    const [apps, setApps] = useState(applications);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
        setLoadingId(id);
        try {
            const result = await updateApplicationStatus(id, action);
            if (result.success) {
                toast.success(`Application ${action.toLowerCase()}`);
                // Optimistic update
                setApps(apps.filter(app => app.id !== id));
            } else {
                toast.error("Action failed");
            }
        } catch {
            toast.error("Error updating application");
        } finally {
            setLoadingId(null);
        }
    };

    if (apps.length === 0) {
        return (
            <div className="text-center py-12 text-white/30 border border-white/5 rounded-xl bg-black-light">
                No pending applications.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-black-light">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/60 font-medium uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {apps.map((app) => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-white mb-0.5">{app.name}</div>
                                <div className="text-xs text-white/40">{app.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${app.type === "COACH"
                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    }`}>
                                    {app.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-white/40">
                                {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 ring-1 ring-red-500/20"
                                    onClick={() => handleAction(app.id, "REJECTED")}
                                    disabled={loadingId === app.id}
                                >
                                    {loadingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-green-500/20 text-green-400 hover:bg-green-500/30 ring-1 ring-green-500/20"
                                    onClick={() => handleAction(app.id, "APPROVED")}
                                    disabled={loadingId === app.id}
                                >
                                    {loadingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
