import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { BALANCE_ICON } from './constants';

const PREMIUM_COST = 500;
const MAX_LEVEL = 30;

const BattlePassPage: React.FC = () => {
  const game = useContext(GameContext);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [hasPremium, setHasPremium] = useState(false);
  const [claimedLevels, setClaimedLevels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const xpPerLevel = 100;

  useEffect(() => {
    loadBattlePassData();
  }, [game?.userProfile?.id]);

  const loadBattlePassData = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('battlepass_level, battlepass_xp, battlepass_premium, battlepass_claimed')
      .eq('id', game.userProfile.id)
      .single();

    if (data) {
      setCurrentLevel(data.battlepass_level || 1);
      setXp(data.battlepass_xp || 0);
      setHasPremium(data.battlepass_premium || false);
      setClaimedLevels(data.battlepass_claimed || []);
    }
    setLoading(false);
  };

  const buyPremium = async () => {
    if (!game?.userProfile || !supabase) return;

    if (game.balance < PREMIUM_COST) {
      game.showToast('Not enough souls!', 'error');
      return;
    }

    await game.updateBalance(game.balance - PREMIUM_COST);
    await supabase.from('profiles')
      .update({ battlepass_premium: true })
      .eq('id', game.userProfile.id);

    setHasPremium(true);
    game.showToast('Premium Battle Pass activated!', 'success');
  };

  const claimReward = async (level: number, isPremium: boolean) => {
    if (!game?.userProfile || !supabase) return;
    
    if (isPremium && !hasPremium) return;
    if (level > currentLevel) return;
    if (claimedLevels.includes(level)) return;

    const newClaimed = [...claimedLevels, level];
    await supabase.from('profiles')
      .update({ battlepass_claimed: newClaimed })
      .eq('id', game.userProfile.id);

    setClaimedLevels(newClaimed);
    
    // Give reward (simplified - always souls)
    const reward = isPremium ? level * 50 : level * 20;
    await game.updateBalance(game.balance + reward);
    game.showToast(`Claimed ${reward} souls!`, 'success');
  };

  const progress = (xp % xpPerLevel) / xpPerLevel * 100;

  if (!game) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-glow-cyan animate-pulse">Loading Battle Pass...</p>
      </div>
    );
  }

  const renderLevel = (level: number) => {
    const isUnlocked = level <= currentLevel;
    const isClaimed = claimedLevels.includes(level);
    const freeReward = level * 20;
    const premiumReward = level * 50;

    return (
      <div
        key={level}
        className={`p-3 border ${isUnlocked ? 'border-accent-yellow bg-accent-yellow/10' : 'border-border-dark bg-black/20'}`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-pixel text-lg text-accent-cyan">Level {level}</p>
          {isUnlocked && !isClaimed && (
            <span className="text-xs bg-accent-green text-black px-2 py-1 font-pixel">
              UNLOCKED!
            </span>
          )}
        </div>

        {/* Free Reward */}
        <div className="flex items-center justify-between p-2 bg-black/30 mb-2">
          <div className="flex items-center gap-2">
            <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
            <span className="text-sm text-text-light">{freeReward} souls</span>
          </div>
          {isUnlocked && !isClaimed && (
            <button
              onClick={() => claimReward(level, false)}
              className="btn btn-green !py-1 !text-xs"
            >
              Claim
            </button>
          )}
          {isClaimed && <span className="text-accent-green text-xs">✓</span>}
        </div>

        {/* Premium Reward */}
        <div className={`flex items-center justify-between p-2 ${hasPremium ? 'bg-accent-purple/20' : 'bg-black/50 opacity-50'}`}>
          <div className="flex items-center gap-2">
            <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
            <span className="text-sm text-accent-purple">{premiumReward} souls</span>
            <span className="text-xs text-accent-yellow">⭐ PREMIUM</span>
          </div>
          {isUnlocked && !isClaimed && hasPremium && (
            <button
              onClick={() => claimReward(level, true)}
              className="btn btn-yellow !py-1 !text-xs"
            >
              Claim
            </button>
          )}
          {isClaimed && hasPremium && <span className="text-accent-green text-xs">✓</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-yellow mb-4">🏆 Battle Pass</h1>

        {/* Header */}
        <div className="bg-black/50 border border-accent-yellow p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-pixel text-xl text-accent-cyan">Level {currentLevel}</p>
              <p className="text-xs text-text-dark">{xp}/{xpPerLevel} XP</p>
            </div>
            {!hasPremium && (
              <button onClick={buyPremium} className="btn btn-yellow !py-2">
                Buy Premium ({PREMIUM_COST} souls)
              </button>
            )}
            {hasPremium && (
              <span className="font-pixel text-accent-purple">⭐ PREMIUM ACTIVE</span>
            )}
          </div>

          {/* XP Bar */}
          <div className="w-full bg-black/50 h-4 relative overflow-hidden border border-border-dark">
            <div
              className="h-full bg-gradient-to-r from-accent-purple to-accent-yellow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Levels */}
        <div className="flex-grow overflow-y-auto pr-2 min-h-0 space-y-2">
          {Array.from({ length: Math.min(currentLevel + 3, MAX_LEVEL) }, (_, i) => i + 1).map(renderLevel)}
        </div>

        {/* Info */}
        <div className="mt-4 bg-black/20 p-3 border border-border-dark flex-shrink-0">
          <p className="font-pixel text-sm text-accent-purple mb-2">Earn XP by:</p>
          <ul className="text-xs text-text-dark space-y-1 list-disc list-inside">
            <li>Spinning casino (+5 XP)</li>
            <li>Completing trades (+10 XP)</li>
            <li>Crafting units (+15 XP)</li>
            <li>Winning PvP battles (+20 XP)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BattlePassPage;

