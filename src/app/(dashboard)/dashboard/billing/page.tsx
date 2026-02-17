import { auth } from "@/auth";
import { getSubscriptionStatus, createCheckoutSession, createCustomerPortal } from "@/app/actions/stripe";
import { Check, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BillingPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await auth();
    const subscription = await getSubscriptionStatus();

    // Check for success/canceled query params
    const isSuccess = searchParams.success === "true";
    const isCanceled = searchParams.canceled === "true";

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Billing & Subscription</h1>
            <p className="text-white/60 mb-8">Manage your plan and payment details.</p>

            {isSuccess && (
                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-3">
                    <Check className="h-5 w-5" />
                    <div>
                        <p className="font-bold">Subscription Successful!</p>
                        <p className="text-sm opacity-80">Thank you for joining Grindset Online Coaching.</p>
                    </div>
                </div>
            )}

            {isCanceled && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <p className="font-bold">Payment Canceled</p>
                    <p className="text-sm opacity-80">You have not been charged.</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Status Card */}
                <div className="bg-black-light border border-white/10 rounded-xl p-8 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-brand" />
                            Current Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Plan</span>
                                <span className="font-bold text-white">
                                    {subscription ? "Premium Coaching" : "Free / Inactive"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-white/60">Status</span>
                                <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase ${subscription?.isValid
                                        ? "bg-green-500/10 text-green-500"
                                        : "bg-white/10 text-white/40"
                                    }`}>
                                    {subscription?.status || "Inactive"}
                                </span>
                            </div>
                            {subscription?.currentPeriodEnd && (
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-white/60">Renews On</span>
                                    <span className="text-white">
                                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        {subscription?.isValid ? (
                            <form action={createCustomerPortal}>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                    Manage Subscription
                                </Button>
                            </form>
                        ) : (
                            <p className="text-sm text-white/40 text-center">
                                Subscribe to access premium features.
                            </p>
                        )}
                    </div>
                </div>

                {/* Pricing Card (Show mostly if inactive) */}
                {!subscription?.isValid && (
                    <div className="bg-gradient-to-br from-brand/10 to-black-light border border-brand/20 rounded-xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-brand text-black-rich text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
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

                        <form action={createCheckoutSession.bind(null, "price_1QmokPAnXAhCi9OTr6F8vX5v")}>
                            {/* Replace price_YOUR_PRICE_ID with env var or constant in real app. 
                                For this MVP, I'll assume we pass it or it's hardcoded for the demo. 
                                NOTE: User must replace this ID.
                            */}
                            <input type="hidden" name="priceId" value={process.env.STRIPE_PRICE_ID || "price_mock"} />
                            <Button className="w-full bg-brand text-black-rich hover:bg-brand-600 font-bold py-6">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Subscribe Now
                            </Button>
                        </form>
                        <p className="text-xs text-white/30 text-center mt-3">
                            Secure payment via Stripe. Cancel anytime.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
