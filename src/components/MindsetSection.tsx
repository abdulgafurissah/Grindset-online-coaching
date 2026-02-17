import { Brain, Sparkles, Target } from "lucide-react";

const mindsetFeatures = [
    {
        icon: <Brain className="w-8 h-8 text-black-rich" />,
        title: "Behavioral Psychology",
        description: "We use science-backed techniques to rewire your brain for success, breaking old patterns and installing new, empowering beliefs."
    },
    {
        icon: <Target className="w-8 h-8 text-black-rich" />,
        title: "Goal Visualization",
        description: "Learn to visualize your success with clarity. Our guided mental exercises help you stay focused on your long-term vision."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-black-rich" />,
        title: "Stress Management",
        description: "Fitness isn't just physical. We teach you how to manage cortisol levels and use exercise as a tool for mental clarity."
    }
];

export function MindsetSection() {
    return (
        <section className="py-24 bg-brand text-black-rich">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                            Train Your Mind, <br /> Transform Your <span className="text-white">Body</span>
                        </h2>
                        <p className="text-black-rich/80 text-lg leading-relaxed mb-8 font-medium">
                            Most fitness programs fail because they ignore the most critical muscle: your brain.
                            At Grindset, we integrate psychological conditioning directly into your physical training.
                        </p>
                        <ul className="space-y-4">
                            {["Overcome Self-Sabotage", "Build Unbreakable Discipline", "Develop a Growth Mindset"].map((item, i) => (
                                <li key={i} className="flex items-center font-bold text-xl">
                                    <span className="w-6 h-6 bg-black-rich text-brand flex items-center justify-center rounded-full mr-3 text-sm">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid gap-6">
                        {mindsetFeatures.map((feature, index) => (
                            <div key={index} className="bg-white/10 p-6 rounded-xl border border-black-rich/5 backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-500/20 p-3 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                                        <p className="text-black-rich/70">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
