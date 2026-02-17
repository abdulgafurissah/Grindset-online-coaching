import { Zap, Trophy, Activity, Brain } from "lucide-react";

const features = [
    {
        icon: <Brain className="w-10 h-10 text-brand" />,
        title: "Mindset Mastery",
        description: "Develop the psychological resilience to overcome obstacles and stay consistent long-term."
    },
    {
        icon: <Activity className="w-10 h-10 text-brand" />,
        title: "Holistic Fitness",
        description: "Balanced training programs that prioritize health, longevity, and functional strength."
    },
    {
        icon: <Zap className="w-10 h-10 text-brand" />,
        title: "Peak Energy",
        description: "Optimize your nutrition and daily habits to fuel your body and mind for maximum output."
    },
    {
        icon: <Trophy className="w-10 h-10 text-brand" />,
        title: "Expert Guidance",
        description: "Work with coaches who understand both the science of training and the psychology of change."
    }
];

export function Features() {
    return (
        <section className="py-24 bg-black-light border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-4">
                        Why choose <span className="text-brand">Grindset</span>
                    </h2>
                    <div className="h-1 w-20 bg-brand mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 bg-black-rich border border-white/5 hover:border-brand/30 transition-all group">
                            <div className="mb-6 bg-black-light w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase">{feature.title}</h3>
                            <p className="text-white/60 leading-relaxed font-light">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
