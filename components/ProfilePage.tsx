import React, { useContext, useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UnitCard from './shared/UnitCard';
import { GameContext } from '../App';
import { BALANCE_ICON } from './constants';
import UnitDetailModal from './shared/UnitDetailModal';
import { Unit } from '../types';
import { ProfileIcon } from './shared/Icons';
import AchievementsList from './achievements/AchievementsList';
import StatsView from './StatsView';
import TransactionHistoryView from './TransactionHistoryView';
import { supabase } from '../lib/supabase';

type ProfileTab = 'inventory' | 'achievements' | 'stats' | 'history' | 'leaderboard';

const LeaderboardView: React.FC = () => {
    const game = useContext(GameContext);
    const [leaderboard, setLeaderboard] = useState<{ username: string | null, balance: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!supabase) {
                setError("Database connection not available.");
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('username, balance')
                .order('balance', { ascending: false })
                .limit(50); // Top 50 players

            if (error) {
                console.error("Error fetching leaderboard:", error);
                setError("Could not load leaderboard data.");
                setLeaderboard([]);
            } else {
                setLeaderboard(data);
                setError(null);
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-glow-cyan animate-pulse">Loading Leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark">
                <p className="text-glow-red">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
            <table className="stats-table w-full">
                <thead>
                    <tr>
                        <th className="w-16">Rank</th>
                        <th>Player</th>
                        <th className="text-right">Souls</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((player, index) => {
                        const isCurrentUser = player.username === game?.userProfile?.username;
                        return (
                            <tr key={index} className={isCurrentUser ? 'bg-yellow-800/50' : ''}>
                                <td className={`text-center font-bold ${isCurrentUser ? 'text-glow-yellow' : 'text-text-light'}`}>
                                    #{index + 1}
                                </td>
                                <td className={`${isCurrentUser ? 'text-glow-yellow' : 'text-text-light'}`}>
                                    @{player.username || 'unknown'}
                                </td>
                                <td className={`text-right font-pixel ${isCurrentUser ? 'text-glow-yellow' : 'text-accent-yellow'}`}>
                                    {player.balance.toLocaleString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


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
                      <div
                        key={`${unit.id}-${index}`}
                        className="animate-staggerIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <UnitCard
                          unit={unit}
                          onClick={() => openModal(unit)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-center py-10 px-4 bg-black/20 border-2 border-dashed border-border-dark animate-fadeIn">
                  <div>
                    <p className="text-text-dark font-pixel text-sm">Inventory is empty.</p>
                    <p className="text-text-dark/50 mt-2 text-sm">Win units in the Casino or buy on the Market!</p>
                  </div>
                </div>
              );
        case 'achievements':
            return <AchievementsList />;
        case 'leaderboard':
            return <LeaderboardView />;
        case 'stats':
            return game ? (
                <StatsView 
                    unitStats={game.unitStats}
                    totalSpins={game.totalSpins}
                    totalSpent={game.totalSpent}
                    totalEarned={game.totalEarned}
                />
            ) : null;
        case 'history':
            return <TransactionHistoryView />;
        default:
            return null;
    }
  }

  return (
    <>
      <div className="p-4 animate-fadeIn flex flex-col h-full">
        <div className="container-glow flex-grow flex flex-col p-6 min-h-0">
          <div className="flex-shrink-0 flex items-center gap-4 mb-6 pb-6 border-b-2 border-border-light">
            <div className="w-20 h-20 bg-black/50 border-2 border-border-light flex items-center justify-center">
              <ProfileIcon className="w-12 h-12 text-accent-green" />
            </div>
            <div>
              <h1 className="font-pixel text-3xl text-glow-green">
                {user?.username || 'Player Profile'}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <img src={BALANCE_ICON} alt="Souls" className="w-8 h-8" />
                <span className="font-pixel text-2xl text-glow-yellow">
                  {game?.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4 flex-shrink-0 flex-wrap">
            <TabButton label="Inventory" tabName="inventory" />
            <TabButton label="Achievements" tabName="achievements" />
            <TabButton label="Stats" tabName="stats" />
            <TabButton label="History" tabName="history" />
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