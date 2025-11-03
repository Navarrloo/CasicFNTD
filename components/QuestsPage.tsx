import React, { useState } from 'react';
import { WikiView } from './WikiPage';

type QuestTab = 'daily' | 'weekly' | 'special';

interface QuestsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

interface Reward {
    name: string;
    amount: string;
    icon: string;
}

interface Quest {
    name: string;
    tasks: string;
    rewards: Reward[];
}

const TOKEN_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4a/Currency_Token.png/50px-Currency_Token.png';
const SOUL_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/6/65/Currency_Soul.png/50px-Currency_Soul.png';
const PIZZA_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/df/Food_Pizza.png/50px-Food_Pizza.png';
const CUPCAKE_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/dc/Food_Cupcake.png/50px-Food_Cupcake.png';
const OIL_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/58/Food_Oil.png/50px-Food_Oil.png';
const SODA_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/3f/Food_Soda.png/50px-Food_Soda.png';
const GOLDEN_FREDDY_PRESENT_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a8/Present_Golden_Freddy.png/50px-Present_Golden_Freddy.png';
const PUPPET_PRESENT_ICON = 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/11/Present_Puppet.png/50px-Present_Puppet.png';


const dailyQuests: Quest[] = [
    { name: 'Night Veteran', tasks: 'Complete 2 Nights', rewards: [{ name: 'Souls', amount: '2', icon: SOUL_ICON }, { name: 'Pizza', amount: '3', icon: PIZZA_ICON }] },
    { name: 'Night Conqueror', tasks: 'Beat Game 1 Night 2', rewards: [{ name: 'Tokens', amount: '200', icon: TOKEN_ICON }] },
    { name: 'Wave Grinder', tasks: 'Complete 20 Waves in Game 1 Night 3!', rewards: [{ name: 'Tokens', amount: '250', icon: TOKEN_ICON }, { name: 'Souls', amount: '3', icon: SOUL_ICON }] },
    { name: 'Difficulty Master', tasks: 'Beat Game 2 Night 3', rewards: [{ name: 'Tokens', amount: '200', icon: TOKEN_ICON }, { name: 'Souls', amount: '2', icon: SOUL_ICON }] },
    { name: 'Squad Player', tasks: 'Complete a Night with 4 Players', rewards: [{ name: 'Tokens', amount: '500', icon: TOKEN_ICON }, { name: 'Souls', amount: '5', icon: SOUL_ICON }] },
    { name: 'Endless Challenger', tasks: 'Reach Wave 50 in Endless Normal Mode!', rewards: [{ name: 'Souls', amount: '5', icon: SOUL_ICON }, { name: 'Cupcake', amount: '5', icon: CUPCAKE_ICON }] },
    { name: 'Boss Slayer', tasks: 'Defeat 5 Bosses', rewards: [{ name: 'Tokens', amount: '300', icon: TOKEN_ICON }, { name: 'Souls', amount: '3', icon: SOUL_ICON }] },
    { name: 'Mythic Hunter', tasks: 'Summon a Mythic Unit', rewards: [{ name: 'Souls', amount: '5', icon: SOUL_ICON }] },
    { name: 'Shiny Collector', tasks: 'Obtain a Shiny Unit', rewards: [{ name: 'Tokens', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Unit Seller', tasks: 'Sell 5 Units', rewards: [{ name: 'Tokens', amount: '250', icon: TOKEN_ICON }, { name: 'Souls', amount: '2', icon: SOUL_ICON }] },
    { name: 'Enchanter', tasks: 'Roll 5 Enchantments', rewards: [{ name: 'Tokens', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Reroll Expert', tasks: 'Roll 10 Enchantments', rewards: [{ name: 'Tokens', amount: '500', icon: TOKEN_ICON }] },
    { name: 'Present Unwrapper', tasks: 'Open 5 Uncommon Presents', rewards: [{ name: 'Tokens', amount: '100', icon: TOKEN_ICON }, { name: 'Souls', amount: '2', icon: SOUL_ICON }] },
    { name: 'Merchant Buyer', tasks: 'Make 3 Merchant Purchases', rewards: [{ name: 'Tokens', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Big Spender', tasks: 'Spend 10K Tokens', rewards: [{ name: 'Souls', amount: '10', icon: SOUL_ICON }, { name: 'Oil', amount: '5', icon: OIL_ICON }] },
    { name: 'Marathon Gamer', tasks: 'Play for 2 Hours', rewards: [{ name: 'Tokens', amount: '450', icon: TOKEN_ICON }, { name: 'Souls', amount: '5', icon: SOUL_ICON }, { name: 'Soda', amount: '5', icon: SODA_ICON }] },
    { name: 'Battle Pass Grinder', tasks: 'Level up Battlepass twice', rewards: [{ name: 'Tokens', amount: '300', icon: TOKEN_ICON }, { name: 'Souls', amount: '2', icon: SOUL_ICON }] },
];

const weeklyQuests: Quest[] = [
    { name: 'Night Master', tasks: 'Complete 30 Nights', rewards: [{ name: 'Souls', amount: '20', icon: SOUL_ICON }, { name: 'Pizza', amount: '25', icon: PIZZA_ICON }] },
    { name: 'Shiny Master', tasks: 'Obtain 12 Shiny Units', rewards: [{ name: 'Tokens', amount: '2500', icon: TOKEN_ICON }] },
    { name: 'Reroll Master', tasks: 'Roll 100 Enchantments', rewards: [{ name: 'Tokens', amount: '3000', icon: TOKEN_ICON }] },
    { name: 'Avid Merchant Go-er', tasks: 'Make 45 Merchant Purchases', rewards: [{ name: 'Tokens', amount: '2000', icon: TOKEN_ICON }, { name: 'Souls', amount: '15', icon: SOUL_ICON }] },
];

const specialQuests: Quest[] = [
    { name: 'Golden Freddy', tasks: 'Beat Game 1 Night 6\nReach Wave 50 in Game 1 Endless\nObtain 3 Mythic Units or 1 Secret Unit', rewards: [{ name: 'Golden Freddy', amount: '1', icon: GOLDEN_FREDDY_PRESENT_ICON }] },
    { name: 'Puppet', tasks: 'Reach 2500 Faz-Rating\nObtain 3 Shiny Units\nReach Level 60 on 3 Units\nBeat Game 2 Night 6\nObtain all 4 Withered Units\nReach Wave 50 in Game 2 Endless with Withered Units\nEnchant Withered Units 250 Times', rewards: [{ name: 'Puppet', amount: '1', icon: PUPPET_PRESENT_ICON }] },
];


const RewardDisplay: React.FC<{reward: Reward}> = ({reward}) => (
    <div className="flex items-center bg-black/30 px-2 py-1 border border-border-dark rounded-sm">
        <img src={reward.icon} alt={reward.name} className="w-6 h-6 mr-2"/>
        <span className="font-pixel text-sm text-text-light">{reward.amount}</span>
    </div>
);

const linkableTerms: Record<string, WikiView> = {
    'Units': 'units', 'Unit': 'units',
    'Enchantments': 'enchantments',
    'Night': 'coming_soon', 'Nights': 'coming_soon',
    'Summon': 'coming_soon',
    'Merchant': 'coming_soon',
    'Battlepass': 'coming_soon',
    'Withered Units': 'units',
    'Faz-Rating': 'faz_rating',
};

const TextWithLinks: React.FC<{ text: string; setView: (view: WikiView) => void }> = ({ text, setView }) => {
    const regex = new RegExp(`(${Object.keys(linkableTerms).join('|')})`, 'g');
    const parts = text.split(regex);
    
    return (
        <span className="whitespace-pre-line">
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


const QuestTable: React.FC<{ quests: Quest[]; setView: (view: WikiView) => void }> = ({ quests, setView }) => (
    <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
        <table className="stats-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Tasks</th>
                    <th>Rewards</th>
                </tr>
            </thead>
            <tbody>
                {quests.map((quest, index) => (
                    <tr key={index}>
                        <td className="p-2 font-pixel text-glow-purple align-top pt-3">{quest.name}</td>
                        <td className="p-2 text-text-light align-top pt-3">
                            <TextWithLinks text={quest.tasks} setView={setView} />
                        </td>
                        <td className="p-2 align-top pt-3">
                            <div className="flex flex-wrap gap-2">
                                {quest.rewards.map((reward, rIndex) => (
                                    <RewardDisplay key={rIndex} reward={reward} />
                                ))}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const QuestsPage: React.FC<QuestsPageProps> = ({ setView, title }) => {
    const [activeTab, setActiveTab] = useState<QuestTab>('daily');

    const renderContent = () => {
        switch(activeTab) {
            case 'daily': return <QuestTable quests={dailyQuests} setView={setView} />;
            case 'weekly': return <QuestTable quests={weeklyQuests} setView={setView} />;
            case 'special': return <QuestTable quests={specialQuests} setView={setView} />;
            default: return null;
        }
    }

    return (
        <div className="container-glow p-4 animate-fadeIn flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
                    {title.toUpperCase()}
                </h1>
                <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-6 flex-grow min-h-0">
                <div className="bg-black/20 p-4 border border-border-dark">
                    <p className="text-text-light">
                        Quests are missions Players can complete to earn Rewards. There are 3 types of Quests: Daily, Weekly, and Special.
                    </p>
                </div>

                <div>
                    <div className="flex gap-2 mb-3">
                        <button onClick={() => setActiveTab('daily')} className={`stats-tab ${activeTab === 'daily' ? 'active' : ''}`}>Daily</button>
                        <button onClick={() => setActiveTab('weekly')} className={`stats-tab ${activeTab === 'weekly' ? 'active' : ''}`}>Weekly</button>
                        <button onClick={() => setActiveTab('special')} className={`stats-tab ${activeTab === 'special' ? 'active' : ''}`}>Special</button>
                    </div>
                    <div className="animate-fadeIn">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestsPage;
