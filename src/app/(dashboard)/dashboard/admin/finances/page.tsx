import { getGlobalFinancials } from "@/app/actions/finance";
import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DeletePaymentButton, ClearAllButton } from "./FinanceControls";

export default async function AdminFinancePage() {
    const data = await getGlobalFinancials();

    if (!data) return <div className="p-8 text-red-500">Error loading financials</div>;

    const { summary, payments } = data;

    const stats = [
        { label: "Total Revenue", value: formatCurrency(summary.totalRevenue), icon: DollarSign, color: "text-green-600 bg-green-100" },
        { label: "Platform Profit", value: formatCurrency(summary.platformProfit), icon: TrendingUp, color: "text-brand bg-brand/10" },
        { label: "Coach Payouts", value: formatCurrency(summary.coachPayouts), icon: Users, color: "text-blue-600 bg-blue-100" },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500">Track revenue, profits, and coach payouts.</p>
                </div>
                <div className="flex gap-4 items-center text-right">
                    <div>
                        <p className="text-sm text-slate-400 font-medium">Current Period</p>
                        <p className="text-xl font-bold text-black-rich">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="pl-4 border-l border-slate-200">
                        <ClearAllButton />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-black-rich">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-black-rich">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Coach</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Platform / Coach Split</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-black-rich">{payment.user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{payment.coach?.name || "N/A"}</td>
                                    <td className="px-6 py-4 font-bold text-black-rich">{formatCurrency(payment.amount)}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <span className="text-green-600 font-semibold">{formatCurrency(payment.platformShare)}</span>
                                        <span className="mx-2 text-slate-300">|</span>
                                        <span className="text-blue-600 font-semibold">{formatCurrency(payment.coachShare)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DeletePaymentButton id={payment.id} />
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
