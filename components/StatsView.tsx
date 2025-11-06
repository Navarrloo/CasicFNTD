import React from 'react';
import { Rarity } from '../types';
import { UNITS } from './constants';

interface StatsViewProps {
  unitStats: Record<number, number>;
  totalSpins: number;
  totalSpent: number;
  totalEarned: number;
}

const StatsView: React.FC<StatsViewProps> = ({ 
  unitStats, 
  totalSpins, 
  totalSpent, 
  totalEarned 
}) => {
  const getRarityColor = (rarity: Rarity): string => {
    switch (rarity) {
      case Rarity.Common: return '#9ca3af';
      case Rarity.Uncommon: return '#32ff91';
      case Rarity.Rare: return '#58a5fe';
      case Rarity.Epic: return '#b456f0';
      case Rarity.Mythic: return '#fcee63';
      case Rarity.Secret: return '#ff3232';
      case Rarity.Nightmare: return '#6366f1';
      case Rarity.Hero: return '#fde047';
      case Rarity.Legendary: return '#f97316';
      default: return '#6b7280';
    }
  };

  const sortedStats = Object.entries(unitStats)
    .map(([unitId, count]) => {
      const unit = UNITS.find(u => u.id === parseInt(unitId));
      return { unit, count };
    })
    .filter(item => item.unit)
    .sort((a, b) => {
      if (!a.unit || !b.unit) return 0;
      const rarityOrder = Object.values(Rarity);
      const aRarity = rarityOrder.indexOf(a.unit.rarity);
      const bRarity = rarityOrder.indexOf(b.unit.rarity);
      if (aRarity !== bRarity) return bRarity - aRarity;
      return b.count - a.count;
    });

  const totalUnits = Object.values(unitStats).reduce((sum, count) => sum + count, 0);
  const mostCommon = sortedStats[0];

  return (
    <div className="flex-grow overflow-y-auto pr-2 min-h-0 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/50 p-4 border-2 border-border-light">
          <p className="text-text-light text-sm mb-2">Total Spins</p>
          <p className="font-pixel text-2xl text-glow-purple">{totalSpins}</p>
        </div>
        <div className="bg-black/50 p-4 border-2 border-border-light">
          <p className="text-text-light text-sm mb-2">Units Won</p>
          <p className="font-pixel text-2xl text-glow-cyan">{totalUnits}</p>
        </div>
        <div className="bg-black/50 p-4 border-2 border-border-light">
          <p className="text-text-light text-sm mb-2">Souls Spent</p>
          <p className="font-pixel text-2xl text-glow-red">{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-black/50 p-4 border-2 border-border-light">
          <p className="text-text-light text-sm mb-2">Souls Earned</p>
          <p className="font-pixel text-2xl text-glow-green">{totalEarned.toLocaleString()}</p>
        </div>
      </div>

      {/* Highlights */}
      {mostCommon && (
        <div className="bg-black/20 p-3 border border-border-dark">
          <p className="text-text-dark text-xs mb-2">Most Common Win</p>
          <div className="flex items-center gap-2">
            <img 
              src={mostCommon.unit!.image} 
              alt={mostCommon.unit!.name} 
              className="w-12 h-16 object-contain"
            />
            <div>
              <p className="font-pixel text-sm" style={{ color: getRarityColor(mostCommon.unit!.rarity) }}>
                {mostCommon.unit!.name}
              </p>
              <p className="text-text-dark text-xs">Won {mostCommon.count} times</p>
            </div>
          </div>
        </div>
      )}

      {/* Unit Statistics */}
      <div>
        <h3 className="font-pixel text-lg text-glow-cyan mb-2">Unit Statistics</h3>
        <div className="bg-black/20 border border-border-dark">
          <div className="overflow-y-auto max-h-64">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Rarity</th>
                  <th className="text-right">Wins</th>
                </tr>
              </thead>
              <tbody>
                {sortedStats.map(({ unit, count }) => {
                  if (!unit) return null;
                  return (
                    <tr key={unit.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <img 
                            src={unit.image} 
                            alt={unit.name} 
                            className="w-8 h-10 object-contain"
                          />
                          <span className="text-sm">{unit.name}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="text-xs font-pixel"
                          style={{ color: getRarityColor(unit.rarity) }}
                        >
                          {unit.rarity}
                        </span>
                      </td>
                      <td className="text-right font-pixel">{count}</td>
                    </tr>
                  );
                })}
                {sortedStats.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-text-dark py-4">
                      No units won yet. Try the Casino!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;

