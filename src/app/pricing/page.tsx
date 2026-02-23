import { Navbar } from "@/components/Navbar";
import { Check, Sparkles } from "lucide-react";
import { getPaymentPlans } from "@/app/actions/finance";
import Link from "next/link";

export default async function PricingPage() {
    const plans = await getPaymentPlans();

    // Group plans by category
    const groupedPlans = plans.reduce((acc: any, plan: any) => {
        const category = plan.category || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(plan);
        return acc;
    }, {} as Record<string, typeof plans>);

    return (
        <main className="min-h-screen bg-black-rich text-white overflow-hidden">
            <Navbar />

            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 py-24 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                        Invest in <span className="text-brand inline-block hover:scale-105 transition-transform cursor-default">Yourself</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Choose the level of accountability and guidance you need to crush your goals. No gimmicks, just results.
                    </p>
                </div>

                {Object.keys(groupedPlans).length === 0 ? (
                    <div className="text-center text-white/50 bg-black-light/50 p-12 rounded-3xl border border-white/10 max-w-xl mx-auto backdrop-blur-sm">
                        <Sparkles className="w-12 h-12 text-brand mx-auto mb-4 opacity-50" />
                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-2">No Plans Available</h3>
                        <p>We are currently updating our coaching packages. Check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-32">
                        {Object.entries(groupedPlans).map(([category, categoryPlans]) => (
                            <div key={category} className="space-y-12 relative">
                                <h2 className="text-3xl md:text-5xl font-black text-center uppercase tracking-widest text-white/90">
                                    {category}
                                    <div className="h-1.5 w-24 bg-brand mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                                </h2>
                                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                    {(categoryPlans as any[]).map((plan: any, index: number) => {
                                        // Determine if this plan is "popular" (e.g., the middle plan or the highest priced)
                                        const isPopular = index === 1 || plan.promoPercentage > 0;

                                        return (
                                            <div
                                                key={plan.id}
                                                className={`relative group flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${isPopular
                                                    ? "bg-gradient-to-b from-black-light to-black-rich border-brand shadow-2xl shadow-brand/20"
                                                    : "bg-black-rich border-white/10 hover:border-white/30 hover:bg-black-light/80"
                                                    }`}
                                            >
                                                {isPopular && (
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-black-rich font-bold px-6 py-1.5 text-xs uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg shadow-brand/30">
                                                        <Sparkles className="w-3 h-3" />
                                                        Most Popular
                                                    </div>
                                                )}

                                                <div className="mb-8">
                                                    <h3 className="text-2xl font-black uppercase tracking-wider text-white mb-2">{plan.name}</h3>
                                                    <div className="flex flex-col">
                                                        {plan.promoPercentage > 0 && (
                                                            <span className="text-brand/80 font-bold text-sm uppercase tracking-widest block mb-1">
                                                                Save {plan.promoPercentage}%
                                                            </span>
                                                        )}
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-5xl font-black text-white">${plan.price}</span>
                                                            <span className="text-white/40 font-medium">/{plan.interval}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 mb-10">
                                                    <ul className="space-y-5">
                                                        {plan.features.map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-4 text-white/80 font-medium">
                                                                <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${isPopular ? "bg-brand/20" : "bg-white/10"}`}>
                                                                    <Check className={`h-3 w-3 ${isPopular ? "text-brand" : "text-white"}`} />
                                                                </div>
                                                                <span className="leading-snug">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <Link
                                                    href={`/register?plan=${plan.id}`}
                                                    className={`mt-auto block w-full py-4 text-center font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 ${isPopular
                                                        ? "bg-brand text-black-rich hover:bg-brand/90 hover:shadow-lg hover:shadow-brand/20 hover:scale-[1.02]"
                                                        : "bg-white/10 text-white hover:bg-white hover:text-black-rich hover:scale-[1.02]"
                                                        }`}
                                                >
                                                    Choose {plan.name}
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
