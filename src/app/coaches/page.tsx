import { Navbar } from "@/components/Navbar";
import { User, Star, Award, BookOpen } from "lucide-react";
import Image from "next/image";
import { getCoaches } from "@/app/actions/coach-public";
import { JoinAsCoachCTA } from "@/components/JoinAsCoachCTA";
import { BookConsultationDialog } from "@/components/BookConsultationDialog";
import { SelectCoachButton } from "@/components/SelectCoachButton";

export default async function CoachesPage() {
    const coaches = await getCoaches();

    return (
        <main className="min-h-screen bg-white text-black-rich">
            <Navbar />
            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-black-rich">
                        Meet Your <span className="text-brand">Mentors</span>
                    </h1>
                    <p className="text-black-rich/60 max-w-2xl mx-auto text-lg mb-8">
                        Expert guidance to help you unlock your full potential.
                    </p>
                    <JoinAsCoachCTA />
                </div>

                {coaches.length === 0 ? (
                    <div className="text-center py-20 text-black-rich/50">
                        <p>No coaches found. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coaches.map((coach: any) => (
                            <div key={coach.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-xl hover:border-brand/20 transition-all duration-300">
                                <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                    {coach.image ? (
                                        <Image
                                            src={coach.image}
                                            alt={coach.name || "Coach"}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <User className="h-24 w-24 text-slate-300" />
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold text-sm">{coach.profile?.rating?.toFixed(1) || "5.0"}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                            {coach.profile?.specialty || "Fitness Coach"}
                                        </span>
                                        <h3 className="text-2xl font-bold text-black-rich">{coach.name}</h3>
                                    </div>

                                    <p className="text-black-rich/70 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {coach.profile?.bio || "Dedicated to helping you reach your goals."}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-black-rich/80">
                                            <Award className="w-4 h-4 text-brand" />
                                            <span>{coach.profile?.qualification || "Certified Trainer"}</span>
                                        </div>
                                        {coach.profile?.experience && (
                                            <div className="flex items-center gap-3 text-sm text-black-rich/80">
                                                <BookOpen className="w-4 h-4 text-brand" />
                                                <span>{coach.profile?.experience} Experience</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <SelectCoachButton coachId={coach.id} coachName={coach.name?.split(" ")[0] || "Coach"} />
                                        <BookConsultationDialog coachId={coach.id} coachName={coach.name || "Coach"} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
