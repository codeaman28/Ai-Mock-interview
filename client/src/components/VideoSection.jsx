import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Play, Pause } from "lucide-react";

function VideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Optional: add scroll-triggered entrance animation here using GSAP ScrollTrigger
    // if you decide to install it later. For now, we'll use a simple hover animation.
    const ctx = gsap.context(() => {
      gsap.to(".video-container", {
        y: isHovered ? -10 : 0,
        boxShadow: isHovered
          ? "0 25px 50px -12px rgba(79, 70, 229, 0.5)"
          : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        duration: 0.4,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isHovered]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={sectionRef} id="about" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          See How It <span className="text-indigo-400">Works</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
          Experience a full technical interview completely simulated by our advanced AI. 
          Get actionable feedback immediately after you finish your session.
        </p>

        <div
          className="video-container relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900 aspect-video max-w-4xl mx-auto group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={togglePlay}
        >
          {/* Placeholder for actual video source */}
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
             <p className="text-slate-500 font-medium tracking-widest absolute bottom-4 right-6">MOCKAI DASHBOARD</p>
          </div>
          
          {/* Fake Video Element (replace src with real video URL when available) */}
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen"
            src="https://www.w3schools.com/html/mov_bbb.mp4" 
            muted 
            loop
            playsInline
          />

          {/* Central Play/Pause Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'opacity-0 scale-110' : 'opacity-100 scale-100 group-hover:scale-110'}`}>
            <div className="w-20 h-20 bg-indigo-600/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-400/30">
              {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-2" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
