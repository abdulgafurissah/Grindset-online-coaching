import { CheckCircle2 } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black-rich text-white py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Invest in Your <span className="text-brand">Legacy</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Choose the tier that matches your ambition. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Basic Tier */}
                    <div className="p-8 rounded-2xl border border-white/10 bg-black-light hover:border-white/20 transition-all">
                        <h3 className="text-xl font-bold uppercase mb-2">Foundation</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$49</span>
                            <span className="text-white/60">/month</span>
                        </div>
                        <p className="text-white/60 text-sm mb-8 min-h-[40px]">Perfect for self-starters who need a solid structure.</p>
                        <div className="space-y-4 mb-8">
                            {["Access to Program Library", "Basic Progress Tracking", "Community Access", "Monthly Form Check"].map((feature) => (
                                <div key={feature} className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 border border-white/20 hover:border-brand hover:text-brand font-bold uppercase tracking-widest transition-all">
                            Select Plan
                        </button>
                    </div>

                    {/* Pro Tier - Featured */}
                    <div className="relative p-8 rounded-2xl border-2 border-brand bg-black-rich scale-105 shadow-2xl shadow-brand/10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-black-rich font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2 text-brand">Elite</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-5xl font-bold text-white">$99</span>
                            <span className="text-white/60">/month</span>
                        </div>
                        <p className="text-white/60 text-sm mb-8 min-h-[40px]">For those demanding rapid, data-driven results.</p>
                        <div className="space-y-4 mb-8">
                            {["Custom Hypertrophy Program", "Advanced Analytics Dashboard", "Weekly Coach Check-ins", "Nutrition Macro Planning", "Priority Support"].map((feature) => (
                                <div key={feature} className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 bg-brand text-black-rich hover:bg-brand-600 font-bold uppercase tracking-widest transition-all">
                            Start Trial
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="p-8 rounded-2xl border border-white/10 bg-black-light hover:border-white/20 transition-all">
                        <h3 className="text-xl font-bold uppercase mb-2">1-on-1</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$249</span>
                            <span className="text-white/60">/month</span>
                        </div>
                        <p className="text-white/60 text-sm mb-8 min-h-[40px]">Complete lifestyle management and coaching.</p>
                        <div className="space-y-4 mb-8">
                            {["Everything in Elite", "Daily WhatsApp Access", "Custom Meal Plans", "Form Analysis Video Calls", "Contest Prep Management"].map((feature) => (
                                <div key={feature} className="flex items-start gap-3 text-sm">
                                    <CheckCircle2 className="h-5 w-5 text-brand shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 border border-white/20 hover:border-brand hover:text-brand font-bold uppercase tracking-widest transition-all">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
