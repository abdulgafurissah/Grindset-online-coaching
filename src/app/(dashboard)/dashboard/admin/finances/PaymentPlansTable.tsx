"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import PaymentPlanDialog from "./PaymentPlanDialog";
import { deletePaymentPlan } from "@/app/actions/finance";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Percent } from "lucide-react";

interface PaymentPlan {
    id: string;
    name: string;
    price: number;
    interval: string;
    category: string;
    paypalPlanId?: string | null;
    paymentLink?: string | null;
    features: any;
    isActive: boolean;
    promoPercentage: number;
}

export default function PaymentPlansTable({ plans }: { plans: PaymentPlan[] }) {
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment plan? Active subscriptions might be affected.")) return;

        const result = await deletePaymentPlan(id);
        if (result.success) {
            toast.success("Payment plan deleted");
        } else {
            toast.error(result.error || "Failed to delete");
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-black-rich">Subscription Plans</h3>
                <PaymentPlanDialog />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Interval</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Payment Link</th>
                            <th className="px-6 py-4">Promo</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {plans.map((plan) => {
                            const discountedPrice = plan.promoPercentage > 0
                                ? plan.price * (1 - plan.promoPercentage / 100)
                                : plan.price;

                            return (
                                <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-black-rich">{plan.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            {plan.promoPercentage > 0 ? (
                                                <>
                                                    <span className="text-slate-400 line-through text-xs">{formatCurrency(plan.price)}</span>
                                                    <span className="font-bold text-green-600">{formatCurrency(discountedPrice)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-black-rich">{formatCurrency(plan.price)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 capitalize">{plan.interval}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                            {plan.category || "General"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {plan.paymentLink ? (
                                            <a href={plan.paymentLink} target="_blank" rel="noopener noreferrer" className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors">
                                                Link
                                            </a>
                                        ) : plan.paypalPlanId ? (
                                            <span className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
                                                {plan.paypalPlanId}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Unlinked</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {plan.promoPercentage > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-brand/10 text-brand border border-brand/20">
                                                <Percent className="w-3 h-3" />
                                                {plan.promoPercentage}% OFF
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">None</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {plan.isActive ? (
                                            <div className="flex items-center justify-center text-green-600">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center text-slate-300">
                                                <XCircle className="w-5 h-5" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <PaymentPlanDialog plan={plan} />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(plan.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                        {plans.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                                    No payment plans configured. Create one to allow clients to subscribe.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
