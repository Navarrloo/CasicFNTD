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
    { name: 'Ветеран Ночи', tasks: 'Прожить 2 ночи', rewards: [{ name: 'Души', amount: '2', icon: SOUL_ICON }, { name: 'Пицца', amount: '3', icon: PIZZA_ICON }] },
    { name: 'Завоеватель Ночи', tasks: 'Пройти Игру 1 Ночь 2', rewards: [{ name: 'Токены', amount: '200', icon: TOKEN_ICON }] },
    { name: 'Гриндер Волн', tasks: 'Прожить 20 волн в Игре 1 Ночь 3!', rewards: [{ name: 'Токены', amount: '250', icon: TOKEN_ICON }, { name: 'Души', amount: '3', icon: SOUL_ICON }] },
    { name: 'Мастер Сложности', tasks: 'Пройти Игру 2 Ночь 3', rewards: [{ name: 'Токены', amount: '200', icon: TOKEN_ICON }, { name: 'Души', amount: '2', icon: SOUL_ICON }] },
    { name: 'Командный Игрок', tasks: 'Прожить ночь с 4 игроками', rewards: [{ name: 'Токены', amount: '500', icon: TOKEN_ICON }, { name: 'Души', amount: '5', icon: SOUL_ICON }] },
    { name: 'Бесконечный Претендент', tasks: 'Достичь 50 волны в Бесконечном Нормальном режиме!', rewards: [{ name: 'Души', amount: '5', icon: SOUL_ICON }, { name: 'Кекс', amount: '5', icon: CUPCAKE_ICON }] },
    { name: 'Убийца Боссов', tasks: 'Победить 5 боссов', rewards: [{ name: 'Токены', amount: '300', icon: TOKEN_ICON }, { name: 'Души', amount: '3', icon: SOUL_ICON }] },
    { name: 'Охотник на Мификов', tasks: 'Призвать Мифического юнита', rewards: [{ name: 'Души', amount: '5', icon: SOUL_ICON }] },
    { name: 'Коллекционер Шайни', tasks: 'Получить Шайни юнита', rewards: [{ name: 'Токены', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Продавец Юнитов', tasks: 'Продать 5 юнитов', rewards: [{ name: 'Токены', amount: '250', icon: TOKEN_ICON }, { name: 'Души', amount: '2', icon: SOUL_ICON }] },
    { name: 'Зачарователь', tasks: 'Сделать 5 зачарований', rewards: [{ name: 'Токены', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Эксперт Реролла', tasks: 'Сделать 10 зачарований', rewards: [{ name: 'Токены', amount: '500', icon: TOKEN_ICON }] },
    { name: 'Открыватель Подарков', tasks: 'Открыть 5 Необычных подарков', rewards: [{ name: 'Токены', amount: '100', icon: TOKEN_ICON }, { name: 'Души', amount: '2', icon: SOUL_ICON }] },
    { name: 'Покупатель у Торговца', tasks: 'Совершить 3 покупки у Торговца', rewards: [{ name: 'Токены', amount: '250', icon: TOKEN_ICON }] },
    { name: 'Транжира', tasks: 'Потратить 10К Токенов', rewards: [{ name: 'Души', amount: '10', icon: SOUL_ICON }, { name: 'Масло', amount: '5', icon: OIL_ICON }] },
    { name: 'Марафонец', tasks: 'Играть 2 часа', rewards: [{ name: 'Токены', amount: '450', icon: TOKEN_ICON }, { name: 'Души', amount: '5', icon: SOUL_ICON }, { name: 'Сода', amount: '5', icon: SODA_ICON }] },
    { name: 'Гриндер БП', tasks: 'Поднять уровень БП дважды', rewards: [{ name: 'Токены', amount: '300', icon: TOKEN_ICON }, { name: 'Души', amount: '2', icon: SOUL_ICON }] },
];

const weeklyQuests: Quest[] = [
    { name: 'Мастер Ночи', tasks: 'Прожить 30 ночей', rewards: [{ name: 'Души', amount: '20', icon: SOUL_ICON }, { name: 'Пицца', amount: '25', icon: PIZZA_ICON }] },
    { name: 'Мастер Шайни', tasks: 'Получить 12 Шайни юнитов', rewards: [{ name: 'Токены', amount: '2500', icon: TOKEN_ICON }] },
    { name: 'Мастер Реролла', tasks: 'Сделать 100 зачарований', rewards: [{ name: 'Токены', amount: '3000', icon: TOKEN_ICON }] },
    { name: 'Заядлый Покупатель', tasks: 'Совершить 45 покупок у Торговца', rewards: [{ name: 'Токены', amount: '2000', icon: TOKEN_ICON }, { name: 'Души', amount: '15', icon: SOUL_ICON }] },
];

const specialQuests: Quest[] = [
    { name: 'Золотой Фредди', tasks: 'Пройти Игру 1 Ночь 6\nДостичь 50 волны в Игре 1 Бесконечно\nПолучить 3 Мифических юнита или 1 Секретного', rewards: [{ name: 'Золотой Фредди', amount: '1', icon: GOLDEN_FREDDY_PRESENT_ICON }] },
    { name: 'Марионетка', tasks: 'Достичь 2500 Фаз-Рейтинга\nПолучить 3 Шайни юнита\nДостичь 60 уровня на 3 юнитах\nПройти Игру 2 Ночь 6\nПолучить всех 4 Withered юнитов\nДостичь 50 волны в Игре 2 Бесконечно с Withered юнитами\nЗачаровать Withered юнитов 250 раз', rewards: [{ name: 'Марионетка', amount: '1', icon: PUPPET_PRESENT_ICON }] },
];


const RewardDisplay: React.FC<{ reward: Reward }> = ({ reward }) => (
    <div className="flex items-center bg-black/30 px-2 py-1 border border-border-dark rounded-sm">
        <img src={reward.icon} alt={reward.name} className="w-6 h-6 mr-2" />
        <span className="font-pixel text-sm text-text-light">{reward.amount}</span>
    </div>
);

const linkableTerms: Record<string, WikiView> = {
    'Юниты': 'units', 'Юнит': 'units',
    'Зачарования': 'enchantments',
    'Ночь': 'coming_soon', 'Ночи': 'coming_soon',
    'Призыв': 'coming_soon',
    'Торговец': 'coming_soon',
    'БП': 'coming_soon',
    'Withered Юниты': 'units',
    'Фаз-Рейтинг': 'faz_rating',
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
                    <th>Название</th>
                    <th>Задачи</th>
                    <th>Награды</th>
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
        switch (activeTab) {
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
                <button onClick={() => setView('main')} className="btn btn-yellow">Назад</button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-6 flex-grow min-h-0">
                <div className="bg-black/20 p-4 border border-border-dark">
                    <p className="text-text-light">
                        Квесты — это миссии, которые игроки могут выполнять для получения наград. Существует 3 типа квестов: Ежедневные, Еженедельные и Специальные.
                    </p>
                </div>

                <div>
                    <div className="flex gap-2 mb-3">
                        <button onClick={() => setActiveTab('daily')} className={`stats-tab ${activeTab === 'daily' ? 'active' : ''}`}>Ежедневные</button>
                        <button onClick={() => setActiveTab('weekly')} className={`stats-tab ${activeTab === 'weekly' ? 'active' : ''}`}>Еженедельные</button>
                        <button onClick={() => setActiveTab('special')} className={`stats-tab ${activeTab === 'special' ? 'active' : ''}`}>Специальные</button>
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
