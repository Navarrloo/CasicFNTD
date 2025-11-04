import React, { useContext, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UnitCard from './shared/UnitCard';
import { GameContext } from '../App';
import { BALANCE_ICON } from '../constants';
import UnitDetailModal from './shared/UnitDetailModal';
import { Unit } from '../types';
import { ProfileIcon } from './shared/Icons';
import AchievementsList from './achievements/AchievementsList';

type ProfileTab = 'inventory' | 'achievements' | 'leaderboard';

const ProfilePage: React.FC = () => {
  const { user } = useTelegram();
  const game = useContext(GameContext);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('inventory');

  const openModal = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const closeModal = () => {
    setSelectedUnit(null);
  };
  
  const TabButton: React.FC<{label: string, tabName: ProfileTab}> = ({ label, tabName }) => (
      <button 
        onClick={() => setActiveTab(tabName)}
        className={`stats-tab ${activeTab === tabName ? 'active' : ''}`}
      >
        {label}
      </button>
  );

  const renderContent = () => {
    switch(activeTab) {
        case 'inventory':
            return game && game.inventory.length > 0 ? (
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
                    <p className="text-text-dark/50 mt-2 text-sm">Win units in the Casino or buy on the Market!</p>
                  </div>
                </div>
              );
        case 'achievements':
            return <AchievementsList />;
        case 'leaderboard':
            return (
                <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
                  <div>
                      <p className="text-text-dark font-pixel text-sm">Leaderboard Coming Soon!</p>
                  </div>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <>
      <div className="p-2 animate-fadeIn flex flex-col h-full">
        <div className="container-glow flex-grow flex flex-col p-4">
          <div className="flex-shrink-0 flex items-center gap-4 mb-4 pb-4 border-b-2 border-border-dark">
            <div className="w-20 h-20 bg-black/50 border-2 border-border-light flex items-center justify-center">
              <ProfileIcon className="w-12 h-12 text-accent-green" />
            </div>
            <div>
              <h1 className="font-pixel text-2xl text-glow-green">
                {user?.username || 'Player Profile'}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6" />
                <span className="font-pixel text-xl text-glow-yellow">
                  {game?.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4 flex-shrink-0">
            <TabButton label="Inventory" tabName="inventory" />
            <TabButton label="Achievements" tabName="achievements" />
            <TabButton label="Leaderboard" tabName="leaderboard" />
          </div>

          {renderContent()}
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