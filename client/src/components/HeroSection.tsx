import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onIntroComplete?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onIntroComplete }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onIntroComplete?.();
      }
    });

    tl.fromTo(".hero-bg", 
      { scale: 1.2, filter: "brightness(0)" },
      { scale: 1, filter: "brightness(0.6)", duration: 2, ease: "power2.out" }
    )
    .fromTo(titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
      "-=1.2"
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.3"
    )
    .fromTo(ctaRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.1"
    )
    .fromTo(statsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.2"
    );

    // Parallax on scroll
    gsap.to(".hero-bg", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 200,
      ease: "none"
    });

  }, []);

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToZones = () => {
    document.getElementById('zones-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background Image */}
      <div 
        className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

      {/* Floating Particles Effect (CSS-only, no 3D crash) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container max-w-6xl mx-auto px-4 text-center">
        <div className="space-y-6">
          <div className="inline-block px-5 py-2 glass-obsidian rounded-full mb-4">
            <span className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
              ✦ New Collection 2026
            </span>
          </div>

          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            BE <span className="text-accent italic">UNIQUE</span>
            <br />
            COLLECTION
          </h1>

          <p 
            ref={subtitleRef}
            className="text-base md:text-xl text-white/60 max-w-xl mx-auto font-light tracking-wide"
          >
            Curated luxury fashion for the modern woman. 
            Premium fabrics, timeless designs.
          </p>

          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <button
              onClick={scrollToProducts}
              className="group relative px-10 py-4 bg-accent text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 tracking-widest text-sm">SHOP NOW</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
            
            <button
              onClick={scrollToZones}
              className="px-10 py-4 glass-obsidian text-white font-bold rounded-full border border-white/10 hover:border-accent/50 transition-all hover:bg-white/5 tracking-widest text-sm"
            >
              EXPLORE COLLECTIONS
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div 
          ref={statsRef}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '50+', label: 'Styles' },
            { value: '₹899', label: 'Starting' },
            { value: 'Free', label: 'Shipping' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent" />
        <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
