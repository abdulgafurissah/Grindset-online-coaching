import { getCoachFinancialStats } from "@/app/actions/finance";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, CreditCard, TrendingUp, Users } from "lucide-react";
import CoachTransactionsTable from "./CoachTransactionsTable";

export default async function CoachFinancesPage() {
    const stats = await getCoachFinancialStats();

    if (!stats) return <div className="p-8 text-red-500">Access Denied</div>;

    const summaryCards = [
        { title: "Total Lifetime", value: formatCurrency(stats.totalEarnings), icon: DollarSign, color: "text-green-600 bg-green-100" },
        { title: "This Month", value: formatCurrency(stats.monthlyEarnings), icon: TrendingUp, color: "text-blue-600 bg-blue-100" },
        { title: "Pending Payout", value: formatCurrency(stats.pendingPayouts), icon: CreditCard, color: "text-orange-600 bg-orange-100" },
        { title: "Active Clients", value: stats.earningsPerClient.length, icon: Users, color: "text-brand bg-brand/10" },
    ];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black-rich uppercase tracking-tight mb-2">My Earnings</h1>
                <p className="text-slate-500">Track your income from client programs and subscriptions.</p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{card.title}</h3>
                            <div className={`p-2 rounded-lg ${card.color}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-black-rich">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Transactions table */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-black-rich">Recent Transactions</h2>
                    <CoachTransactionsTable transactions={stats.payments} />
                </div>

                {/* Sidebar Content: Earnings per client */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-black-rich">Earnings By Client</h2>
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
                        {stats.earningsPerClient.length > 0 ? (
                            <div className="space-y-4">
                                {stats.earningsPerClient.map((clientData, idx) => (
                                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="font-medium text-black-rich">{clientData.name}</div>
                                        <div className="font-bold text-green-600">
                                            {formatCurrency(clientData.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-500">No client earnings yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
