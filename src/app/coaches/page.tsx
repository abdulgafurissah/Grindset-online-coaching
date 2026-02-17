import { Navbar } from "@/components/Navbar";
import { User } from "lucide-react";
import Image from "next/image";

// Mock data until DB is connected
const coaches = [
    {
        id: "1",
        name: "Alex 'The Mauler' Pereira",
        bio: "UFC Light Heavyweight Champion. Elite striking specialist focusing on KO power and distance management.",
        image: null
    },
    {
        id: "2",
        name: "Islam Makhachev",
        bio: "Dagestani Wrestling & Sambo expert. Master the art of ground control and submissions.",
        image: null
    },
    {
        id: "3",
        name: "Mike Tyson",
        bio: "The Baddest Man on the Planet. Peek-a-boo boxing style and explosive conditioning.",
        image: null
    }
];

export default function CoachesPage() {
    return (
        <main className="min-h-screen bg-black-rich text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-12 text-center">
                    Meet Your <span className="text-brand">Mentors</span>
                </h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coaches.map((coach) => (
                        <div key={coach.id} className="bg-black-light border border-white/10 rounded-xl overflow-hidden group hover:border-brand/50 transition-all">
                            <div className="h-64 bg-white/5 flex items-center justify-center">
                                <div className="h-full w-full relative">
                                    {coach.image ? (
                                        <Image
                                            src={coach.image}
                                            alt={coach.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <User className="h-24 w-24 text-white/20" />
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{coach.name}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{coach.bio}</p>
                                <a href={`/apply?coach=${coach.id}`} className="block mt-6 text-center w-full py-3 bg-white/5 hover:bg-brand hover:text-black-rich text-white font-bold uppercase text-sm tracking-widest transition-all rounded-sm">
                                    Work with {coach.name.split(" ")[0]}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
