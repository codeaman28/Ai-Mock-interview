import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out the platform.",
    features: [
      "1 AI Mock Interview per month",
      "Standard feedback",
      "Access to 50+ basic questions",
      "Email support"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Best for active job seekers.",
    features: [
      "Unlimited AI Mock Interviews",
      "Detailed analytics & scorecards",
      "Live coding environment",
      "Premium question bank",
      "Priority 24/7 support"
    ],
    buttonText: "Start 7-Day Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and bootcamps.",
    features: [
      "Everything in Pro",
      "Custom interview rubrics",
      "Team performance tracking",
      "API access",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    popular: false
  }
];

function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative z-10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-indigo-400">Pricing</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Invest in your career. Choose the plan that best fits your interview preparation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-slate-900 rounded-3xl p-8 border ${
                plan.popular ? 'border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] transform md:-translate-y-4' : 'border-slate-800'
              } flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-slate-300 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400">{plan.period}</span>}
                </div>
                <p className="text-slate-400 mt-4 text-sm">{plan.description}</p>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-indigo-500/20 p-1 rounded-full flex-shrink-0">
                        <Check className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
