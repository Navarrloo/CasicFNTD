import React, { useState, useEffect } from 'react';
import WebGLHeroTitle from './WebGLHeroTitle';

// Floating particle component
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => (
  <div
    className="absolute w-1 h-1 bg-orange-500 rounded-full animate-floatParticle"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      boxShadow: '0 0 10px var(--accent-orange)',
    }}
  />
);

// Animated Freddy character component
const FreddyCharacter: React.FC = () => (
  <div className="absolute left-4 bottom-24 w-32 h-32 animate-slideInLeft opacity-90 pointer-events-none z-10">
    <div className="relative w-full h-full animate-float">
      <img
        src="https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/42/Unit_Freddy.png"
        alt="Freddy"
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 0 20px var(--accent-orange))',
        }}
      />
    </div>
  </div>
);

// Security camera overlay
const SecurityCamera: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 left-4 font-rust text-orange-600 text-xs z-20 animate-cameraOverlay">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-orange-600 rounded-full animate-blink"></div>
        <span>CAM 01</span>
      </div>
      <div className="mt-1">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
    </div>
  );
};

// Warning lights
const WarningLight: React.FC<{ position: 'left' | 'right', color: 'red' | 'yellow' }> = ({ position, color }) => (
  <div
    className={`absolute top-4 ${position === 'left' ? 'left-20' : 'right-4'} w-4 h-4 rounded-full animate-blink z-20`}
    style={{
      backgroundColor: color === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)',
      boxShadow: `0 0 20px ${color === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)'}`,
    }}
  />
);

// Scanline effect overlay
const Scanlines: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
    <div
      className="absolute w-full h-1 bg-gradient-to-b from-transparent via-orange-500 to-transparent animate-scanline"
      style={{ height: '100px' }}
    />
  </div>
);

const GlitchText: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative text-5xl md:text-6xl font-rust text-orange-500" data-text={text}>
    {text}
    <div className="absolute top-0 left-0 w-full h-full opacity-80" style={{
      textShadow: '-2px 0 var(--accent-red)',
      clipPath: 'inset(50% 0 50% 0)',
      animation: 'glitch-anim-1 2s infinite linear alternate-reverse'
    }}>
      {text}
    </div>
    <div className="absolute top-0 left-0 w-full h-full opacity-80" style={{
      textShadow: '2px 0 var(--accent-yellow)',
      clipPath: 'inset(25% 0 25% 0)',
      animation: 'glitch-anim-2 3s infinite linear alternate-reverse'
    }}>
      {text}
    </div>
    <style>{`
      @keyframes glitch-anim-1 {
        0% { clip-path: inset(45% 0 55% 0); } 20% { clip-path: inset(10% 0 80% 0); } 40% { clip-path: inset(70% 0 20% 0); }
        60% { clip-path: inset(30% 0 65% 0); } 80% { clip-path: inset(90% 0 5% 0); } 100% { clip-path: inset(50% 0 40% 0); }
      }
      @keyframes glitch-anim-2 {
        0% { clip-path: inset(85% 0 5% 0); } 20% { clip-path: inset(40% 0 50% 0); } 40% { clip-path: inset(20% 0 70% 0); }
        60% { clip-path: inset(75% 0 15% 0); } 80% { clip-path: inset(5% 0 90% 0); } 100% { clip-path: inset(60% 0 30% 0); }
      }
    `}</style>
  </div>
);

const MainPage: React.FC = () => {
  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full text-center p-4 relative overflow-hidden">
      {/* Floating particles in background */}
      {[...Array(15)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} />
      ))}

      {/* Scanline CRT effect */}
      <Scanlines />

      {/* Security camera overlay */}
      <SecurityCamera />

      {/* Warning lights */}
      <WarningLight position="left" color="yellow" />
      <WarningLight position="right" color="red" />

      {/* Animated Freddy character */}
      <FreddyCharacter />

      <img src="https://i.ibb.co/HDtC7c6s/fnaf-fazbear-entertainment-logo-by-underscoreyt-dg3atvz-fullview.png" alt="Fazbear Entertainment" className="w-40 h-40 mb-4 animate-flicker animate-bounceIn" />

      <div className="animate-slideInBottom w-full max-w-4xl mx-auto mb-12">
        <WebGLHeroTitle text="FNTD WORLD" />
      </div>

      <div className="mt-8 text-sm text-stone-500 animate-flicker font-rust">
        СПОНСОР БОТА: @NAVARRLORBX
      </div>
    </div>
  );
};

export default MainPage;
