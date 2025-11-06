import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';

interface Prize {
  name: string;
  type: 'souls' | 'multiplier' | 'spin';
  value: number;
  color: string;
  probability: number;
}

const PRIZES: Prize[] = [
  { name: '10 Souls', type: 'souls', value: 10, color: '#9ca3af', probability: 30 },
  { name: '25 Souls', type: 'souls', value: 25, color: '#32ff91', probability: 25 },
  { name: '50 Souls', type: 'souls', value: 50, color: '#58a5fe', probability: 20 },
  { name: '100 Souls', type: 'souls', value: 100, color: '#b456f0', probability: 15 },
  { name: '500 Souls', type: 'souls', value: 500, color: '#fcee63', probability: 5 },
  { name: '1000 Souls', type: 'souls', value: 1000, color: '#ff3232', probability: 3 },
  { name: 'Free Spin', type: 'spin', value: 1, color: '#00ffff', probability: 2 },
];

const SPIN_COST = 50;

const WheelOfFortunePage: React.FC = () => {
  const game = useContext(GameContext);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [canSpinFree, setCanSpinFree] = useState(false);

  useEffect(() => {
    loadFreeSpinStatus();
  }, [game?.userProfile?.id]);

  const loadFreeSpinStatus = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('last_wheel_spin_date')
      .eq('id', game.userProfile.id)
      .single();

    if (data?.last_wheel_spin_date) {
      const today = new Date().toISOString().split('T')[0];
      const lastSpin = new Date(data.last_wheel_spin_date).toISOString().split('T')[0];
      setCanSpinFree(lastSpin !== today);
    } else {
      setCanSpinFree(true);
    }
  };

  const selectPrize = (): Prize => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of PRIZES) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    return PRIZES[0];
  };

  const handleSpin = async (isFree: boolean = false) => {
    if (!game) return;
    
    if (!isFree && game.balance < SPIN_COST) {
      game.showToast('Not enough souls!', 'error');
      return;
    }

    if (!isFree) {
      await game.updateBalance(game.balance - SPIN_COST);
    } else {
      const today = new Date().toISOString().split('T')[0];
      await supabase?.from('profiles')
        .update({ last_wheel_spin_date: today })
        .eq('id', game.userProfile!.id);
      setCanSpinFree(false);
    }

    setIsSpinning(true);
    const selectedPrize = selectPrize();
    
    // Calculate rotation
    const prizeIndex = PRIZES.indexOf(selectedPrize);
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = prizeIndex * segmentAngle;
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = spins * 360 + targetAngle;
    
    setRotation(finalRotation);

    setTimeout(async () => {
      setPrize(selectedPrize);
      setIsSpinning(false);
      
      // Award prize
      if (selectedPrize.type === 'souls') {
        await game.updateBalance(game.balance + selectedPrize.value);
        game.showToast(`Won ${selectedPrize.value} souls!`, 'success');
      } else if (selectedPrize.type === 'spin') {
        game.showToast('Won a free casino spin!', 'success');
      }
    }, 4000);
  };

  if (!game) return null;

  return (
    <div className="p-4 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="font-pixel text-4xl text-glow-yellow mb-4">🎡 WHEEL</h1>
        
        {canSpinFree && (
          <p className="text-accent-green font-pixel mb-4 animate-pulse">
            FREE SPIN AVAILABLE!
          </p>
        )}

        {/* Wheel */}
        <div className="relative w-80 h-80 mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-accent-yellow"></div>
          </div>

          {/* Wheel itself */}
          <div
            className="w-full h-full rounded-full border-8 border-accent-yellow relative overflow-hidden transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${PRIZES.map((p, i) => 
                `${p.color} ${(i * 360 / PRIZES.length)}deg ${((i + 1) * 360 / PRIZES.length)}deg`
              ).join(', ')})`
            }}
          >
            {PRIZES.map((p, idx) => {
              const angle = (idx * 360 / PRIZES.length) + (180 / PRIZES.length);
              return (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    transform: `rotate(${angle}deg) translateX(60px)`,
                    width: '100px',
                  }}
                >
                  <p className="font-pixel text-xs text-black font-bold text-center whitespace-nowrap">
                    {p.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {canSpinFree && (
            <button
              onClick={() => handleSpin(true)}
              disabled={isSpinning}
              className="btn btn-green font-pixel text-xl px-8"
            >
              FREE SPIN!
            </button>
          )}
          
          <button
            onClick={() => handleSpin(false)}
            disabled={isSpinning || game.balance < SPIN_COST}
            className="btn btn-yellow font-pixel text-xl px-8"
          >
            Spin ({SPIN_COST} souls)
          </button>
        </div>

        {/* Prize Display */}
        {prize && !isSpinning && (
          <div className="mt-6 p-4 border-2 border-accent-yellow bg-black/50 animate-fadeIn">
            <p className="font-pixel text-2xl text-center" style={{ color: prize.color }}>
              🎉 {prize.name}!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WheelOfFortunePage;

