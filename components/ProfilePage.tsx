import React, { useContext, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UnitCard from './shared/UnitCard';
import { GameContext } from '../App';
import { BALANCE_ICON } from './constants';
import UnitDetailModal from './shared/UnitDetailModal';
import { Unit } from '../types';
import AchievementsList from './achievements/AchievementsList';
import StatsView from './StatsView';
import TransactionHistoryView from './TransactionHistoryView';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, Avatar, Typography, Box, Tabs, Tab, Grid } from '@mui/material';
import { Person } from '@mui/icons-material';

type ProfileTab = 'inventory' | 'achievements' | 'stats' | 'history' | 'leaderboard';

const LeaderboardView: React.FC = () => {
    const game = useContext(GameContext);
    const [leaderboard, setLeaderboard] = useState<{ username: string | null, balance: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
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
                setLeaderboard(data as any);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: ProfileTab) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'inventory':
            return game && game.inventory.length > 0 ? (
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {game.inventory.map((unit, index) => (
                    <Grid item key={`${unit.id}-${index}`} xs={4} sm={3} md={2}>
                      <UnitCard
                        unit={unit}
                        onClick={() => openModal(unit)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6">Inventory is empty.</Typography>
                  <Typography variant="body2">Win units in the Casino or buy on the Market!</Typography>
                </Box>
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
      <Card sx={{ mb: 2 }}>
        <CardHeader
          avatar={
            <Avatar>
              <Person />
            </Avatar>
          }
          title={user?.username || 'Player Profile'}
          subheader={`Souls: ${game?.balance.toLocaleString()}`}
        />
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Inventory" value="inventory" />
          <Tab label="Achievements" value="achievements" />
          <Tab label="Stats" value="stats" />
          <Tab label="History" value="history" />
          <Tab label="Leaderboard" value="leaderboard" />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {renderContent()}
      </Box>
      <UnitDetailModal
        isOpen={!!selectedUnit}
        unit={selectedUnit}
        onClose={closeModal}
      />
    </>
  );
};

export default ProfilePage;
