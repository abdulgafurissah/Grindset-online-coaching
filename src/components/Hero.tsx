import Link from "next/link";

export function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black-rich">
            {/* Background Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black-rich/60 via-black-rich/40 to-black-rich z-10" />

            {/* Background Image: Focused athlete / Mindset */}
            <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />

            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-6">
                    Unlock Your <span className="text-brand">True Potential</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
                    The ultimate fusion of physical training and psychological conditioning. Build a body that performs and a mind that never quits.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/register"
                        className="w-full sm:w-auto bg-brand hover:bg-brand-600 text-black-rich font-bold py-4 px-10 uppercase tracking-widest transition-all clip-path-slant"
                    >
                        Start Your Journey
                    </Link>
                    <Link
                        href="/coaches"
                        className="w-full sm:w-auto border border-white/20 hover:border-brand hover:text-brand text-white font-bold py-4 px-10 uppercase tracking-widest transition-all backdrop-blur-sm"
                    >
                        Meet The Experts
                    </Link>
                </div>
            </div>
        </section>
    );
}
