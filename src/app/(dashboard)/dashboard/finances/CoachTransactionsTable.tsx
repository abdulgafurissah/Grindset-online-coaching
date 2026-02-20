"use client";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface Transaction {
    id: string;
    amount: number;
    coachShare: number;
    status: string;
    isPaidOut: boolean;
    createdAt: Date;
    user: { name: string | null; email: string | null } | null;
}

export default function CoachTransactionsTable({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Total Amount</th>
                            <th className="px-6 py-4">Your Cut</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Tx Status</th>
                            <th className="px-6 py-4 text-right">Payout Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-black-rich">
                                    {t.user?.name || t.user?.email || "Unknown"}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-semibold">
                                    {formatCurrency(t.amount)}
                                </td>
                                <td className="px-6 py-4 text-green-600 font-bold bg-green-50/50">
                                    {formatCurrency(t.coachShare)}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {format(new Date(t.createdAt), "MMM d, yyyy")}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border bg-green-100 text-green-700 border-green-200">
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {t.isPaidOut ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-green-600 bg-green-50 border border-green-200">
                                            Paid Out
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200">
                                            Pending
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No transactions recorded yet.</div>
                )}
            </div>
        </div>
    );
}
