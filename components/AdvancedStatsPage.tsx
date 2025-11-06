import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { BALANCE_ICON, UNITS } from './constants';

interface BalanceHistory {
  date: string;
  balance: number;
}

const AdvancedStatsPage: React.FC = () => {
  const game = useContext(GameContext);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, [game?.userProfile?.id]);

  const loadHistory = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('balance_history')
      .eq('id', game.userProfile.id)
      .single();

    if (data?.balance_history) {
      setBalanceHistory(data.balance_history || []);
    }
  };

  const getRarityDistribution = () => {
    const distribution: { [key: string]: number } = {};
    
    game?.inventory.forEach(unit => {
      const rarity = unit.rarity;
      distribution[rarity] = (distribution[rarity] || 0) + 1;
    });

    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .map(([rarity, count]) => ({
        rarity,
        count,
        percentage: (count / (game?.inventory.length || 1)) * 100
      }));
  };

  const getUniqueUnitsCount = () => {
    const uniqueIds = new Set(game?.inventory.map(u => u.id) || []);
    return uniqueIds.size;
  };

  const rarityDistribution = getRarityDistribution();
  const uniqueCount = getUniqueUnitsCount();
  const totalUnits = UNITS.length;
  const collectionPercentage = (uniqueCount / totalUnits) * 100;

  const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
      'Common': '#9ca3af',
      'Uncommon': '#32ff91',
      'Rare': '#58a5fe',
      'Epic': '#b456f0',
      'Mythic': '#fcee63',
      'Secret': '#ff3232',
      'Nightmare': '#6366f1',
      'Hero': '#fde047',
      'Legendary': '#f97316',
    };
    return colors[rarity] || '#6b7280';
  };

  if (!game) return null;

  return (
    <div className="p-4 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-6 min-h-0">
        <h1 className="font-pixel text-3xl text-glow-cyan mb-6">📊 STATISTICS</h1>

        <div className="flex-grow overflow-y-auto pr-2 min-h-0 space-y-4">
          {/* Collection Progress */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-yellow mb-3">📚 Collection</h2>
            
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-text-light">Unique Units</p>
                <p className="font-pixel text-accent-cyan">{uniqueCount}/{totalUnits}</p>
              </div>
              
              <div className="w-full bg-black/50 h-6 relative overflow-hidden border border-border-dark">
                <div
                  className="h-full bg-gradient-to-r from-accent-green to-accent-cyan"
                  style={{ width: `${collectionPercentage}%` }}
                />
                <p className="absolute inset-0 flex items-center justify-center text-xs font-pixel text-white">
                  {collectionPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Rarity Distribution */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-green mb-3">🎨 Inventory by Rarity</h2>
            
            <div className="space-y-2">
              {rarityDistribution.map(({ rarity, count, percentage }) => (
                <div key={rarity}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-pixel" style={{ color: getRarityColor(rarity) }}>
                      {rarity}
                    </span>
                    <span className="text-xs text-text-dark">{count} units</span>
                  </div>
                  <div className="w-full bg-black/50 h-3 relative overflow-hidden border border-border-dark">
                    <div
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getRarityColor(rarity),
                        opacity: 0.7
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Rates Analysis */}
          {game.unitStats && Object.keys(game.unitStats).length > 0 && (
            <div className="bg-black/30 border border-border-dark p-4">
              <h2 className="font-pixel text-lg text-glow-purple mb-3">📈 Drop Analysis</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-dark mb-1">Luckiest Pull</p>
                  <p className="font-pixel text-sm text-accent-yellow">
                    {Object.entries(game.unitStats)
                      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-dark mb-1">Success Rate</p>
                  <p className="font-pixel text-sm text-accent-green">
                    {game.totalSpins > 0 
                      ? ((Object.values(game.unitStats).reduce((a, b) => a + b, 0) / game.totalSpins) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-yellow mb-3">💰 Financial</h2>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-black/50">
                <p className="text-sm text-text-dark">Net Profit</p>
                <div className="flex items-center gap-1">
                  <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
                  <span className={`font-pixel ${
                    game.totalEarned - game.totalSpent >= 0 ? 'text-accent-green' : 'text-accent-red'
                  }`}>
                    {game.totalEarned - game.totalSpent > 0 ? '+' : ''}
                    {(game.totalEarned - game.totalSpent).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-black/50">
                <p className="text-sm text-text-dark">Average Spin Cost</p>
                <p className="font-pixel text-accent-cyan">
                  {game.totalSpins > 0 ? (game.totalSpent / game.totalSpins).toFixed(1) : 0}
                </p>
              </div>

              <div className="flex items-center justify-between p-2 bg-black/50">
                <p className="text-sm text-text-dark">ROI (Return on Investment)</p>
                <p className={`font-pixel ${
                  game.totalSpent > 0 && (game.totalEarned / game.totalSpent) > 1 
                    ? 'text-accent-green' 
                    : 'text-accent-red'
                }`}>
                  {game.totalSpent > 0 
                    ? ((game.totalEarned / game.totalSpent) * 100).toFixed(0) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Balance History Chart (Simple bars) */}
          {balanceHistory.length > 0 && (
            <div className="bg-black/30 border border-border-dark p-4">
              <h2 className="font-pixel text-lg text-glow-cyan mb-3">📉 Balance History</h2>
              
              <div className="flex items-end justify-between h-32 gap-1">
                {balanceHistory.slice(-10).map((entry, idx) => {
                  const maxBalance = Math.max(...balanceHistory.map(e => e.balance));
                  const height = (entry.balance / maxBalance) * 100;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-accent-cyan to-accent-purple transition-all"
                        style={{ height: `${height}%` }}
                      />
                      <p className="text-xs text-text-dark mt-1 transform -rotate-45 origin-top-left">
                        {new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedStatsPage;

