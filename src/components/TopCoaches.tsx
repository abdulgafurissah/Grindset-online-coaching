import { User } from "lucide-react";
import Image from "next/image";

const topCoaches = [
    {
        id: "1",
        name: "Alex 'The Mauler' Pereira",
        role: "Striking Coach",
        image: null
    },
    {
        id: "2",
        name: "Islam Makhachev",
        role: "Grappling Coach",
        image: null
    },
    {
        id: "3",
        name: "Mike Tyson",
        role: "Boxing Coach",
        image: null
    }
];

export function TopCoaches() {
    return (
        <section className="py-24 bg-black-rich border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                        Train with <span className="text-brand">Legends</span>
                    </h2>
                    <div className="h-1 w-20 bg-brand mx-auto" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {topCoaches.map((coach) => (
                        <div key={coach.id} className="group relative">
                            {/* Image Container */}
                            <div className="h-96 bg-black-light border border-white/10 rounded-xl overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black-rich via-transparent to-transparent opacity-60 z-10" />
                                {coach.image ? (
                                    <div className="h-full w-full relative">
                                        <Image
                                            src={coach.image}
                                            alt={coach.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <User className="h-32 w-32 text-white/10 group-hover:text-brand/20 transition-colors" />
                                    </div>
                                )}

                                {/* Overlay Content */}
                                <div className="absolute bottom-0 left-0 p-6 z-20">
                                    <p className="text-brand text-sm font-bold uppercase tracking-widest mb-1">{coach.role}</p>
                                    <h3 className="text-2xl font-bold text-white uppercase">{coach.name}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a href="/coaches" className="inline-block border border-white/20 hover:border-brand hover:text-brand text-white font-bold py-4 px-12 uppercase tracking-widest transition-all">
                        View All Coaches
                    </a>
                </div>
            </div>
        </section>
    );
}
