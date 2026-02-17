import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TopCoaches } from "@/components/TopCoaches";
import { MindsetSection } from "@/components/MindsetSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-black-rich text-white selection:bg-brand selection:text-black">
            <Navbar />
            <div id="hero"><Hero /></div>
            <div id="features"><Features /></div>
            <div id="mindset"><MindsetSection /></div>
            <div id="coaches"><TopCoaches /></div>

            {/* Placeholder for Results/Testimonials */}
            <section id="results" className="py-24 bg-black-light border-y border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-12">
                        Real <span className="text-brand">Results</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-black-rich p-6 border border-white/10 rounded-xl">
                            <div className="h-64 bg-white/5 mb-4 rounded-lg flex items-center justify-center text-white/20">
                                Client Transformation Photo
                            </div>
                            <h3 className="font-bold text-white">Sarah J.</h3>
                            <p className="text-brand text-sm uppercase">Lost 15kg & Gained Confidence</p>
                        </div>
                        <div className="bg-black-rich p-6 border border-white/10 rounded-xl">
                            <div className="h-64 bg-white/5 mb-4 rounded-lg flex items-center justify-center text-white/20">
                                Client Transformation Photo
                            </div>
                            <h3 className="font-bold text-white">Mike T.</h3>
                            <p className="text-brand text-sm uppercase">Built Discipline & Muscle</p>
                        </div>
                        <div className="bg-black-rich p-6 border border-white/10 rounded-xl">
                            <div className="h-64 bg-white/5 mb-4 rounded-lg flex items-center justify-center text-white/20">
                                Client Transformation Photo
                            </div>
                            <h3 className="font-bold text-white">Emma R.</h3>
                            <p className="text-brand text-sm uppercase">Overcame Anxiety & Got Fit</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section on Home */}
            <section id="pricing" className="py-24 bg-black-rich">
                <div className="container mx-auto px-4 text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight">
                        Join the <span className="text-brand">Movement</span>
                    </h2>
                </div>
                {/* Reusing pricing logic simplified for home or just CTA */}
                <div className="flex justify-center">
                    <a href="/pricing" className="bg-brand hover:bg-brand-600 text-black-rich font-bold py-4 px-12 rounded-none uppercase text-lg tracking-widest transition-all">
                        Start Your Journey
                    </a>
                </div>
            </section>

            <section className="py-24 bg-brand flex items-center justify-center">
                <h2 className="text-4xl md:text-6xl font-black text-black-rich uppercase text-center">
                    Begin Your Transformation
                </h2>
            </section>
        </main>
    );
}
