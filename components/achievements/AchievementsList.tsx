import React, { useContext } from 'react';
import { GameContext } from '../../App';
import { ACHIEVEMENTS } from '../../constants';

const AchievementsList: React.FC = () => {
    const game = useContext(GameContext);

    if (!game) return null;

    return (
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
            <div className="space-y-3">
                {ACHIEVEMENTS.map(achievement => {
                    const isUnlocked = game.achievements.includes(achievement.id);
                    return (
                        <div 
                            key={achievement.id}
                            className={`flex items-center gap-4 p-3 bg-black/30 border border-border-dark transition-all duration-300 ${isUnlocked ? 'border-accent-yellow' : 'opacity-50'}`}
                            style={{ boxShadow: isUnlocked ? '0 0 10px -2px var(--accent-yellow)' : 'none' }}
                        >
                            <div className={`text-4xl ${!isUnlocked ? 'grayscale' : ''}`}>
                                {achievement.icon}
                            </div>
                            <div className="flex-grow">
                                <h3 className={`font-pixel text-lg ${isUnlocked ? 'text-glow-yellow' : 'text-text-light'}`}>
                                    {achievement.name}
                                </h3>
                                <p className="text-sm text-text-dark">{achievement.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default AchievementsList;
