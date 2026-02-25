
import { auth } from "@/auth";
import { getSubscriptionStatus } from "@/app/actions/payment";
import { getPaymentPlans } from "@/app/actions/finance";
import { Check, Shield, Sparkles } from "lucide-react";
import { SubscribeButton } from "@/components/SubscribeButton";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function BillingPage() {
    const session = await auth();
    const subscription = await getSubscriptionStatus();
    const plans = await getPaymentPlans();

    // Group active plans by category
    const groupedPlans = plans.filter((p: any) => p.isActive).reduce((acc: any, plan: any) => {
        const category = plan.category || "General";
        if (!acc[category]) acc[category] = [];
        acc[category].push(plan);
        return acc;
    }, {} as Record<string, typeof plans>);

    return (
        <div className="p-8 max-w-5xl mx-auto text-black-rich">
            <h1 className="text-3xl font-bold text-black-rich mb-2 uppercase tracking-tight">Billing & Subscription</h1>
            <p className="text-slate-500 mb-8">Manage your plan and payment details.</p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Status Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-between shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-black-rich mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-brand" />
                            Current Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Plan</span>
                                <span className="font-bold text-black-rich">
                                    {subscription.isValid ? "Premium Coaching" : "Free / Inactive"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-slate-500">Status</span>
                                <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase ${subscription.isValid
                                    ? "bg-green-100 text-green-600"
                                    : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {subscription.isValid ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {subscription.isValid ? (
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-4">
                                    Your subscription is active and managed via PayPal.
                                </p>
                                <Link
                                    href="https://www.paypal.com/myaccount/autopay/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    prefetch={false}
                                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                                >
                                    Manage on PayPal
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center">
                                Subscribe to access premium features.
                            </p>
                        )}
                    </div>
                </div>

                {/* Subscribed Plan Display Placeholder */}
                {subscription.isValid && (
                    <div className="bg-black-rich text-white border border-slate-800 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-xl">
                        <Check className="w-16 h-16 text-brand mb-4" />
                        <h3 className="text-2xl font-bold mb-2">You are All Set!</h3>
                        <p className="text-white/60">Your active plan details will appear here soon.</p>
                    </div>
                )}
            </div>

            {/* Pricing Options (Show only if inactive) */}
            {!subscription.isValid && (
                <div className="mt-16 space-y-16">
                    {Object.keys(groupedPlans).length === 0 ? (
                        <div className="text-center text-slate-500 py-12">
                            <p>No active subscription plans available at the moment.</p>
                        </div>
                    ) : (
                        Object.entries(groupedPlans).map(([category, categoryPlans]) => (
                            <div key={category} className="space-y-8">
                                <h3 className="text-2xl font-black text-black-rich uppercase tracking-tight border-b-2 border-brand inline-block pb-1">
                                    {category}
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(categoryPlans as any[]).map((plan: any) => (
                                        <div
                                            key={plan.id}
                                            className="bg-white border flex flex-col border-slate-200 rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {plan.promoPercentage > 0 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-black-rich text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Save {plan.promoPercentage}%
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-xl font-bold text-black-rich mb-2 uppercase tracking-tight">{plan.name}</h4>
                                                <div className="flex items-baseline mb-6">
                                                    <span className="text-3xl font-black text-black-rich">${plan.price}</span>
                                                    <span className="text-slate-500 ml-1 text-sm">/{plan.interval}</span>
                                                </div>

                                                <ul className="space-y-3 mb-8">
                                                    {plan.features.map((feature: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Check className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
                                                            <span className="leading-snug">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mt-auto">
                                                {plan.paymentLink ? (
                                                    <SubscribeButton planId={plan.id} paymentLink={plan.paymentLink} />
                                                ) : (
                                                    <Button disabled className="w-full bg-slate-100 text-slate-400 hover:bg-slate-100">
                                                        Not Available
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
