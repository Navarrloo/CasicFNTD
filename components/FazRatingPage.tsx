import React from 'react';
import { WikiView } from './WikiPage';

interface FazRatingPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const FAZ_RATING_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png';
const TOKEN_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4a/Currency_Token.png/50px-Currency_Token.png';
const SOUL_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/6/65/Currency_Soul.png/50px-Currency_Soul.png';
const SEASON_1_PRESENT_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a3/Present_Season_1.png/50px-Present_Season_1.png';

const obtainmentData = [
  { type: 'header', label: 'Permanent Methods' },
  { method: 'Completing a Night', amount: '2', limit: '10 per Day' },
  { method: 'Complete Game on Normal Mode', amount: '1500', limit: '1 per Game' },
  { method: 'Complete Game on Nightmare Mode', amount: '2000', limit: '1 per Game' },
  { method: 'Complete Wave 100 on Endless', amount: '750', limit: '1 per Game' },
  { method: 'Summoning 10 on the Banner', amount: '5', limit: '2 per Day' },
  { method: 'Summon a Banner Secret', amount: '100', limit: 'Single Time' },
  { method: 'Summon a Banner Nightmare', amount: '1500', limit: 'Single Time' },
  { method: 'Reach Max Level on a Unit', amount: '25', limit: '3 per Week' },
  { method: 'Evolve a Unit', amount: '5000', limit: '1 per Unique Evolution' },
  { method: 'Purchase Bi-Weekly Unit', amount: '2000', limit: '1 per 2 weeks' },
  { method: 'Unlock all Unit Slots', amount: '3000', limit: 'Single Time' },
  { method: 'Rolling an Enchantment', amount: '2', limit: '5 per Day' },
  { method: 'Roll an Enchantment lower than 1% Chance', amount: '1500', limit: 'Single Time' },
  { method: 'Complete Daily Quests', amount: '50', limit: '1 per Day' },
  { method: 'Complete Weekly Quests', amount: '200', limit: '1 per Week' },
  { method: 'Merchant Purchase', amount: '100', limit: 'Single Time' },
  { method: 'Unlock all Establishment Card Slots', amount: '3500', limit: 'Single Time' },
  { type: 'header', label: 'Seasonal Methods' },
  { method: 'Craft Seasonal Nightmare', amount: '500', limit: '5 per Season' },
  { method: 'Complete Seasonal Battlepass', amount: '1000', limit: '1 per Season' },
  { type: 'header', label: 'Event Methods' },
  { method: 'Obtain Event Nightmare', amount: '5000', limit: '1 per Unique Event Nightmare' },
  { method: 'Obtain Event Badge', amount: '5000', limit: '1 per Event' },
];

const unitSlotsData = [
  { slot: '5', requirement: '750' },
  { slot: '6', requirement: '10K' },
];

const milestonesData = [
    { milestone: '100', rewards: [{ icon: TOKEN_ICON, amount: '1000' }, { icon: SOUL_ICON, amount: '5' }] },
    { milestone: '250', rewards: [{ icon: TOKEN_ICON, amount: '1000' }, { icon: SOUL_ICON, amount: '10' }] },
    { milestone: '350', rewards: [{ icon: TOKEN_ICON, amount: '1500' }, { icon: SOUL_ICON, amount: '15' }, { icon: SEASON_1_PRESENT_ICON, amount: '2' }] },
    { milestone: '500', rewards: [{ icon: TOKEN_ICON, amount: '2000' }, { icon: SOUL_ICON, amount: '20' }, { icon: SEASON_1_PRESENT_ICON, amount: '3' }] },
    { milestone: '750', rewards: [{ icon: TOKEN_ICON, amount: '2000' }, { icon: SOUL_ICON, amount: '20' }, { icon: SEASON_1_PRESENT_ICON, amount: '5' }] },
    { milestone: '1000', rewards: [{ icon: TOKEN_ICON, amount: '3000' }, { icon: SOUL_ICON, amount: '20' }] },
    { milestone: '1250', rewards: [{ icon: TOKEN_ICON, amount: '3000' }, { icon: SOUL_ICON, amount: '25' }, { icon: SEASON_1_PRESENT_ICON, amount: '7' }] },
    { milestone: '1500', rewards: [{ icon: TOKEN_ICON, amount: '3500' }, { icon: SOUL_ICON, amount: '20' }, { icon: SEASON_1_PRESENT_ICON, amount: '10' }] },
    { milestone: '1750', rewards: [{ icon: TOKEN_ICON, amount: '4000' }, { icon: SOUL_ICON, amount: '25' }, { icon: SEASON_1_PRESENT_ICON, amount: '10' }] },
    { milestone: '2000', rewards: [{ icon: SOUL_ICON, amount: '25' }, { icon: SEASON_1_PRESENT_ICON, amount: '12' }] },
    { milestone: '2500', rewards: [{ icon: TOKEN_ICON, amount: '5000' }, { icon: SOUL_ICON, amount: '25' }, { icon: SEASON_1_PRESENT_ICON, amount: '15' }] },
    { milestone: '3500', rewards: [{ icon: TOKEN_ICON, amount: '5500' }, { icon: SEASON_1_PRESENT_ICON, amount: '15' }] },
    { milestone: '5000', rewards: [{ icon: TOKEN_ICON, amount: '6500' }, { icon: SOUL_ICON, amount: '30' }, { icon: SEASON_1_PRESENT_ICON, amount: '15' }] },
    { milestone: '7500', rewards: [{ icon: TOKEN_ICON, amount: '7000' }, { icon: SOUL_ICON, amount: '30' }, { icon: SEASON_1_PRESENT_ICON, amount: '15' }] },
    { milestone: '10K', rewards: [{ icon: SEASON_1_PRESENT_ICON, amount: '20' }] },
    { milestone: '15K', rewards: [{ icon: TOKEN_ICON, amount: '10K' }, { icon: SOUL_ICON, amount: '35' }, { icon: SEASON_1_PRESENT_ICON, amount: '20' }] },
    { milestone: '20K', rewards: [] },
    { milestone: '25K', rewards: [{ icon: TOKEN_ICON, amount: '10K' }, { icon: SOUL_ICON, amount: '40' }, { icon: SEASON_1_PRESENT_ICON, amount: '25' }] },
    { milestone: '30K', rewards: [{ icon: SOUL_ICON, amount: '45' }] },
    { milestone: '35K', rewards: [{ icon: TOKEN_ICON, amount: '15K' }, { icon: SOUL_ICON, amount: '50' }] },
    { milestone: '40K', rewards: [{ icon: TOKEN_ICON, amount: '17.5K' }, { icon: SOUL_ICON, amount: '55' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
    { milestone: '50K', rewards: [{ icon: SOUL_ICON, amount: '60' }] },
    { milestone: '60K', rewards: [{ icon: TOKEN_ICON, amount: '20K' }, { icon: SOUL_ICON, amount: '65' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
    { milestone: '70K', rewards: [{ icon: TOKEN_ICON, amount: '20K' }, { icon: SOUL_ICON, amount: '65' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
    { milestone: '80K', rewards: [{ icon: TOKEN_ICON, amount: '20K' }, { icon: SOUL_ICON, amount: '70' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
    { milestone: '90K', rewards: [{ icon: TOKEN_ICON, amount: '25K' }, { icon: SOUL_ICON, amount: '100' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
    { milestone: '100K', rewards: [] },
    { milestone: '150K', rewards: [{ icon: TOKEN_ICON, amount: '25K' }, { icon: SOUL_ICON, amount: '100' }, { icon: SEASON_1_PRESENT_ICON, amount: '30' }] },
];

const FazRatingDisplay: React.FC<{amount: string}> = ({amount}) => (
    <div className="flex items-center gap-1.5">
        <img src={FAZ_RATING_ICON} alt="Faz-Rating" className="w-5 h-5"/>
        <span className="font-pixel text-text-light">{amount}</span>
    </div>
);

const RewardDisplay: React.FC<{reward: {icon: string; amount: string}}> = ({reward}) => (
    <div className="flex items-center bg-black/30 px-2 py-1 border border-border-dark rounded-sm">
        <img src={reward.icon} alt="Reward" className="w-6 h-6 mr-2"/>
        <span className="font-pixel text-sm text-text-light">{reward.amount}</span>
    </div>
);

const linkableTerms: Record<string, WikiView> = {
    'Unit': 'units',
    'Units': 'units',
    'Night': 'coming_soon',
    'Game': 'coming_soon',
    'Games': 'coming_soon',
    'Summoning': 'coming_soon',
    'Secret': 'coming_soon',
    'Nightmare': 'coming_soon',
    'Evolution': 'coming_soon',
    'Evolutions': 'coming_soon',
    'Enchantment': 'enchantments',
    'Enchantments': 'enchantments',
    'Quests': 'quests',
    'Merchant': 'coming_soon',
    'Establishment Card': 'establishments',
    'Season': 'coming_soon',
    'Seasons': 'coming_soon',
    'Battlepass': 'coming_soon',
    'Event': 'coming_soon',
    'Events': 'coming_soon',
};

const TextWithLinks: React.FC<{ text: string; setView: (view: WikiView) => void }> = ({ text, setView }) => {
    const regex = new RegExp(`(${Object.keys(linkableTerms).join('|')})`, 'g');
    const parts = text.split(regex);
    
    return (
        <span>
            {parts.map((part, index) => {
                const view = linkableTerms[part];
                if (view) {
                    return (
                         <a 
                            key={index} 
                            onClick={(e) => { e.preventDefault(); setView(view); }} 
                            className="text-accent-green underline cursor-pointer hover:text-accent-yellow"
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};

const FazRatingPage: React.FC<FazRatingPageProps> = ({ setView, title }) => {
  return (
    <div className="container-glow p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
                {title}
            </h1>
            <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
        </div>
        
        <div className="overflow-y-auto pr-2 space-y-8 flex-grow min-h-0">
            
            {/* Obtainment Section */}
            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">Obtainment</h2>
                <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {obtainmentData.map((item, index) => {
                                if (item.type === 'header') {
                                    return (
                                        <tr key={index} className="bg-border-dark">
                                            <td colSpan={3} className="p-2 font-pixel text-accent-purple tracking-widest">{item.label}</td>
                                        </tr>
                                    )
                                }
                                return (
                                    <tr key={index}>
                                        <td className="p-2 text-text-light"><TextWithLinks text={item.method!} setView={setView} /></td>
                                        <td className="p-2"><FazRatingDisplay amount={item.amount!} /></td>
                                        <td className="p-2 text-text-dark">{item.limit}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* Unit Slots Section */}
            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">Unit Slots</h2>
                <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
                     <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Slot</th>
                                <th>Requirement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unitSlotsData.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2 text-text-light">{item.slot}</td>
                                    <td className="p-2"><FazRatingDisplay amount={item.requirement} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Milestones Section */}
            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">Milestones</h2>
                 <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Milestone</th>
                                <th>Rewards</th>
                            </tr>
                        </thead>
                        <tbody>
                           {milestonesData.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2"><FazRatingDisplay amount={item.milestone} /></td>
                                    <td className="p-2">
                                        <div className="flex flex-wrap gap-2">
                                            {item.rewards.length > 0 ? item.rewards.map((reward, rIndex) => (
                                                <RewardDisplay key={rIndex} reward={reward} />
                                            )) : <span className="text-text-dark">N/A</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default FazRatingPage;
