import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import VideoSection from "../components/VideoSection";
import FeaturesCarousel from "../components/FeaturesCarousel";
import PricingSection from "../components/PricingSection";
import TestimonialsSection from "../components/TestimonialsSection";

function Landing() {
    const navigate = useNavigate();
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".animate-element",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleStart = () => {
        navigate("/register");
    };

    return (
        <div className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-indigo-500/30">
            {/* Hero Section */}
            <main ref={heroRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
                {/* Background glowing orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="animate-element inline-block mb-8 px-5 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                        ✨ Elevate Your Career
                    </div>

                    <h1 className="animate-element text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                        Master Your Next <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 animate-gradient-x">
                            Technical Interview
                        </span>
                    </h1>

                    <p className="animate-element text-lg md:text-xl lg:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Practice with our advanced AI Mock Interviewer. Get real-time feedback, improve your answers, and land your dream job with absolute confidence.
                    </p>

                    <div className="animate-element flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={handleStart}
                            className="px-8 py-4 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                        >
                            Start Mock Interview
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800 text-white font-semibold text-lg transition-all duration-300"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </main>

            <VideoSection />
            <FeaturesCarousel />
            <TestimonialsSection />
            <PricingSection />
        </div>
    );
}

export default Landing;