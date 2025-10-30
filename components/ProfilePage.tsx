import React, { useContext, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UnitCard from './UnitCard';
import { GameContext } from '../App';
import { BALANCE_ICON } from '../constants';
import UnitDetailModal from './UnitDetailModal';
import { Unit } from '../types';
import { ProfileIcon } from './icons/Icons';

const ProfilePage: React.FC = () => {
  const { user } = useTelegram();
  const game = useContext(GameContext);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openModal = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const closeModal = () => {
    setSelectedUnit(null);
  };

  return (
    <>
      <div className="p-2 animate-fadeIn h-full flex flex-col">
        <div className="container-glow flex flex-col flex-grow">
          {/* Profile Header */}
          <div className="flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 p-2 border-b-2 border-border-dark">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-black/30 mr-4 border-2 border-border-light flex items-center justify-center p-1">
                        <ProfileIcon className="w-12 h-12 text-accent-cyan" />
                    </div>
                    <div>
                        <p className="font-pixel text-2xl text-glow-cyan">{user?.first_name || 'Guest'}</p>
                        <p className="text-base text-text-dark">@{user?.username || 'unknown'}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center bg-black/30 p-2 border-2 border-border-light">
                    <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6 mr-3"/>
                    <p className="font-pixel text-3xl text-glow-yellow">{game?.balance.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="font-pixel text-lg text-text-light">Inventory ({game?.inventory.length})</h1>
            </div>
          </div>

          {/* Inventory Section */}
          {game && game.inventory.length > 0 ? (
            <div className="flex-grow overflow-y-auto pr-2 min-h-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {game.inventory.map((unit, index) => (
                  <UnitCard
                    key={`${unit.id}-${index}`}
                    unit={unit}
                    onClick={() => openModal(unit)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
              <div>
                <p className="text-text-dark font-pixel text-sm">Inventory is empty.</p>
                <p className="text-text-dark/50 mt-2 text-sm">Win units in the Casino!</p>
              </div>
            </div>
          )}
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

export default ProfilePage;