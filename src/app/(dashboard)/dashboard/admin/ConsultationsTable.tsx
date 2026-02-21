"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateConsultationStatus } from "@/app/actions/admin";
import { CheckCircle, XCircle, Calendar, MessageSquare } from "lucide-react";

type Consultation = {
    id: string;
    status: string;
    requestedAt: Date;
    message: string | null;
    client: { name: string | null; email: string; image: string | null; };
    coach: { name: string | null; email: string; };
};

export default function ConsultationsTable({ consultations }: { consultations: Consultation[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function handleStatusChange(id: string, status: "APPROVED" | "REJECTED" | "COMPLETED") {
        setLoadingId(id);
        const res = await updateConsultationStatus(id, status);
        if (res.error) toast.error(res.error);
        else toast.success(`Consultation marked as ${status.toLowerCase()}`);
        setLoadingId(null);
    }

    if (consultations.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-black-rich mb-2">No Consultations</h3>
                <p className="text-slate-500 max-w-sm mx-auto">There are no consultation requests booked at this time.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Requested Date</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {consultations.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden">
                                            {c.client.image ? (
                                                <img src={c.client.image} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                c.client.name?.[0] || c.client.email[0].toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-black-rich">{c.client.name || "Client"}</div>
                                            <div className="text-slate-400 text-xs">{c.client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-black-rich font-medium">
                                        {format(new Date(c.requestedAt), "MMM d, yyyy")}
                                    </div>
                                    <div className="text-slate-400 text-xs mt-0.5">
                                        {format(new Date(c.requestedAt), "h:mm a")}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-[200px] truncate text-slate-500" title={c.message || "No message provided"}>
                                        {c.message ? (
                                            <span className="flex items-center gap-1.5">
                                                <MessageSquare className="h-3.5 w-3.5" />
                                                {c.message}
                                            </span>
                                        ) : "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${c.status === "PENDING" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                        c.status === "APPROVED" ? "bg-green-100 text-green-700 border-green-200" :
                                            c.status === "COMPLETED" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                "bg-red-100 text-red-700 border-red-200"
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {c.status === "PENDING" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                onClick={() => handleStatusChange(c.id, "APPROVED")}
                                                disabled={loadingId === c.id}
                                            >
                                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                                onClick={() => handleStatusChange(c.id, "REJECTED")}
                                                disabled={loadingId === c.id}
                                            >
                                                <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                                            </Button>
                                        </>
                                    )}
                                    {c.status === "APPROVED" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                            onClick={() => handleStatusChange(c.id, "COMPLETED")}
                                            disabled={loadingId === c.id}
                                        >
                                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Mark Completed
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
