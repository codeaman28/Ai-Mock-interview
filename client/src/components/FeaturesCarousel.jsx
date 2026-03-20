import { Code2, MessagesSquare, BarChart3, Clock, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: <MessagesSquare className="w-6 h-6 text-indigo-400" />,
    title: "Realistic AI Personas",
    description: "Interview with AI trained to behave like real tech recruiters and senior engineers."
  },
  {
    icon: <Code2 className="w-6 h-6 text-cyan-400" />,
    title: "Live Coding Assessments",
    description: "Write, compile, and execute code in real-time during your mock interview."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
    title: "Actionable Analytics",
    description: "Get detailed scorecards highlighting your strengths and areas for improvement."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    title: "Customized Roles",
    description: "Tailor your interview for specific roles like Frontend, Backend, or Full Stack."
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-400" />,
    title: "On-Demand Practice",
    description: "Schedule interviews whenever you want, 24/7 without waiting for availability."
  },
  {
    icon: <Layers className="w-6 h-6 text-pink-400" />,
    title: "Vast Question Bank",
    description: "Access a curated database of real interview questions from top tech companies."
  }
];

function FeaturesCarousel() {
  return (
    <section id="features" className="py-24 bg-slate-900 relative border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Succeed</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We've built all the tools required to transform your interview anxiety into absolute confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300 group"
            >
              <div className="bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesCarousel;
