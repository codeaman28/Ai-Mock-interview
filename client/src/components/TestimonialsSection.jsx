import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "MockAI completely transformed how I prepared for my front-end interviews. The real-time coding environment combined with AI feedback was exactly what I needed to land my job at a FAANG company.",
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    company: "TechNexus",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    quote: "I was struggling with system design questions. The AI personas simulated difficult interviewers perfectly, forcing me to explain my trade-offs clearly. Worth every penny.",
    name: "Michael Chen",
    role: "Backend Developer",
    company: "CloudScale",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "As a recent bootcamp grad, interviews frankly terrified me. Being able to practice 24/7 without judgment built my confidence up tremendously. I just signed my first offer!",
    name: "Elena Rodriguez",
    role: "Junior Full Stack Dev",
    company: "StartupInc",
    avatar: "https://i.pravatar.cc/150?img=32"
  }
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Engineers</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. See what our community has achieved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col relative group hover:border-indigo-500/30 transition-colors duration-300">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-800 group-hover:text-indigo-900/50 transition-colors duration-300 -z-0" />
              
              <div className="relative z-10 flex-grow">
                <p className="text-slate-300 leading-relaxed mb-8 relative">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all duration-300"
                />
                <div>
                  <h4 className="text-slate-100 font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-slate-400">{testimonial.role} at <span className="text-indigo-400">{testimonial.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
