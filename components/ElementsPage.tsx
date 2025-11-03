import React from 'react';
import { WikiView } from './WikiPage';

interface ElementsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const elements = [
  { name: 'Neutral', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/ab/Element_Neutral.png' },
  { name: 'Light', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/07/Element_Light.png' },
  { name: 'Dark', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/e/e9/Element_Dark.png' },
  { name: 'Fire', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/d4/Element_Fire.png' },
  { name: 'Water', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/30/Element_Water.png' },
  { name: 'Electricity', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/2/23/Element_Electricity.png' },
  { name: 'Rust', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/d7/Element_Rust.png' },
];


const advantageData: { [attacker: string]: { [defender: string]: number } } = {
  'Light': { 'Dark': 1.3, 'Light': 0.85 },
  'Dark': { 'Light': 1.3, 'Dark': 0.85 },
  'Fire': { 'Water': 0.85, 'Rust': 1.3 },
  'Water': { 'Fire': 1.3, 'Electricity': 0.85 },
  'Electricity': { 'Water': 1.3, 'Rust': 0.85 },
  'Rust': { 'Fire': 0.85, 'Electricity': 1.3 },
};

const ElementHeader: React.FC<{ name: string }> = ({ name }) => (
    <div className="flex items-center justify-center h-full p-2">
        <span className="text-sm font-pixel text-accent-cyan uppercase">{name}</span>
    </div>
);

const MultiplierCell: React.FC<{ multiplier: number }> = ({ multiplier }) => {
    let bgColor = 'bg-transparent';
    let textColor = 'text-text-dark';

    if (multiplier > 1) {
        bgColor = 'bg-green-900/50';
        textColor = 'text-glow-green';
    } else if (multiplier < 1) {
        bgColor = 'bg-red-900/50';
        textColor = 'text-glow-red';
    }

    return (
        <td className={`p-2 text-center font-bold font-pixel text-base ${bgColor} ${textColor}`}>
            {multiplier}X
        </td>
    );
};

const ElementsPage: React.FC<ElementsPageProps> = ({ setView, title }) => {
  return (
    <div className="container-glow p-4 animate-fadeIn flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h1 className="font-pixel text-xl text-text-light tracking-widest text-glow-cyan">
                {title.toUpperCase()}
            </h1>
            <button onClick={() => setView('main')} className="btn btn-yellow !text-base !px-4 !py-1">Back</button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-6 flex-grow min-h-0">
            <div className="bg-black/20 p-4 border border-border-dark">
                <p className="text-text-light text-base">
                    Elements are a Unit Mechanic that allows for strategic gameplay between Units and Enemies.
                </p>
            </div>

            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">Elemental Advantages</h2>
                <div className="overflow-x-auto bg-black/30 border-2 border-border-dark p-1">
                    <table className="stats-table w-full">
                        <thead>
                            <tr>
                                <th className="!p-1 !bg-transparent w-[12.5%]">
                                    <div className="flex flex-col text-xs text-text-dark/80 font-normal">
                                        <span className="self-end pr-1">DEF →</span>
                                        <span className="self-start pl-1">ATK ↓</span>
                                    </div>
                                </th>
                                {elements.map(def => (
                                    <th key={def.name} className="w-[12.5%]"><ElementHeader name={def.name} /></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {elements.map(atk => (
                                <tr key={atk.name}>
                                    <th className="!p-0"><ElementHeader name={atk.name} /></th>
                                    {elements.map(def => {
                                        const multiplier = advantageData[atk.name]?.[def.name] || 1;
                                        return <MultiplierCell key={`${atk.name}-${def.name}`} multiplier={multiplier} />;
                                    })}
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

export default ElementsPage;
