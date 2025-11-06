import React, { useState, useContext, useEffect } from 'react';
import { GameContext } from '../App';
import { supabase } from '../lib/supabase';
import { BALANCE_ICON } from './constants';

interface ReferralData {
  referralCode: string;
  referredUsers: string[];
  totalEarned: number;
}

const REFERRAL_REWARDS = [
  { count: 1, reward: 100, name: '1st Friend', icon: '🎁' },
  { count: 5, reward: 500, name: '5th Friend', icon: '🎊' },
  { count: 10, reward: 1500, name: '10th Friend', icon: '🏆' },
  { count: 25, reward: 5000, name: '25th Friend', icon: '👑' },
];

const ReferralPage: React.FC = () => {
  const game = useContext(GameContext);
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referredUsers: [],
    totalEarned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [game?.userProfile?.id]);

  const loadReferralData = async () => {
    if (!game?.userProfile || !supabase) return;

    const { data } = await supabase
      .from('profiles')
      .select('referral_code, referred_users, referral_earned')
      .eq('id', game.userProfile.id)
      .single();

    if (data) {
      setReferralData({
        referralCode: data.referral_code || generateReferralCode(),
        referredUsers: data.referred_users || [],
        totalEarned: data.referral_earned || 0,
      });

      // Create referral code if doesn't exist
      if (!data.referral_code) {
        const code = generateReferralCode();
        await supabase.from('profiles')
          .update({ referral_code: code })
          .eq('id', game.userProfile.id);
      }
    }
    setLoading(false);
  };

  const generateReferralCode = (): string => {
    return `FNAF${game?.userProfile?.id || Math.random().toString(36).substring(7)}`.toUpperCase();
  };

  const copyReferralLink = () => {
    const botUsername = 'YOUR_BOT_USERNAME'; // Replace with actual bot username
    const link = `https://t.me/${botUsername}?start=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    game?.showToast('Link copied!', 'success');
  };

  const getNextMilestone = () => {
    const count = referralData.referredUsers.length;
    return REFERRAL_REWARDS.find(r => r.count > count);
  };

  const nextMilestone = getNextMilestone();

  if (!game) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-glow-cyan animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-purple mb-4">👥 Referral Program</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 p-3 border border-border-dark text-center">
            <p className="text-xs text-text-dark mb-1">Friends Invited</p>
            <p className="font-pixel text-2xl text-glow-green">{referralData.referredUsers.length}</p>
          </div>
          <div className="bg-black/30 p-3 border border-border-dark text-center">
            <p className="text-xs text-text-dark mb-1">Total Earned</p>
            <div className="flex items-center justify-center gap-1">
              <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
              <p className="font-pixel text-xl text-glow-yellow">{referralData.totalEarned}</p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-black/50 border border-accent-purple p-4 mb-4">
          <p className="font-pixel text-sm text-accent-purple mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralData.referralCode}
              readOnly
              className="admin-input flex-grow text-center font-pixel text-2xl"
            />
            <button onClick={copyReferralLink} className="btn btn-green !py-2">
              Copy Link
            </button>
          </div>
          <p className="text-xs text-text-dark mt-2">Share this code with friends!</p>
        </div>

        {/* Rewards Progress */}
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
          <p className="font-pixel text-lg text-glow-cyan mb-2">🎁 Milestone Rewards</p>
          
          <div className="space-y-2">
            {REFERRAL_REWARDS.map((milestone) => {
              const achieved = referralData.referredUsers.length >= milestone.count;
              const isCurrent = nextMilestone?.count === milestone.count;

              return (
                <div
                  key={milestone.count}
                  className={`p-3 border transition-all ${
                    achieved
                      ? 'bg-accent-green/20 border-accent-green'
                      : isCurrent
                      ? 'bg-accent-yellow/10 border-accent-yellow'
                      : 'bg-black/30 border-border-dark opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{milestone.icon}</span>
                      <div>
                        <p className={`font-pixel text-sm ${achieved ? 'text-accent-green' : 'text-text-light'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-xs text-text-dark">Invite {milestone.count} friends</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5" />
                      <span className="font-pixel text-accent-yellow">{milestone.reward}</span>
                    </div>
                  </div>
                  
                  {achieved && (
                    <div className="mt-2 text-center text-accent-green font-pixel text-xs">
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-4 bg-black/20 p-3 border border-border-dark flex-shrink-0">
          <p className="font-pixel text-sm text-accent-purple mb-2">How it works:</p>
          <ul className="text-xs text-text-dark space-y-1 list-disc list-inside">
            <li>Share your referral code with friends</li>
            <li>Get 10% of their first 10 casino spins</li>
            <li>Unlock milestone rewards as you invite more</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;

