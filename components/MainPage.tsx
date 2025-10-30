import React, { useState, useEffect } from 'react';

const GlitchText: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative text-5xl md:text-6xl font-pixel text-glow-cyan" data-text={text}>
    {text}
    <div className="absolute top-0 left-0 w-full h-full opacity-80" style={{
      textShadow: '-2px 0 var(--accent-red)',
      clipPath: 'inset(50% 0 50% 0)',
      animation: 'glitch-anim-1 2s infinite linear alternate-reverse'
    }}>
      {text}
    </div>
    <div className="absolute top-0 left-0 w-full h-full opacity-80" style={{
      textShadow: '2px 0 var(--accent-purple)',
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

const Typewriter: React.FC<{ text: string, onComplete: () => void }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                onComplete();
            }
        }, 50); // Typing speed
        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <p>{displayedText}<span className="animate-flicker">_</span></p>;
};

const MainPage: React.FC = () => {
    const [typingStep, setTypingStep] = useState(0);
    const messages = [
        "> BOOTING FAZBEAR OS...",
        "> WARNING: SYSTEM INTEGRITY COMPROMISED...",
    ];

  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full text-center p-4">
        
        <img src="https://i.ibb.co/HDtC7c6s/fnaf-fazbear-entertainment-logo-by-underscoreyt-dg3atvz-fullview.png" alt="Fazbear Entertainment" className="w-40 h-40 mb-4 animate-flicker" />

        <GlitchText text="SECURITY LOG" />
        <h2 className="font-pixel text-2xl text-glow-yellow mt-2 mb-8">NIGHT SHIFT TERMINAL</h2>
        
        <div className="container-glow max-w-lg w-full text-left p-4 min-h-[180px] relative">
            <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="font-pixel text-red-500 text-lg">REC</span>
            </div>
             <div className="text-text-light text-base space-y-2">
                {typingStep > 0 ? <p>{messages[0]}</p> : <Typewriter text={messages[0]} onComplete={() => setTimeout(() => setTypingStep(1), 500)} />}
                {typingStep > 1 && <p>{messages[1]}</p>}
                {typingStep === 1 && <Typewriter text={messages[1]} onComplete={() => setTimeout(() => setTypingStep(2), 500)}/>}
                
                {typingStep >= 2 && 
                    <div className="animate-fadeIn">
                        <p className="text-accent-green">{'>'} CONNECTION ESTABLISHED. WELCOME.</p>
                        <p className="mt-4">{'>'} USE NAV-BAR TO ACCESS DATABASES.</p>
                    </div>
                }
            </div>
        </div>

        <div className="mt-8 text-sm text-glow-purple animate-flicker">
            BOT SPONSOR: @NAVARRLORBX
        </div>
    </div>
  );
};

export default MainPage;