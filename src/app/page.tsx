import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TopCoaches } from "@/components/TopCoaches";
import { MindsetSection } from "@/components/MindsetSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-white text-black-rich">
            <Navbar />
            <div id="hero"><Hero /></div>
            <div id="features"><Features /></div>
            <div id="mindset"><MindsetSection /></div>
            <div id="coaches"><TopCoaches /></div>

            {/* Testimonials */}
            <section id="results" className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-black-rich uppercase tracking-tight mb-12">
                        Real <span className="text-brand">Results</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="h-64 bg-slate-200 mb-6 rounded-xl flex items-center justify-center text-black-rich/20 font-medium">
                                Transformation Photo
                            </div>
                            <h3 className="font-bold text-xl text-black-rich mb-1">Sarah J.</h3>
                            <p className="text-brand text-sm font-bold uppercase tracking-wide">Lost 15kg & Gained Confidence</p>
                            <p className="mt-4 text-black-rich/60 italic">"The best investment I've ever made. The mindset coaching changed everything."</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="h-64 bg-slate-200 mb-6 rounded-xl flex items-center justify-center text-black-rich/20 font-medium">
                                Transformation Photo
                            </div>
                            <h3 className="font-bold text-xl text-black-rich mb-1">Mike T.</h3>
                            <p className="text-brand text-sm font-bold uppercase tracking-wide">Built Discipline & Muscle</p>
                            <p className="mt-4 text-black-rich/60 italic">"Finally a program that understands real life. The coaches are top tier."</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="h-64 bg-slate-200 mb-6 rounded-xl flex items-center justify-center text-black-rich/20 font-medium">
                                Transformation Photo
                            </div>
                            <h3 className="font-bold text-xl text-black-rich mb-1">Emma R.</h3>
                            <p className="text-brand text-sm font-bold uppercase tracking-wide">Overcame Anxiety & Got Fit</p>
                            <p className="mt-4 text-black-rich/60 italic">"I never thought I could do it until I found Grindset. Truly life changing."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing CTA */}
            <section id="pricing" className="py-24 bg-black-rich text-white">
                <div className="container mx-auto px-4 text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                        Join the <span className="text-brand">Movement</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        Start your 7-day free trial today. Cancel anytime.
                    </p>
                </div>
                <div className="flex justify-center">
                    <a href="/pricing" className="bg-brand hover:bg-brand-600 text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-brand/50 uppercase text-lg tracking-widest transition-all transform hover:-translate-y-1">
                        Start Your Journey
                    </a>
                </div>
            </section>
        </main>
    );
}
