import { User } from "lucide-react";
import Image from "next/image";
import { JoinAsCoachCTA } from "@/components/JoinAsCoachCTA";

const topCoaches = [
    {
        id: "1",
        name: "Sarah Jenkins",
        role: "Mindset & Performance",
        image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=3387&auto=format&fit=crop"
    },
    {
        id: "2",
        name: "David Chen",
        role: "Strength & Conditioning",
        image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=3387&auto=format&fit=crop"
    },
    {
        id: "3",
        name: "Amanda Ross",
        role: "Nutrition Specialist",
        image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=3387&auto=format&fit=crop"
    }
];

export function TopCoaches() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-black-rich tracking-tight mb-4">
                        Meet Our <span className="text-brand">Experts</span>
                    </h2>
                    <p className="text-black-rich/60 max-w-2xl mx-auto">
                        Work with world-class coaches who have helped thousands of people achieve their goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {topCoaches.map((coach) => (
                        <div key={coach.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                            {/* Image Container */}
                            <div className="aspect-[4/5] w-full rounded-xl overflow-hidden mb-6 relative bg-gray-100">
                                {coach.image ? (
                                    <Image
                                        src={coach.image}
                                        alt={coach.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="h-20 w-20 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="text-center px-4 pb-4">
                                <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">{coach.role}</p>
                                <h3 className="text-xl font-bold text-black-rich">{coach.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <JoinAsCoachCTA />

                <div className="text-center mt-12">
                    <a href="/coaches" className="inline-block bg-white text-black-rich border border-gray-200 hover:border-brand hover:text-brand font-bold py-4 px-12 rounded-lg transition-all shadow-sm hover:shadow-md">
                        View All Coaches
                    </a>
                </div>
            </div>
        </section>
    );
}
