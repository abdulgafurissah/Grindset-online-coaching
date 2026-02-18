import { Brain, Sparkles, Target } from "lucide-react";

export function MindsetSection() {
    return (
        <section className="py-24 bg-brand relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="text-white">
                        <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            Psychology First
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                            Train Your Mind, <br />
                            Transform Your <span className="text-black-rich">Body</span>
                        </h2>
                        <p className="text-white/90 text-lg leading-relaxed mb-8 font-medium">
                            Most fitness programs fail because they ignore the most critical muscle: your brain.
                            At Grindset, we integrate psychological conditioning directly into your physical training.
                        </p>

                        <div className="grid gap-6">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <h3 className="flex items-center gap-3 font-bold text-xl mb-2">
                                    <Brain className="w-6 h-6" />
                                    Behavioral Psychology
                                </h3>
                                <p className="text-white/80 text-sm">We use science-backed techniques to rewire your brain for success.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <h3 className="flex items-center gap-3 font-bold text-xl mb-2">
                                    <Target className="w-6 h-6" />
                                    Goal Visualization
                                </h3>
                                <p className="text-white/80 text-sm">Learn to visualize your success with clarity and focus.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Placeholder for Mindset Image/Illustration */}
                        <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-black-rich/20 border border-white/10 relative">
                            {/* Abstract representation of mindset */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent z-10" />
                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                <Sparkles className="w-32 h-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
