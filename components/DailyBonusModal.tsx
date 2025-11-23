import React, { useEffect, useState } from 'react';
import { BALANCE_ICON } from './constants';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (amount: number) => void;
  streakDays: number;
  nextBonus: number;
}

const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  streakDays,
  nextBonus
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 2000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    setIsClaiming(true);
    onClaim(nextBonus);
    setTimeout(() => {
      setIsClaiming(false);
      onClose();
    }, 1000);
  };

  const getStreakMultiplier = (days: number): number => {
    if (days >= 7) return 3;
    if (days >= 3) return 2;
    return 1;
  };

  const multiplier = getStreakMultiplier(streakDays);
  const totalReward = nextBonus;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="relative p-6 text-center bg-background-dark border-2"
        style={{
          borderColor: streakDays >= 7 ? '#fcee63' : streakDays >= 3 ? '#b456f0' : '#32ff91',
          boxShadow: `0 0 30px ${streakDays >= 7 ? 'rgba(252, 238, 99, 0.5)' : streakDays >= 3 ? 'rgba(180, 86, 240, 0.5)' : 'rgba(50, 255, 145, 0.5)'}`
        }}
      >
        {showEffect && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-accent-yellow rounded-full animate-ping opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-accent-purple rounded-full animate-ping opacity-30" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        <div className="relative z-10">
          <h2 className="font-pixel text-3xl mb-2" style={{
            color: streakDays >= 7 ? '#fcee63' : streakDays >= 3 ? '#b456f0' : '#32ff91',
            textShadow: `0 0 10px ${streakDays >= 7 ? '#fcee63' : streakDays >= 3 ? '#b456f0' : '#32ff91'}`
          }}>
            ЕЖЕДНЕВНЫЙ БОНУС
          </h2>

          <div className="mb-4">
            <p className="text-text-light text-sm mb-2">Серия входов</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-pixel text-2xl text-glow-yellow">{streakDays}</span>
              <span className="text-text-dark">дней</span>
            </div>
          </div>

          <div className="bg-black/50 p-4 border border-border-dark mb-4">
            <p className="text-text-dark text-sm mb-2">Награда сегодня</p>
            <div className="flex items-center justify-center gap-3">
              <img src={BALANCE_ICON} alt="Souls" className="w-8 h-8" />
              <span className="font-pixel text-4xl text-glow-yellow">{totalReward}</span>
            </div>
            {multiplier > 1 && (
              <p className="text-accent-green text-sm mt-2">
                {multiplier}x Множитель активен!
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="btn btn-green flex-1"
            >
              {isClaiming ? 'Забираем...' : 'Забрать'}
            </button>
            <button
              onClick={onClose}
              className="btn btn-yellow"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyBonusModal;

