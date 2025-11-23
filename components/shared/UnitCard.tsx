import React from 'react';
import { Unit, Rarity } from '../../types';

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
  isSelected?: boolean;
}

const getRarityStyles = (rarity: Rarity): { color: string; shadow: string; bgGradient: string } => {
  switch (rarity) {
    case Rarity.Common: return { color: '#9ca3af', shadow: '#9ca3af', bgGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' };
    case Rarity.Uncommon: return { color: '#00ff88', shadow: '#00ff88', bgGradient: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' };
    case Rarity.Rare: return { color: '#00e5ff', shadow: '#00e5ff', bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)' };
    case Rarity.Epic: return { color: '#d500f9', shadow: '#d500f9', bgGradient: 'linear-gradient(135deg, #581c87 0%, #3b0764 100%)' };
    case Rarity.Mythic: return { color: '#ffd700', shadow: '#ffd700', bgGradient: 'linear-gradient(135deg, #713f12 0%, #451a03 100%)' };
    case Rarity.Secret: return { color: '#ff2a2a', shadow: '#ff2a2a', bgGradient: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)' };
    case Rarity.Nightmare: return { color: '#6366f1', shadow: '#6366f1', bgGradient: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)' };
    case Rarity.Hero: return { color: '#fde047', shadow: '#fde047', bgGradient: 'linear-gradient(135deg, #854d0e 0%, #451a03 100%)' };
    case Rarity.Legendary: return { color: '#ff9100', shadow: '#ff9100', bgGradient: 'linear-gradient(135deg, #7c2d12 0%, #431407 100%)' };
    default: return { color: '#6b7280', shadow: '#6b7280', bgGradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' };
  }
};

const RarityGem: React.FC<{ rarity: Rarity }> = ({ rarity }) => {
  const styles = getRarityStyles(rarity);
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center justify-center">
      <div
        className="w-4 h-4 transform rotate-45 border border-white/30"
        style={{
          backgroundColor: styles.color,
          boxShadow: `0 0 8px ${styles.shadow}`
        }}
      />
    </div>
  )
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, onClick, isSelected = false }) => {
  const rarityStyles = getRarityStyles(unit.rarity);
  const Tag = onClick ? 'button' : 'div';
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Check if unit is high rarity for special effects
  const isHighRarity = [Rarity.Epic, Rarity.Mythic, Rarity.Secret, Rarity.Nightmare, Rarity.Hero, Rarity.Legendary].includes(unit.rarity);

  // Get unit initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Tag
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full aspect-[4/5] rounded-lg overflow-hidden group transition-all duration-300 ${onClick ? 'hover:scale-105 hover:-translate-y-2 cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-accent-cyan' : ''}`}
      style={{
        boxShadow: isHovered
          ? `0 10px 30px -5px ${rarityStyles.shadow}60`
          : `0 4px 6px -1px rgba(0, 0, 0, 0.5)`,
        border: `1px solid ${rarityStyles.color}80`,
      }}
    >
      {/* Card Background with Gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: rarityStyles.bgGradient, opacity: 0.9 }}
      />

      {/* Holographic Shine for High Rarity */}
      {isHighRarity && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, transparent 30%)',
            backgroundSize: '200% 100%',
            animation: isHovered ? 'shine 1.5s infinite linear' : 'none',
          }}
        />
      )}

      {/* Content Container */}
      <div className="relative w-full h-full flex flex-col items-center p-2">
        <RarityGem rarity={unit.rarity} />

        {/* Unit Image */}
        <div className="flex-grow w-full flex items-center justify-center my-2 relative z-0">
          {!imageError ? (
            <img
              src={unit.image}
              alt={unit.name}
              className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
              style={{
                filter: isHovered
                  ? `drop-shadow(0 0 15px ${rarityStyles.shadow}) brightness(1.1)`
                  : `drop-shadow(0 0 5px rgba(0,0,0,0.5))`
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-6xl font-bold transform group-hover:scale-110 transition-transform duration-500"
              style={{
                color: rarityStyles.color,
                textShadow: `0 0 20px ${rarityStyles.shadow}`,
              }}
            >
              {getInitials(unit.name)}
            </div>
          )}
        </div>

        {/* Unit Info */}
        <div className="w-full mt-auto bg-black/60 backdrop-blur-sm p-2 rounded border-t border-white/10">
          <p className="font-pixel text-center text-white text-lg leading-none mb-1 truncate">{unit.name}</p>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: rarityStyles.color }} className="font-bold uppercase opacity-90">{unit.rarity}</span>
            <span className="text-accent-yellow font-pixel">{unit.cost}$</span>
          </div>
        </div>
      </div>

      {/* Border Glow on Hover */}
      <div
        className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
        style={{ borderColor: rarityStyles.color }}
      />

      <style>{`
        @keyframes shine {
          0% { background-position: 150% 0; }
          100% { background-position: -50% 0; }
        }
      `}</style>
    </Tag>
  );
};

export default UnitCard;
