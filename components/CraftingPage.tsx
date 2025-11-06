import React, { useState, useContext } from 'react';
import { GameContext } from '../App';
import { Unit, Rarity } from '../types';
import UnitCard from './shared/UnitCard';
import { BALANCE_ICON } from './constants';
import { SoundManager } from '../utils/sounds';

interface CraftingRecipe {
  name: string;
  description: string;
  required: { rarity: Rarity; count: number };
  result: Rarity;
  cost: number;
}

const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    name: 'Uncommon Fusion',
    description: '3 Common → 1 Uncommon',
    required: { rarity: Rarity.Common, count: 3 },
    result: Rarity.Uncommon,
    cost: 50,
  },
  {
    name: 'Rare Fusion',
    description: '3 Uncommon → 1 Rare',
    required: { rarity: Rarity.Uncommon, count: 3 },
    result: Rarity.Rare,
    cost: 100,
  },
  {
    name: 'Epic Fusion',
    description: '3 Rare → 1 Epic',
    required: { rarity: Rarity.Rare, count: 3 },
    result: Rarity.Epic,
    cost: 250,
  },
  {
    name: 'Mythic Fusion',
    description: '3 Epic → 1 Mythic',
    required: { rarity: Rarity.Epic, count: 3 },
    result: Rarity.Mythic,
    cost: 500,
  },
];

const CraftingPage: React.FC = () => {
  const game = useContext(GameContext);
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<{unit: Unit, index: number}[]>([]);
  const [craftedUnit, setCraftedUnit] = useState<Unit | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!game) return null;

  const getUnitsOfRarity = (rarity: Rarity) => {
    return game.inventory
      .map((unit, index) => ({ unit, index }))
      .filter(item => item.unit.rarity === rarity);
  };

  const canCraft = (recipe: CraftingRecipe): boolean => {
    const available = getUnitsOfRarity(recipe.required.rarity);
    return available.length >= recipe.required.count && game.balance >= recipe.cost;
  };

  const handleCraft = async () => {
    if (!selectedRecipe || selectedUnits.length < selectedRecipe.required.count) {
      game.showToast('Select required units!', 'error');
      return;
    }

    if (game.balance < selectedRecipe.cost) {
      game.showToast('Not enough souls!', 'error');
      return;
    }

    // Remove selected units
    for (let i = selectedUnits.length - 1; i >= 0; i--) {
      await game.removeFromInventory(selectedUnits[i].unit, selectedUnits[i].index - i);
    }

    // Pay cost
    await game.updateBalance(game.balance - selectedRecipe.cost);

    // Get random unit of result rarity
    const { UNITS } = await import('./constants');
    const possibleUnits = UNITS.filter(u => u.rarity === selectedRecipe.result);
    const newUnit = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];

    // Add to inventory
    await game.addToInventory(newUnit);
    
    // Unlock achievement
    game.unlockAchievement('crafter');
    
    SoundManager.play('success');
    setCraftedUnit(newUnit);
    setShowResult(true);
    setSelectedUnits([]);
    
    game.showToast(`Crafted ${newUnit.name}!`, 'success');
  };

  const toggleUnitSelection = (unitItem: {unit: Unit, index: number}) => {
    const isSelected = selectedUnits.some(s => s.index === unitItem.index);
    
    if (isSelected) {
      setSelectedUnits(selectedUnits.filter(s => s.index !== unitItem.index));
    } else {
      if (!selectedRecipe) return;
      if (selectedUnits.length >= selectedRecipe.required.count) {
        game.showToast(`Max ${selectedRecipe.required.count} units!`, 'error');
        return;
      }
      setSelectedUnits([...selectedUnits, unitItem]);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setCraftedUnit(null);
  };

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-purple mb-4">⚒️ Crafting Workshop</h1>

        {/* Recipes */}
        <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
          {CRAFTING_RECIPES.map((recipe, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedRecipe(recipe);
                setSelectedUnits([]);
              }}
              disabled={!canCraft(recipe)}
              className={`p-2 border text-left transition-all ${
                selectedRecipe?.name === recipe.name
                  ? 'border-accent-purple bg-accent-purple/20'
                  : 'border-border-dark'
              } ${!canCraft(recipe) ? 'opacity-50' : 'hover:border-accent-purple'}`}
            >
              <p className="font-pixel text-sm text-glow-green">{recipe.name}</p>
              <p className="text-xs text-text-dark mt-1">{recipe.description}</p>
              <div className="flex items-center gap-1 mt-2">
                <img src={BALANCE_ICON} alt="Souls" className="w-4 h-4" />
                <span className="text-xs text-accent-yellow">{recipe.cost}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selection Area */}
        {selectedRecipe && (
          <div className="flex-grow min-h-0 flex flex-col">
            <p className="text-sm text-text-light mb-2">
              Select {selectedRecipe.required.count} {selectedRecipe.required.rarity} units:
              <span className="text-accent-green ml-2">
                ({selectedUnits.length}/{selectedRecipe.required.count})
              </span>
            </p>
            
            <div className="flex-grow overflow-y-auto pr-2 min-h-0 bg-black/20 p-2 border border-border-dark">
              <div className="grid grid-cols-4 gap-2">
                {getUnitsOfRarity(selectedRecipe.required.rarity).map((item) => (
                  <div
                    key={item.index}
                    onClick={() => toggleUnitSelection(item)}
                    className={`cursor-pointer transition-all ${
                      selectedUnits.some(s => s.index === item.index)
                        ? 'ring-2 ring-accent-green scale-95'
                        : 'hover:scale-105'
                    }`}
                  >
                    <UnitCard unit={item.unit} />
                  </div>
                ))}
              </div>
              {getUnitsOfRarity(selectedRecipe.required.rarity).length === 0 && (
                <p className="text-center text-text-dark py-8">
                  No {selectedRecipe.required.rarity} units available
                </p>
              )}
            </div>

            <button
              onClick={handleCraft}
              disabled={selectedUnits.length < selectedRecipe.required.count || game.balance < selectedRecipe.cost}
              className="btn btn-green w-full mt-4"
            >
              Craft for {selectedRecipe.cost} souls
            </button>
          </div>
        )}

        {!selectedRecipe && (
          <div className="flex-grow flex items-center justify-center text-center">
            <p className="text-text-dark">Select a recipe to start crafting!</p>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResult && craftedUnit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="container-glow max-w-md p-6 text-center">
            <h2 className="font-pixel text-2xl text-glow-green mb-4">✨ Crafting Success!</h2>
            <div className="w-40 h-56 mx-auto mb-4">
              <UnitCard unit={craftedUnit} />
            </div>
            <p className="font-pixel text-xl mb-2">{craftedUnit.name}</p>
            <p className="text-text-dark text-sm mb-6">{craftedUnit.rarity}</p>
            <button onClick={closeResult} className="btn btn-green w-full">
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CraftingPage;

