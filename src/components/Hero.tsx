import Link from "next/link";
import Image from "next/image";
import { BookAdminConsultationDialog } from "@/components/BookAdminConsultationDialog";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center bg-white overflow-hidden pt-20">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="relative z-20 text-center lg:text-left order-2 lg:order-1">
                    <div className="inline-block px-4 py-2 bg-brand/10 text-brand font-bold uppercase tracking-widest text-xs rounded-full mb-6">
                        Elite Online Coaching
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black-rich tracking-tight mb-6 leading-[1.1]">
                        Transform Your <br className="hidden lg:block" />
                        <span className="text-brand">Life Today</span>
                    </h1>
                    <p className="text-lg md:text-xl text-black-rich/70 mb-10 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Professional coaching tailored to your lifestyle. We combine nutrition, training, and mindset to build a better you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                        <BookAdminConsultationDialog />
                        <Link
                            href="/coaches"
                            className="w-full sm:w-auto border border-black-rich/10 hover:border-brand hover:text-brand text-black-rich font-bold py-4 px-10 rounded-lg transition-all"
                        >
                            View Coaches
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-black-rich/40 grayscale">
                        {/* Trust indicators/logos could go here */}
                        <span className="text-sm font-bold uppercase tracking-widest">Trusted by 10,000+ Clients</span>
                    </div>
                </div>

                {/* Image */}
                <div className="relative z-10 h-[500px] lg:h-[700px] w-full order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Elite Fitness Model"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-rich/50 to-transparent lg:hidden" />
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand/5 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl z-0" />
        </section>
    );
}
