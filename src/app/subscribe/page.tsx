import { getPaymentPlans } from "@/app/actions/finance";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, Percent } from "lucide-react";

export default async function SubscribePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Only fetch ACTIVE payment plans
    const plans = await getPaymentPlans(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-black-rich tracking-tight">
                        Choose Your <span className="text-brand">Grindset</span> Plan
                    </h1>
                    <p className="text-lg text-slate-500">
                        To access your personalized dashboard and connect with your coach, you need an active subscription.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan: any) => {
                        const isPromo = plan.promoPercentage > 0;
                        const finalPrice = isPromo
                            ? plan.price * (1 - plan.promoPercentage / 100)
                            : plan.price;

                        const features = Array.isArray(plan.features)
                            ? plan.features as string[]
                            : typeof plan.features === 'string'
                                ? JSON.parse(plan.features) as string[]
                                : [];

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-3xl p-8 border ${isPromo ? 'border-brand shadow-xl shadow-brand/10' : 'border-slate-200 shadow-sm'} flex flex-col`}
                            >
                                {isPromo && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full flex items-center gap-1">
                                        <Percent className="w-3 h-3" />
                                        Save {plan.promoPercentage}%
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-black-rich mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-4xl font-black text-black-rich">${finalPrice.toFixed(2)}</span>
                                        <span className="text-slate-500 font-medium capitalize">/{plan.interval}</span>
                                    </div>
                                    {isPromo && (
                                        <div className="text-sm text-slate-400 line-through">
                                            Normally ${plan.price.toFixed(2)}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 mb-8">
                                    {features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center mt-0.5">
                                                <Check className="w-3 h-3 text-brand" />
                                            </div>
                                            <span className="text-slate-600 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-12 text-base font-bold bg-black-rich hover:bg-black text-white hover:scale-[1.02] transition-transform">
                                    {finalPrice === 0 ? "Start Free Now" : "Subscribe Now"}
                                </Button>
                                {/* In a real app, this button would trigger Stripe checkout or PayPal */}
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    Secure checkout powered by Stripe.
                                </p>
                            </div>
                        );
                    })}
                </div>

                {plans.length === 0 && (
                    <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-black-rich mb-2">No Plans Available</h3>
                        <p className="text-slate-500">
                            The administrator has not configured any payment plans yet. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
