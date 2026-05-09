import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface IntroAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, duration = 3 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
        },
        0.5 + index * 0.05
      );
    });

    // Scale and fade out the entire text at the end
    timeline.to(
      textElement,
      {
        scale: 1.1,
        opacity: 0,
        duration: 0.6,
      },
      duration - 0.6
    );

    // Fade out background
    timeline.to(
      bgRef.current,
      {
        opacity: 0,
        duration: 0.4,
      },
      duration - 0.4
    );

    return () => {
      timeline.kill();
    };
  }, [onComplete, duration]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-background opacity-0"
      />
      <div
        ref={textRef}
        className="relative z-10 text-center text-5xl md:text-7xl font-bold tracking-wider"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--foreground)',
          letterSpacing: '0.15em',
        }}
      >
        THE UNIQUE GIRL COLLECTION
      </div>
    </div>
  );
};

export default IntroAnimation;
