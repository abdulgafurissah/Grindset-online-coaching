"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updatePayment, deletePayment } from "@/app/actions/finance";
import { toast } from "sonner";
import { Edit2, Search, Trash2 } from "lucide-react";

interface Payment {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    isPaidOut: boolean;
    coachShare: number;
    user: { name: string | null; email: string | null };
    coach: { name: string | null } | null;
}

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [list, setList] = useState(payments);

    const filtered = list.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment record?")) return;

        try {
            const result = await deletePayment(id);
            if (result.success) {
                toast.success("Payment deleted");
                setList(prev => prev.filter(p => p.id !== id));
            } else {
                toast.error(result.error || "Failed to delete");
            }
        } catch {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by client name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Coach</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Payout</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(payment => (
                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500">
                                    {format(new Date(payment.createdAt), "MMM d, yyyy")}
                                </td>
                                <td className="px-6 py-4 font-medium text-black-rich">
                                    {payment.user?.name || payment.user?.email || "Unknown"}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {payment.coach?.name || "Unassigned"}
                                </td>
                                <td className="px-6 py-4 font-bold text-black-rich">
                                    ${payment.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${payment.status === "COMPLETED" ? "bg-green-100 text-green-700 border-green-200" :
                                        payment.status === "REFUNDED" ? "bg-red-100 text-red-700 border-red-200" :
                                            "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        }`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {payment.coach ? (
                                        payment.isPaidOut ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Paid Out</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Pending</span>
                                        )
                                    ) : (
                                        <span className="text-slate-400 text-xs italic">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                    {payment.coach && !payment.isPaidOut && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8 border-green-200 text-green-700 hover:bg-green-50"
                                            onClick={async () => {
                                                if (confirm(`Mark $${payment.coachShare.toFixed(2)} as paid to ${payment.coach?.name}?`)) {
                                                    const { markPaymentPaidOut } = await import("@/app/actions/finance");
                                                    await markPaymentPaidOut(payment.id);
                                                    window.location.reload();
                                                }
                                            }}
                                        >
                                            Release Payout
                                        </Button>
                                    )}
                                    <EditPaymentDialog payment={payment} />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(payment.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No payments found.</div>
                )}
            </div>
        </div>
    );
}

function EditPaymentDialog({ payment }: { payment: Payment }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(payment.status);
    const [amount, setAmount] = useState(payment.amount.toString());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updatePayment(payment.id, {
            status,
            amount: parseFloat(amount)
        });

        if (result.success) {
            toast.success("Payment updated");
            setOpen(false);
        } else {
            toast.error(result.error || "Update failed");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-brand hover:bg-brand/10">
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Payment Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-brand"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-brand"
                        >
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REFUNDED">REFUNDED</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-brand text-white hover:bg-brand/90">
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
