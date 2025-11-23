import React, { useState, useCallback, useContext } from 'react';
import { Unit, Rarity } from '../types';
import { UNITS, CASINO_COST, BALANCE_ICON } from './constants';
import UnitCard from './shared/UnitCard';
import { GameContext } from '../App';
import { SoundManager } from '../utils/sounds';


const CasinoPage: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedUnit, setDisplayedUnit] = useState<Unit | null>(null);
  const [wonUnit, setWonUnit] = useState<Unit | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const game = useContext(GameContext);

  const handleSpin = useCallback(() => {
    if (isSpinning || !game) return;

    // Allow free spin during tutorial
    const isTutorialSpin = game.tutorialActive && game.tutorialStep === 4;
    if (!isTutorialSpin && game.balance < CASINO_COST) return;

    if (!isTutorialSpin) {
      game.updateBalance(game.balance - CASINO_COST);
    }
    game.unlockAchievement('first_spin');

    SoundManager.play('spin');
    setIsSpinning(true);
    setWonUnit(null);
    setShowWinModal(false);
    let spinCount = 0;
    const maxSpins = 30;

    const spinInterval = setInterval(() => {
      spinCount++;
      const randomIndex = Math.floor(Math.random() * UNITS.length);
      setDisplayedUnit(UNITS[randomIndex]);

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);

        const weightedUnits: Unit[] = [];
        UNITS.forEach((unit: Unit) => {
          let weight = 1;
          switch (unit.rarity) {
            case Rarity.Common: weight = 80; break;
            case Rarity.Uncommon: weight = 40; break;
            case Rarity.Rare: weight = 25; break;
            case Rarity.Epic: weight = 15; break;
            case Rarity.Mythic: weight = 8; break;
            case Rarity.Secret: weight = 5; break;
            case Rarity.Nightmare: weight = 3; break;
            case Rarity.Hero: weight = 2; break;
            case Rarity.Legendary: weight = 1; break;
            default: weight = 1;
          }
          for (let i = 0; i < weight; i++) {
            weightedUnits.push(unit);
          }
        });

        const finalUnit = weightedUnits[Math.floor(Math.random() * weightedUnits.length)];
        setWonUnit(finalUnit);
        game.addToInventory(finalUnit);
        game.recordUnitWin(finalUnit.id);

        // Check for rare unit achievement and trigger special effects
        const isRareUnit = [Rarity.Mythic, Rarity.Secret, Rarity.Nightmare, Rarity.Hero, Rarity.Legendary].includes(finalUnit.rarity);
        if (isRareUnit) {
          game.unlockAchievement('lucky_7');
          SoundManager.play('rare');

          // Trigger confetti for rare wins
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);

          // Trigger screen shake for legendary/hero wins
          if ([Rarity.Hero, Rarity.Legendary].includes(finalUnit.rarity)) {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 500);

            // Haptic feedback for rare wins
            if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
          }
        } else {
          SoundManager.play('win');
        }

        // Check millionaire achievement
        if (game.balance >= 10000) {
          game.unlockAchievement('millionaire');
        }

        setIsSpinning(false);
        setDisplayedUnit(finalUnit);
        setTimeout(() => setShowWinModal(true), 300);
      }
    }, 75); // Faster spin
  }, [isSpinning, game]);

  return (
    <div className={`h-full flex flex-col items-center justify-center p-4 relative overflow-hidden ${screenShake ? 'animate-shake' : ''}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-stone-950 to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-950 to-transparent opacity-80"></div>
      </div>

      {/* Confetti Effect for rare wins */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#fcee63', '#ff3232', '#b456f0', '#32ff91', '#00ffff'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-7xl font-rust font-bold text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600 tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            CASINO
          </h1>
          <p className="text-stone-400 font-rust text-sm md:text-base tracking-widest uppercase">
            TEST YOUR LUCK • WIN RARE UNITS
          </p>
        </div>

        {/* Slot Machine Display */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-yellow-500 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
          <div className="relative bg-stone-900 border-2 border-stone-700 rounded-lg p-1 shadow-2xl">
            <div className="bg-black rounded border border-stone-800 p-8 w-64 h-64 flex items-center justify-center overflow-hidden relative">
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR5c3R5c3R5c3R5c3R5c3R5c3R5c3R5c3R5c3R5c3R5/xT9IgN8YKk0c8/giphy.gif')] opacity-5 pointer-events-none mix-blend-overlay"></div>

              {isSpinning ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-orange-500 font-rust text-xl animate-bounce">ROLLING...</p>
                </div>
              ) : displayedUnit ? (
                <div className="animate-fadeIn">
                  <UnitCard unit={displayedUnit} />
                </div>
              ) : (
                <div className="text-center opacity-50">
                  <p className="text-6xl mb-2">🎰</p>
                  <p className="font-rust text-stone-500">READY</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="flex items-center gap-4 bg-stone-900/80 px-6 py-3 rounded border border-stone-700 shadow-lg">
            <span className="text-stone-400 font-rust text-sm">COST:</span>
            <div className="flex items-center gap-2">
              <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6" />
              <span className={`text-2xl font-rust font-bold ${game && game.balance >= CASINO_COST ? 'text-white' : 'text-red-500'}`}>
                {CASINO_COST.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || !game || (game.balance < CASINO_COST && !(game.tutorialActive && game.tutorialStep === 4))}
            className={`
              w-full py-4 px-8 rounded font-rust text-2xl font-bold uppercase tracking-wider transition-all transform
              ${isSpinning
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : !game || (game.balance < CASINO_COST && !(game.tutorialActive && game.tutorialStep === 4))
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-orange-600 hover:bg-orange-500 text-black shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1 active:translate-y-0 border border-orange-400'
              }
            `}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
          </button>

          {(!game || (game.balance < CASINO_COST && !(game.tutorialActive && game.tutorialStep === 4))) && (
            <p className="text-red-500 font-rust text-sm animate-pulse">
              INSUFFICIENT FUNDS
            </p>
          )}
        </div>

        {/* Recent Wins or Info */}
        <div className="mt-8 text-center">
          <p className="text-stone-600 font-rust text-xs uppercase tracking-widest">
            CHANCE TO WIN MYTHIC & SECRET UNITS
          </p>
        </div>
      </div>

      {/* Win Modal */}
      {showWinModal && wonUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-stone-900 border-2 border-orange-500 p-8 rounded-lg max-w-sm w-full text-center shadow-[0_0_50px_rgba(234,88,12,0.5)] transform animate-scaleIn">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-600 text-black font-rust font-bold px-6 py-2 rounded border border-orange-400 shadow-lg uppercase tracking-wider text-xl">
              UNIT ACQUIRED!
            </div>

            <div className="mt-6 mb-6 transform hover:scale-105 transition-transform duration-300">
              <UnitCard unit={wonUnit} />
            </div>

            <h2 className="text-2xl font-rust text-white mb-2">{wonUnit.name}</h2>
            <p className="text-stone-400 font-rust text-sm mb-6 uppercase">{wonUnit.rarity} UNIT</p>

            <button
              onClick={() => setShowWinModal(false)}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white font-rust py-3 rounded border border-stone-600 hover:border-stone-500 transition-all uppercase tracking-wider"
            >
              COLLECT
            </button>
          </div>
          {/* Confetti would go here if we had a library for it, or simple CSS particles */}
        </div>
      )}
    </div>
  );
};

export default CasinoPage;
