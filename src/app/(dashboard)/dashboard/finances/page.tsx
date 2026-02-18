import { getCoachEarnings } from "@/app/actions/finance";
import { formatCurrency } from "@/lib/utils";
import { auth } from "@/auth";
import { DollarSign, Wallet, Calendar } from "lucide-react";

// Mock auth for now if needed, but better to use real session


export default async function CoachFinancePage() {
    const session = await auth();

    if (!session?.user?.id) return <div>Access Denied</div>;

    const data = await getCoachEarnings(session.user.id);

    if (!data) return <div className="p-8 text-red-500">Error loading earnings</div>;

    const { payments, totalEarnings } = data;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">My Earnings</h1>
                <p className="text-slate-500">Track your income and transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-black-rich text-white p-6 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet className="w-24 h-24" />
                    </div>
                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">Total Lifetime Earnings</h3>
                    <div className="text-4xl font-bold text-brand">{formatCurrency(totalEarnings)}</div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">This Month</h3>
                        <div className="p-2 rounded-lg bg-green-100 text-green-600">
                            <Calendar className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-black-rich">{formatCurrency(totalEarnings)}</div> {/* TODO: Filter by month */}
                    <p className="text-xs text-slate-400 mt-2">Based on completed transactions</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-black-rich">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Your Share</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-black-rich">{payment.user.name}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(payment.coachShare)}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                        No earnings data yet.
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
