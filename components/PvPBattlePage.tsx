import React, { useState, useContext } from 'react';
import { GameContext } from '../App';
import { Unit, Rarity } from '../types';
import UnitCard from './shared/UnitCard';
import { BALANCE_ICON } from './constants';
import { SoundManager } from '../utils/sounds';
import { supabase } from '../lib/supabase';

const BATTLE_COST = 100;

const PvPBattlePage: React.FC = () => {
  const game = useContext(GameContext);
  const [selectedUnits, setSelectedUnits] = useState<{unit: Unit, index: number}[]>([]);
  const [battleResult, setBattleResult] = useState<'won' | 'lost' | null>(null);
  const [enemyUnits, setEnemyUnits] = useState<Unit[]>([]);
  const [reward, setReward] = useState(0);
  const [isBattling, setIsBattling] = useState(false);

  if (!game) return null;

  const getRarityPower = (rarity: Rarity): number => {
    const powers = {
      [Rarity.Common]: 1,
      [Rarity.Uncommon]: 2,
      [Rarity.Rare]: 4,
      [Rarity.Epic]: 8,
      [Rarity.Mythic]: 16,
      [Rarity.Secret]: 32,
      [Rarity.Nightmare]: 64,
      [Rarity.Hero]: 100,
      [Rarity.Legendary]: 150,
    };
    return powers[rarity] || 1;
  };

  const calculateTeamPower = (units: Unit[]): number => {
    return units.reduce((total, unit) => total + getRarityPower(unit.rarity), 0);
  };

  const toggleUnit = (unitItem: {unit: Unit, index: number}) => {
    const isSelected = selectedUnits.some(s => s.index === unitItem.index);
    
    if (isSelected) {
      setSelectedUnits(selectedUnits.filter(s => s.index !== unitItem.index));
    } else {
      if (selectedUnits.length >= 5) {
        game.showToast('Max 5 units!', 'error');
        return;
      }
      setSelectedUnits([...selectedUnits, unitItem]);
    }
  };

  const startBattle = async () => {
    if (selectedUnits.length === 0) {
      game.showToast('Select at least 1 unit!', 'error');
      return;
    }

    if (game.balance < BATTLE_COST) {
      game.showToast('Not enough souls!', 'error');
      return;
    }

    setIsBattling(true);
    await game.updateBalance(game.balance - BATTLE_COST);

    // Generate enemy team
    const { UNITS } = await import('./constants');
    const enemyTeam: Unit[] = [];
    for (let i = 0; i < 5; i++) {
      const randomUnit = UNITS[Math.floor(Math.random() * UNITS.length)];
      enemyTeam.push(randomUnit);
    }
    setEnemyUnits(enemyTeam);

    // Simulate battle
    setTimeout(() => {
      const playerPower = calculateTeamPower(selectedUnits.map(s => s.unit));
      const enemyPower = calculateTeamPower(enemyTeam);
      
      // Add some randomness (80-120%)
      const playerActualPower = playerPower * (0.8 + Math.random() * 0.4);
      const enemyActualPower = enemyPower * (0.8 + Math.random() * 0.4);

      const won = playerActualPower > enemyActualPower;
      setBattleResult(won ? 'won' : 'lost');

      // Handle battle result asynchronously
      const handleResult = async () => {
        if (won) {
          const winReward = BATTLE_COST * 2.5; // 2.5x return
          setReward(winReward);
          game.updateBalance(game.balance + winReward);
          
          // Track PvP wins
          const response = await supabase?.from('profiles')
            .select('pvp_wins')
            .eq('id', game.userProfile!.id)
            .single();
          
          const newWins = (response?.data?.pvp_wins || 0) + 1;
          await supabase?.from('profiles')
            .update({ pvp_wins: newWins })
            .eq('id', game.userProfile!.id);
          
          if (newWins >= 5) {
            game.unlockAchievement('battle_winner');
          }
          
          SoundManager.play('success');
          game.showToast(`Victory! Won ${winReward} souls!`, 'success');
        } else {
          const lossResponse = await supabase?.from('profiles')
            .select('pvp_losses')
            .eq('id', game.userProfile!.id)
            .single();
          
          await supabase?.from('profiles')
            .update({ pvp_losses: (lossResponse?.data?.pvp_losses || 0) + 1 })
            .eq('id', game.userProfile!.id);
          
          setReward(0);
          SoundManager.play('error');
          game.showToast('Defeat! Better luck next time.', 'error');
        }

        setIsBattling(false);
      };

      handleResult();
    }, 3000);
  };

  const resetBattle = () => {
    setBattleResult(null);
    setEnemyUnits([]);
    setSelectedUnits([]);
    setReward(0);
  };

  return (
    <div className="p-4 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-6 min-h-0">
        <h1 className="font-pixel text-3xl text-glow-red mb-3">⚔️ PvP ARENA</h1>
        <p className="text-base text-text-light mb-6 text-center">
          Cost: {BATTLE_COST} souls | Win: {BATTLE_COST * 2.5} souls
        </p>

        {!battleResult ? (
          <>
            {/* Your Team Selection */}
            <div className="flex-grow min-h-0 flex flex-col">
              <p className="text-sm text-text-light mb-2">
                Select your team (max 5 units):
                <span className="text-accent-green ml-2">({selectedUnits.length}/5)</span>
              </p>

              <div className="flex-grow overflow-y-auto pr-2 min-h-0 bg-black/20 p-2 border border-border-dark mb-4">
                <div className="grid grid-cols-4 gap-2">
                  {game.inventory.map((unit, index) => (
                    <div
                      key={index}
                      onClick={() => toggleUnit({unit, index})}
                      className={`cursor-pointer transition-all ${
                        selectedUnits.some(s => s.index === index)
                          ? 'ring-2 ring-accent-green scale-95'
                          : 'hover:scale-105'
                      }`}
                    >
                      <UnitCard unit={unit} />
                    </div>
                  ))}
                </div>
              </div>

              {selectedUnits.length > 0 && (
                <div className="mb-4 p-2 bg-black/30 border border-accent-green">
                  <p className="font-pixel text-accent-green text-center">
                    Team Power: {calculateTeamPower(selectedUnits.map(s => s.unit))}
                  </p>
                </div>
              )}

              <button
                onClick={startBattle}
                disabled={selectedUnits.length === 0 || game.balance < BATTLE_COST || isBattling}
                className="btn btn-red w-full"
              >
                {isBattling ? 'BATTLING...' : 'START BATTLE!'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Battle Result */}
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <h2 className={`font-pixel text-4xl mb-4 ${
                battleResult === 'won' ? 'text-glow-green' : 'text-glow-red'
              }`}>
                {battleResult === 'won' ? '🏆 VICTORY!' : '💀 DEFEAT!'}
              </h2>

              {battleResult === 'won' && (
                <div className="flex items-center gap-2 mb-6">
                  <img src={BALANCE_ICON} alt="Souls" className="w-8 h-8" />
                  <span className="font-pixel text-3xl text-glow-yellow">+{reward}</span>
                </div>
              )}

              {/* Show teams */}
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div>
                  <p className="font-pixel text-accent-green mb-2">Your Team</p>
                  <div className="grid grid-cols-2 gap-1">
                    {selectedUnits.map((s, i) => (
                      <div key={i} className="transform scale-75">
                        <UnitCard unit={s.unit} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-pixel text-accent-red mb-2">Enemy Team</p>
                  <div className="grid grid-cols-2 gap-1">
                    {enemyUnits.map((unit, i) => (
                      <div key={i} className="transform scale-75">
                        <UnitCard unit={unit} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={resetBattle} className="btn btn-yellow">
                Battle Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PvPBattlePage;

