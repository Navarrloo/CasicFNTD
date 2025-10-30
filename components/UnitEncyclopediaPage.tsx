import React, { useState } from 'react';
import { Unit, Rarity } from '../types';
import UnitDetailModal from './UnitDetailModal';
import { UNITS } from '../constants';


type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating';

interface UnitEncyclopediaPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const rarities = {
  [Rarity.Common]: { text: 'Common', colors: ["#d1d5db", "#9ca3af"] },
  [Rarity.Uncommon]: { text: 'Uncommon', colors: ["#32ff91", "#32ff91"] },
  [Rarity.Rare]: { text: 'Rare', colors: ["#58a5fe", "#58a5fe"] },
  [Rarity.Epic]: { text: 'Epic', colors: ["#b456f0", "#b456f0"] },
  [Rarity.Mythic]: { text: 'Mythic', colors: ["#fcee63", "#fcee63"] },
  [Rarity.Secret]: { text: 'Secret', colors: ["#ff3232", "#ff3232"] },
  [Rarity.Nightmare]: { text: 'Nightmare', colors: ["#6366f1", "#6366f1"] },
  [Rarity.Hero]: { text: 'Hero', colors: ["#fde047", "#fde047"] },
  [Rarity.Legendary]: { text: 'Legendary', colors: ["#f97316", "#f97316"]},
};

const RarityTag: React.FC<{ rarityKey: Rarity }> = ({ rarityKey }) => {
  const rarity = rarities[rarityKey];
  if (!rarity) return null;
  return (
    <span style={{ color: rarity.colors[0], textShadow: `0 0 5px ${rarity.colors[1]}`}} className="font-bold">
      {rarity.text}
    </span>
  );
};

const UnitWikiCard: React.FC<{ unit: Unit; onClick: () => void }> = ({ unit, onClick }) => {
    const rarity = rarities[unit.rarity];
    if (!rarity) return null;
    return (
        <button onClick={onClick} className="flex flex-col items-center text-center gap-2 group focus:outline-none">
            <div className="relative aspect-square bg-black/30 p-2 border w-full transition-all duration-200 group-hover:scale-105 group-hover:bg-black/50" style={{ borderColor: rarity.colors[0], boxShadow: `0 0 8px -2px ${rarity.colors[1]}` }}>
                <img src={unit.image} alt={unit.name} className="w-full h-full object-contain" />
            </div>
            <p className="font-pixel text-xs h-8 transition-colors duration-200 group-hover:text-yellow-300" style={{ color: rarity.colors[0] }}>{unit.name}</p>
        </button>
    );
};


const UnitEncyclopediaPage: React.FC<UnitEncyclopediaPageProps> = ({ setView, title }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openModal = (unit: Unit) => setSelectedUnit(unit);
  const closeModal = () => setSelectedUnit(null);

  return (
    <>
        <div className="container-glow p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
                    {title}
                </h1>
                <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
            </div>
            
            <div className="h-[75vh] overflow-y-auto pr-2 space-y-6">
                <div className="bg-black/20 p-4 border border-border-dark">
                    <p className="text-text-light">
                        Units are the main Mechanic of the game. There are currently 9 Rarities of Units: <RarityTag rarityKey={Rarity.Common} />, <RarityTag rarityKey={Rarity.Uncommon} />, <RarityTag rarityKey={Rarity.Rare} />, <RarityTag rarityKey={Rarity.Epic} />, <RarityTag rarityKey={Rarity.Mythic} />, <RarityTag rarityKey={Rarity.Secret} />, <RarityTag rarityKey={Rarity.Nightmare} />, <RarityTag rarityKey={Rarity.Hero} />, and <RarityTag rarityKey={Rarity.Legendary} />.
                    </p>
                </div>
                
                <div>
                    <h2 className="font-pixel text-xl text-glow-green mb-3">Obtainability</h2>
                    <div className="bg-black/20 p-4 border border-border-dark">
                        <p className="text-text-light">
                            Units are obtained through <a onClick={(e) => { e.preventDefault(); setView('coming_soon');}} className="text-accent-green underline cursor-pointer hover:text-accent-yellow">Summoning</a>.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="font-pixel text-xl text-glow-green mb-3">List of Units</h2>
                    <div className="bg-black/20 p-4 border border-border-dark">
                        <h3 className="font-pixel text-lg text-glow-purple mb-4 tracking-widest">Season 1</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {UNITS.map((unit) => (
                                <UnitWikiCard key={unit.id} unit={unit} onClick={() => openModal(unit)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <UnitDetailModal 
            isOpen={!!selectedUnit}
            unit={selectedUnit}
            onClose={closeModal}
        />
    </>
  );
};

export default UnitEncyclopediaPage;