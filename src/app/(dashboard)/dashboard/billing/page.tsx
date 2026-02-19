
import { auth } from "@/auth";
import { getSubscriptionStatus } from "@/app/actions/payment";
import { Check, Shield } from "lucide-react";
import { PayPalSubscription } from "@/components/PayPalSubscription";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function BillingPage() {
    const session = await auth();
    const subscription = await getSubscriptionStatus();

    // PayPal Plan ID - In real production app, this should be in env or database
    // For sandbox testing, use a plan ID created in your developer dashboard.
    // e.g., P-SANDBOX-123456789
    const PLAN_ID = process.env.PAYPAL_PLAN_ID || "P-SANDBOX-DEFAULT";

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
                                <a
                                    href="https://www.paypal.com/myaccount/autopay/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: "outline", className: "w-full" })}
                                >
                                    Manage on PayPal
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center">
                                Subscribe to access premium features.
                            </p>
                        )}
                    </div>
                </div>

                {/* Pricing Card (Show mostly if inactive) */}
                {!subscription.isValid && (
                    <div className="bg-black-rich text-white border border-slate-800 rounded-xl p-8 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 bg-brand text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Recommended
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Premium Coaching</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-white">$99</span>
                                <span className="text-white/60 ml-2">/month</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {[
                                    "Custom Workout Programming",
                                    "Weekly Check-ins & Adjustments",
                                    "Direct Messaging with Coach",
                                    "Video Form Analysis",
                                    "Nutrition Guidance"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                                        <Check className="h-4 w-4 text-brand flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-6">
                            <PayPalSubscription planId={PLAN_ID} />
                            <p className="text-xs text-white/30 text-center mt-3">
                                Secure payment via PayPal. Cancel anytime.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
