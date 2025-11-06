import React, { useState, useCallback, useContext } from 'react';
import { Unit, Rarity } from '../types';
import { UNITS, CASINO_COST } from './constants';
import UnitCard from './shared/UnitCard';
import { GameContext } from '../App';

const getRarityStyles = (rarity: Rarity): { color: string; shadow: string } => {
  switch (rarity) {
    case Rarity.Common: return { color: '#9ca3af', shadow: '#9ca3af' };
    case Rarity.Uncommon: return { color: '#32ff91', shadow: '#32ff91' };
    case Rarity.Rare: return { color: '#58a5fe', shadow: '#58a5fe' };
    case Rarity.Epic: return { color: '#b456f0', shadow: '#b456f0' };
    case Rarity.Mythic: return { color: '#fcee63', shadow: '#fcee63' };
    case Rarity.Secret: return { color: '#ff3232', shadow: '#ff3232' };
    case Rarity.Nightmare: return { color: '#6366f1', shadow: '#6366f1' };
    case Rarity.Hero: return { color: '#fde047', shadow: '#fde047' };
    case Rarity.Legendary: return { color: '#f97316', shadow: '#f97316' };
    default: return { color: '#6b7280', shadow: '#6b7280' };
  }
};

const CasinoPage: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedUnit, setDisplayedUnit] = useState<Unit | null>(null);
  const [wonUnit, setWonUnit] = useState<Unit | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const game = useContext(GameContext);

  const handleSpin = useCallback(() => {
    if (isSpinning || !game || game.balance < CASINO_COST) return;

    game.updateBalance(game.balance - CASINO_COST);
    game.unlockAchievement('first_spin');

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
          switch(unit.rarity) {
            case Rarity.Common: weight = 100; break;
            case Rarity.Uncommon: weight = 50; break;
            case Rarity.Rare: weight = 25; break;
            case Rarity.Epic: weight = 10; break;
            case Rarity.Mythic: weight = 5; break;
            case Rarity.Secret: weight = 3; break;
            case Rarity.Nightmare: weight = 2; break;
            case Rarity.Hero: weight = 1; break;
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
        setIsSpinning(false);
        setDisplayedUnit(finalUnit);
        setTimeout(() => setShowWinModal(true), 300);
      }
    }, 75); // Faster spin
  }, [isSpinning, game]);

  const closeModal = () => {
    setShowWinModal(false);
    setWonUnit(null);
    setDisplayedUnit(null);
  };

  const rarityStyles = wonUnit ? getRarityStyles(wonUnit.rarity) : { color: 'var(--accent-cyan)', shadow: 'var(--accent-cyan)'};


  return (
    <div className="casino-bg p-4 flex flex-col items-center justify-center animate-fadeIn">
      <h1 className="font-pixel text-4xl text-center mb-2 text-glow-purple">Casino</h1>
      <p className="text-center text-text-dark mb-8 font-pixel text-lg">Cost: {CASINO_COST} soul</p>

      <div className="relative w-56 h-72 mb-8 flex items-center justify-center p-4 container-glow">
        {displayedUnit ? (
          <div className={`transition-all duration-300 transform ${wonUnit ? 'scale-110' : ''}`}>
            <UnitCard unit={displayedUnit} />
          </div>
        ) : (
          <div className="w-48 h-64 bg-black/30 flex items-center justify-center border-2 border-dashed border-border-dark">
            <span className="font-pixel text-text-dark text-4xl text-glow-cyan animate-pulse">?</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || !game || game.balance < CASINO_COST}
        className="btn btn-green font-pixel text-2xl px-8 py-4"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
      {game && game.balance < CASINO_COST && !isSpinning && (
         <p className="text-glow-red mt-4 font-pixel text-lg">Not enough souls</p>
      )}

      {/* Win Modal with Enhanced Effects */}
      {showWinModal && wonUnit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          {/* Particle effects for rare units */}
          {[Rarity.Mythic, Rarity.Secret, Rarity.Nightmare, Rarity.Hero, Rarity.Legendary].includes(wonUnit.rarity) && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: rarityStyles.color,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    boxShadow: `0 0 10px ${rarityStyles.shadow}`,
                  }}
                />
              ))}
            </div>
          )}
          
          <div 
            className="relative p-6 text-center bg-background-dark border-2 animate-fadeIn"
            style={{ 
              borderColor: rarityStyles.color, 
              boxShadow: `0 0 30px ${rarityStyles.shadow}, inset 0 0 20px rgba(0,0,0,0.5)`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            {/* Glow effect for rare units */}
            {[Rarity.Mythic, Rarity.Secret, Rarity.Nightmare, Rarity.Hero, Rarity.Legendary].includes(wonUnit.rarity) && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle, ${rarityStyles.color}20 0%, transparent 70%)`,
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}
              />
            )}
            
            <div className="relative z-10">
              <h2 
                className="text-3xl font-pixel mb-2 animate-pulse" 
                style={{ 
                  color: rarityStyles.color, 
                  textShadow: `0 0 10px ${rarityStyles.shadow}, 0 0 20px ${rarityStyles.shadow}`,
                  animation: 'pulse 1s ease-in-out infinite'
                }}
              >
                {wonUnit.rarity === Rarity.Legendary ? 'LEGENDARY WIN!' : 
                 wonUnit.rarity === Rarity.Hero ? 'HERO WIN!' :
                 wonUnit.rarity === Rarity.Nightmare ? 'NIGHTMARE WIN!' :
                 wonUnit.rarity === Rarity.Secret ? 'SECRET WIN!' :
                 wonUnit.rarity === Rarity.Mythic ? 'MYTHIC WIN!' : 'YOU WON!'}
              </h2>
              
              <div className="mx-auto w-40 h-56 mb-4 transform scale-110 transition-transform duration-300">
                <div 
                  className="relative"
                  style={{
                    filter: `drop-shadow(0 0 15px ${rarityStyles.shadow})`,
                  }}
                >
                  <UnitCard unit={wonUnit} />
                </div>
              </div>
              
              <p 
                className="font-pixel text-2xl mb-2" 
                style={{ 
                  color: rarityStyles.color,
                  textShadow: `0 0 8px ${rarityStyles.shadow}`
                }}
              >
                {wonUnit.name}
              </p>
              <p className="text-text-dark text-sm mb-6">{wonUnit.rarity}</p>
              
              <button
                onClick={closeModal}
                className="btn btn-green w-full text-lg"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasinoPage;

