import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../App';
import { ACHIEVEMENTS, BALANCE_ICON } from '../constants';
import { supabase } from '../../lib/supabase';

const AchievementsList: React.FC = () => {
    const game = useContext(GameContext);
    const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

    useEffect(() => {
        loadClaimedRewards();
    }, [game?.userProfile?.id]);

    const loadClaimedRewards = async () => {
        if (!game?.userProfile || !supabase) return;

        const { data } = await supabase
            .from('profiles')
            .select('claimed_achievement_rewards')
            .eq('id', game.userProfile.id)
            .single();

        if (data?.claimed_achievement_rewards) {
            setClaimedRewards(data.claimed_achievement_rewards);
        }
    };

    const claimReward = async (achievementId: string, reward: number) => {
        if (!game?.userProfile || !supabase) return;

        const newClaimed = [...claimedRewards, achievementId];
        
        await supabase.from('profiles')
            .update({ claimed_achievement_rewards: newClaimed })
            .eq('id', game.userProfile.id);

        await game.updateBalance(game.balance + reward);
        setClaimedRewards(newClaimed);
        game.showToast(`Claimed ${reward} souls!`, 'success');
    };

    if (!game) return null;

    return (
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
            <div className="space-y-3">
                {ACHIEVEMENTS.map(achievement => {
                    const isUnlocked = game.achievements.includes(achievement.id);
                    const isClaimed = claimedRewards.includes(achievement.id);
                    const canClaim = isUnlocked && !isClaimed;

                    return (
                        <div 
                            key={achievement.id}
                            className={`p-3 bg-black/30 border border-border-dark transition-all duration-300 ${isUnlocked ? 'border-accent-yellow' : 'opacity-50'}`}
                            style={{ boxShadow: isUnlocked ? '0 0 10px -2px var(--accent-yellow)' : 'none' }}
                        >
                            <div className="flex items-center gap-4 mb-2">
                            <div className={`text-4xl ${!isUnlocked ? 'grayscale' : ''}`}>
                                {achievement.icon}
                            </div>
                            <div className="flex-grow">
                                <h3 className={`font-pixel text-lg ${isUnlocked ? 'text-glow-yellow' : 'text-text-light'}`}>
                                    {achievement.name}
                                </h3>
                                <p className="text-sm text-text-dark">{achievement.description}</p>
                            </div>
                                <div className="flex items-center gap-1">
                                    <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
                                    <span className="font-pixel text-accent-yellow">{achievement.reward}</span>
                                </div>
                            </div>

                            {canClaim && (
                                <button
                                    onClick={() => claimReward(achievement.id, achievement.reward)}
                                    className="btn btn-green w-full !py-1 !text-sm"
                                >
                                    Claim Reward!
                                </button>
                            )}

                            {isClaimed && (
                                <div className="text-center text-accent-green font-pixel text-sm">
                                    ✓ Reward Claimed
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default AchievementsList;