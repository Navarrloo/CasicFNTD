import React from 'react';

// A type alias from WikiPage.tsx to avoid circular dependencies
type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating' | 'enchantments';

interface EnchantmentsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const enchantmentData = [
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/1e/Enchantment_Damage_I.png/75px-Enchantment_Damage_I.png', name: 'Damage I', modifiers: ['+5% Damage'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/0/05/Enchantment_Damage_II.png/75px-Enchantment_Damage_II.png', name: 'Damage II', modifiers: ['+10% Damage'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/17/Enchantment_Damage_III.png/75px-Enchantment_Damage_III.png', name: 'Damage III', modifiers: ['+15% Damage'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/7a/Enchantment_Range_I.png/75px-Enchantment_Range_I.png', name: 'Range I', modifiers: ['+5% Range'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/f9/Enchantment_Range_II.png/75px-Enchantment_Range_II.png', name: 'Range II', modifiers: ['+10% Range'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/2/27/Enchantment_Range_III.png/75px-Enchantment_Range_III.png', name: 'Range III', modifiers: ['+15% Range'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/dc/Enchantment_Speed_I.png/75px-Enchantment_Speed_I.png', name: 'Speed I', modifiers: ['-5% Cooldown'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/da/Enchantment_Speed_II.png/75px-Enchantment_Speed_II.png', name: 'Speed II', modifiers: ['-7.5% Cooldown'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/f2/Enchantment_Speed_III.png/75px-Enchantment_Speed_III.png', name: 'Speed III', modifiers: ['-12.5% Cooldown'], chance: '8.6%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ab/Enchantment_Engineer.png/75px-Enchantment_Engineer.png', name: 'Engineer', modifiers: ['+50% Experience'], chance: '10%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/57/Enchantment_Puppet_Nightmare.png/75px-Enchantment_Puppet_Nightmare.png', name: 'Puppet Nightmare', modifiers: ['+30% Range'], chance: '10%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/ef/Enchantment_Investor.png/75px-Enchantment_Investor.png', name: 'Investor', modifiers: ['+20% Income', '-10% Cost'], chance: '3%' },
  { icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/db/Enchantment_Haywire.png/75px-Enchantment_Haywire.png', name: 'Haywire', modifiers: ['-20% Cooldown'], chance: '2%' },
];

const ModifierDisplay: React.FC<{ modifier: string }> = ({ modifier }) => {
  let color = 'text-text-light';
  if (modifier.includes('Damage')) color = 'text-red-400';
  if (modifier.includes('Range')) color = 'text-blue-400';
  if (modifier.includes('Cooldown')) color = 'text-purple-400';
  if (modifier.includes('Income') || modifier.includes('Experience')) color = 'text-green-400';
  if (modifier.includes('Cost')) color = 'text-yellow-400';
  
  return <p className={color}>{modifier}</p>;
};

const EnchantmentsPage: React.FC<EnchantmentsPageProps> = ({ setView, title }) => {
  return (
    <div className="container-glow p-4 animate-fadeIn flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
                {title.toUpperCase()}
            </h1>
            <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
        </div>

        <div className="overflow-y-auto pr-2 space-y-6 flex-grow min-h-0">
            <div className="bg-black/20 p-4 border border-border-dark">
                <p className="text-text-light">
                    Enchantments are a Unit Mechanic found in the Unit Workshop that allow Units to gain bonuses in exchange for Souls.
                </p>
            </div>

            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">List of Enchantments</h2>
                <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Modifiers</th>
                                <th>Chance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enchantmentData.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <img src={item.icon} alt={item.name} className="w-12 h-12 bg-black/20 p-1 border border-border-dark" />
                                    </td>
                                    <td className="p-2 font-pixel text-text-light align-top pt-3">{item.name}</td>
                                    <td className="p-2 text-text-light align-top pt-3">
                                        {item.modifiers.map(mod => <ModifierDisplay key={mod} modifier={mod} />)}
                                    </td>
                                    <td className="p-2 text-accent-yellow align-top pt-3">{item.chance}</td>
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

export default EnchantmentsPage;