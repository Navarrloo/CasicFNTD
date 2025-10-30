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


const Typewriter: React.FC<{ text: string, onComplete?: () => void }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                if(onComplete) onComplete();
            }
        }, 50); // Typing speed
        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return <p>{displayedText}<span className="animate-flicker">_</span></p>;
};

const MainPage: React.FC = () => {
    const [typingStep, setTypingStep] = useState(0);

  return (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full text-center p-4">
        <GlitchText text="FNTD 2" />
        <h2 className="font-pixel text-2xl text-glow-yellow mt-2 mb-8">Wiki & Casino</h2>
        
        <div className="container-glow max-w-lg w-full text-left p-4 min-h-[180px]">
            <div className="text-text-light text-base space-y-2">
                {typingStep >= 0 && <Typewriter text="> Welcome to the FNTD 2 Holo-Net." onComplete={() => setTypingStep(1)} />}
                {typingStep >= 1 && <Typewriter text="> Accessing database..." onComplete={() => setTypingStep(2)}/>}
                {typingStep >= 2 && <p className="text-accent-green">> Connection successful. 9 Pages, 5 Active Users, 710 Contributions.</p>}
                {typingStep >= 2 && <p className="mt-4">> Use the navigation below to access the Wiki, Casino, or Profile.</p>}
            </div>
        </div>

        <div className="mt-8 text-sm text-glow-purple animate-flicker">
            BOT SPONSOR: @NAVARRLORBX
        </div>
    </div>
  );
};

export default MainPage;