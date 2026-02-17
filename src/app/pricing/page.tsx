import { Navbar } from "@/components/Navbar";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Hustler",
        price: "49",
        features: ["Weekly Workout Plan", "Basic Diet Guide", "Community Access"],
        popular: false
    },
    {
        name: "Grindset",
        price: "99",
        features: ["Custom Workout Plan", "Macro Coaching", "24/7 Chat Support", "Weekly Check-ins"],
        popular: true
    },
    {
        name: "Elite",
        price: "299",
        features: ["1-on-1 Video Calls", "Daily Adjustments", "Supplement Stack Guide", "Private Mastermind"],
        popular: false
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black-rich text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 text-center">
                    Invest in <span className="text-brand">Yourself</span>
                </h1>
                <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
                    Choose the level of accountability and guidance you need to crush your goals.
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative p-8 rounded-2xl border ${plan.popular ? "bg-black-light border-brand shadow-2xl shadow-brand/10" : "bg-black-rich border-white/10"}`}>
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-black-rich font-bold px-4 py-1 text-xs uppercase tracking-widest rounded-full">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-4xl font-black text-white">${plan.price}</span>
                                <span className="text-white/40">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-white/80">
                                        <div className="h-5 w-5 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-brand" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <a href="/register" className={`block w-full py-4 text-center font-bold uppercase tracking-widest text-sm rounded-sm transition-all ${plan.popular ? "bg-brand text-black-rich hover:bg-white" : "bg-white/10 text-white hover:bg-white hover:text-black-rich"}`}>
                                Choose {plan.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
