import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { BALANCE_ICON } from './constants';

interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly';
  requirement: number;
  reward: number;
  icon: string;
}

const DAILY_QUESTS: Quest[] = [
  { id: 'daily_spin_3', name: 'Lucky Spinner', description: 'Spin casino 3 times', type: 'daily', requirement: 3, reward: 50, icon: '🎰' },
  { id: 'daily_trade_1', name: 'First Deal', description: 'Buy or sell 1 unit', type: 'daily', requirement: 1, reward: 100, icon: '🛒' },
  { id: 'daily_wiki_3', name: 'Knowledge Seeker', description: 'Visit 3 wiki pages', type: 'daily', requirement: 3, reward: 25, icon: '📚' },
  { id: 'daily_collect_5', name: 'Collector', description: 'Win 5 units', type: 'daily', requirement: 5, reward: 150, icon: '📦' },
];

const WEEKLY_QUESTS: Quest[] = [
  { id: 'weekly_spin_20', name: 'Spin Master', description: 'Spin casino 20 times', type: 'weekly', requirement: 20, reward: 500, icon: '🎲' },
  { id: 'weekly_trade_10', name: 'Trader Pro', description: 'Complete 10 trades', type: 'weekly', requirement: 10, reward: 1000, icon: '💼' },
  { id: 'weekly_craft_3', name: 'Master Crafter', description: 'Craft 3 units', type: 'weekly', requirement: 3, reward: 750, icon: '⚒️' },
];

interface QuestProgress {
  [questId: string]: {
    progress: number;
    completed: boolean;
    claimed: boolean;
  };
}

const QuestsLivePage: React.FC = () => {
  const game = useContext(GameContext);
  const [questProgress, setQuestProgress] = useState<QuestProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, [game?.userProfile?.id]);

  const loadQuests = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('quest_progress, last_quest_reset')
      .eq('id', game.userProfile.id)
      .single();

    if (data) {
      // Check if quests need reset
      const today = new Date().toISOString().split('T')[0];
      const lastReset = data.last_quest_reset || '';
      
      if (lastReset !== today) {
        // Reset daily quests
        resetDailyQuests();
      } else {
        setQuestProgress(data.quest_progress || {});
      }
    }
    setLoading(false);
  };

  const resetDailyQuests = async () => {
    const newProgress: QuestProgress = {};
    [...DAILY_QUESTS, ...WEEKLY_QUESTS].forEach(q => {
      newProgress[q.id] = { progress: 0, completed: false, claimed: false };
    });

    const today = new Date().toISOString().split('T')[0];
    await supabase?.from('profiles')
      .update({
        quest_progress: newProgress,
        last_quest_reset: today
      })
      .eq('id', game!.userProfile!.id);

    setQuestProgress(newProgress);
  };

  const claimReward = async (quest: Quest) => {
    if (!game?.userProfile || !supabase) return;

    const progress = questProgress[quest.id];
    if (!progress || !progress.completed || progress.claimed) return;

    // Update quest as claimed
    const newProgress = {
      ...questProgress,
      [quest.id]: { ...progress, claimed: true }
    };

    await supabase.from('profiles')
      .update({ quest_progress: newProgress })
      .eq('id', game.userProfile.id);

    // Give reward
    await game.updateBalance(game.balance + quest.reward);
    setQuestProgress(newProgress);
    game.showToast(`Claimed ${quest.reward} souls!`, 'success');
  };

  const getProgress = (questId: string) => {
    return questProgress[questId] || { progress: 0, completed: false, claimed: false };
  };

  const renderQuest = (quest: Quest) => {
    const progress = getProgress(quest.id);
    const percentage = Math.min((progress.progress / quest.requirement) * 100, 100);

    return (
      <div key={quest.id} className="bg-black/30 border border-border-dark p-3 mb-2">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{quest.icon}</span>
              <h3 className="font-pixel text-sm text-glow-cyan">{quest.name}</h3>
            </div>
            <p className="text-xs text-text-dark">{quest.description}</p>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
            <span className="font-pixel text-accent-yellow">{quest.reward}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/50 h-4 mb-2 relative overflow-hidden border border-border-dark">
          <div
            className="h-full bg-gradient-to-r from-accent-green to-accent-cyan transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
          <p className="absolute inset-0 flex items-center justify-center text-xs font-pixel text-white">
            {progress.progress}/{quest.requirement}
          </p>
        </div>

        {/* Claim Button */}
        {progress.completed && !progress.claimed && (
          <button
            onClick={() => claimReward(quest)}
            className="btn btn-green w-full !py-1 !text-sm"
          >
            Claim Reward!
          </button>
        )}
        
        {progress.claimed && (
          <div className="text-center text-accent-green font-pixel text-sm">
            ✓ Completed
          </div>
        )}
      </div>
    );
  };

  if (!game) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-glow-cyan animate-pulse">Loading Quests...</p>
      </div>
    );
  }

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-yellow mb-4">📜 Quests</h1>

        <div className="flex-grow overflow-y-auto pr-2 min-h-0 space-y-4">
          {/* Daily Quests */}
          <div>
            <h2 className="font-pixel text-lg text-glow-green mb-2">⏰ Daily Quests</h2>
            {DAILY_QUESTS.map(renderQuest)}
          </div>

          {/* Weekly Quests */}
          <div>
            <h2 className="font-pixel text-lg text-glow-purple mb-2">📅 Weekly Quests</h2>
            {WEEKLY_QUESTS.map(renderQuest)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestsLivePage;

