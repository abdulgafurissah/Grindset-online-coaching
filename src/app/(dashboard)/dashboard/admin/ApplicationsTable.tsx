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
                // @ts-ignore
                toast.error(result.error || "Action failed");
            }
        } catch {
            toast.error("Error updating application");
        } finally {
            setLoadingId(null);
        }
    };

    if (apps.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400 border border-slate-200 rounded-xl bg-slate-50 border-dashed">
                No pending applications.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Submitted</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {apps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-black-rich mb-0.5">{app.name}</div>
                                <div className="text-xs text-slate-500">{app.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${app.type === "COACH"
                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                    : "bg-blue-100 text-blue-700 border-blue-200"
                                    }`}>
                                    {app.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">
                                {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ring-1 ring-slate-200 hover:ring-red-200"
                                    onClick={() => handleAction(app.id, "REJECTED")}
                                    disabled={loadingId === app.id}
                                >
                                    {loadingId === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 ring-1 ring-green-200 shadow-sm"
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
