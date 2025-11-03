import React from 'react';
import { Unit, Rarity } from '../../types';

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
  isSelected?: boolean;
}

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


const RarityGem: React.FC<{rarity: Rarity}> = ({ rarity }) => {
    const styles = getRarityStyles(rarity);
    return (
        <div className="absolute top-1 right-1 w-3 h-3 transform rotate-45" style={{ backgroundColor: styles.color, boxShadow: `0 0 5px ${styles.shadow}`}}>
            <div className="w-full h-full border border-black/50"></div>
        </div>
    )
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onClick, isSelected = false }) => {
  const rarityStyles = getRarityStyles(unit.rarity);
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`relative w-full aspect-[4/5] bg-black/50 p-px group transition-all duration-300 ${onClick ? 'hover:scale-105 cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-accent-cyan' : ''}`}
      style={{
        border: `1px solid ${rarityStyles.color}`,
        boxShadow: `0 0 8px -2px ${rarityStyles.shadow}`
      }}
    >
        <div className="absolute inset-0 bg-black/50 opacity-50 group-hover:opacity-0 transition-opacity"></div>
      <div className="relative w-full h-full flex flex-col items-center justify-center p-1 bg-background-dark/80">
        
        <RarityGem rarity={unit.rarity} />

        <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden my-1">
             <img src={unit.image} alt={unit.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300" 
             style={{ filter: `drop-shadow(0 0 5px ${rarityStyles.shadow})`}}
             />
        </div>

        <div className="text-center h-5 flex-shrink-0 flex items-center justify-center">
          <p className="font-pixel text-xs" style={{ color: rarityStyles.color }}>{unit.cost}$</p>
        </div>
      </div>
    </Tag>
  );
};

export default UnitCard;
