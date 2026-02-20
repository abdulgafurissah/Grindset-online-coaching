"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateSubscription } from "@/app/actions/finance";
import { toast } from "sonner";
import { Edit2, Search } from "lucide-react";

interface Subscription {
    id: string;
    userId: string;
    paypalSubscriptionId: string;
    status: string;
    planId: string;
    currentPeriodEnd: Date;
    user: { name: string | null; email: string | null; image: string | null };
}

export default function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = subscriptions.filter(s =>
        s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.paypalSubscriptionId.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by name, email or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Sub ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Ends On</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(sub => (
                            <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-black-rich">
                                    {sub.user?.name || sub.user?.email || "Unknown"}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {sub.paypalSubscriptionId}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${sub.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200" :
                                            sub.status === "CANCELLED" ? "bg-red-100 text-red-700 border-red-200" :
                                                "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <EditSubscriptionDialog subscription={sub} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No subscriptions found.</div>
                )}
            </div>
        </div>
    );
}

function EditSubscriptionDialog({ subscription }: { subscription: Subscription }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(subscription.status);

    // Format date for the datetime-local input
    const initialDate = new Date(subscription.currentPeriodEnd);
    const tzOffset = initialDate.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(initialDate.getTime() - tzOffset)).toISOString().slice(0, -1);
    const [endDate, setEndDate] = useState(localISOTime.substring(0, 16));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateSubscription(subscription.id, {
            status,
            currentPeriodEnd: new Date(endDate)
        });

        if (result.success) {
            toast.success("Subscription updated");
            setOpen(false);
        } else {
            toast.error(result.error || "Update failed");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-brand hover:bg-brand/10 gap-2">
                    <Edit2 className="h-4 w-4" /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Subscription</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-500">PayPal ID (Read-only)</label>
                        <input
                            type="text"
                            value={subscription.paypalSubscriptionId}
                            disabled
                            className="w-full border border-slate-200 rounded-md px-3 py-2 bg-slate-50 text-slate-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="w-full border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-brand"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="EXPIRED">EXPIRED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Period End Date</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-md px-3 py-2 focus:outline-brand"
                            required
                        />
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
