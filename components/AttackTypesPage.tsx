import React from 'react';

// A type alias from WikiPage.tsx
type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating' | 'enchantments' | 'elements' | 'attack_types';

interface AttackTypesPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const attackTypeData = [
  { name: 'Single Target', description: 'Units attack a single Enemy.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/a2/Attack_Type_Single_Target.png' },
  { name: 'Chain', description: 'This unit\'s attack jumps from one enemy to another in a chain.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/05/Attack_Type_Chain.png' },
  { name: 'Small Circle AoE', description: 'Units attack all enemies within a small radius from target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/1/1b/Attack_Type_Small_Circle_AoE.png' },
  { name: 'Medium Circle AoE', description: 'Units attack all enemies within a medium radius from target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/02/Attack_Type_Medium_Circle_AoE.png' },
  { name: 'Large Circle AoE', description: 'Units attack all enemies within a large radius from target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/3d/Attack_Type_Large_Circle_AoE.png' },
  { name: 'Small Line AoE', description: 'Units attack all enemies within a small line between them and the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/d4/Attack_Type_Small_Line_AoE.png' },
  { name: 'Medium Line AoE', description: 'Units attack all enemies within a medium line between them and the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/9/94/Attack_Type_Medium_Line_AoE.png' },
  { name: 'Large Line AoE', description: 'This unit attacks all enemies caught in a large, straight line.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/7/7b/Attack_Type_Large_Line_AoE.png' },
  { name: 'Small Cone AoE', description: 'Units attack all enemies within a 0-45 degree arc between them and the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/d1/Attack_Type_Small_Cone_AoE.png' },
  { name: 'Medium Cone AoE', description: 'Units attack all enemies within a 45-90 degree arc between them and the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/7/77/Attack_Type_Medium_Cone_AoE.png' },
  { name: 'Large Cone AoE', description: 'Units attack all enemies within a 90-180 degree arc between them and the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/0e/Attack_Type_Large_Cone_AoE.png' },
  { name: 'Full AoE', description: 'Units attack all enemies within a 360 degree circle in their Range.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/5/52/Attack_Type_Full_AoE.png' },
  { name: 'Circle to Cone AoE', description: 'Units attack all enemies with a radius from the target and create a cone attack from the target.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/7/7f/Attack_Type_Circle_to_Cone_AoE.png' },
  { name: 'Support', description: 'Unit is unable to attack.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/7/73/Attack_Type_Support.png' },
  { name: 'Summoner', description: 'Unit is unable to attack, but summons an entity on the map.', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Attack_Type_Summoner.png' },
];


const AttackTypesPage: React.FC<AttackTypesPageProps> = ({ setView, title }) => {
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
                    Attack Types are classifiers on how Units attack. There are currently 15 Attack Types.
                </p>
            </div>

            <div>
                <h2 className="font-pixel text-xl text-glow-green mb-3">List of Attack Types</h2>
                <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th className="w-24">Icon</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attackTypeData.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-1 align-middle">
                                        <img src={item.icon} alt={item.name} className="w-16 h-16 bg-black/20 p-1 border border-border-dark mx-auto" />
                                    </td>
                                    <td className="p-2 font-pixel text-glow-purple align-middle">{item.name}</td>
                                    <td className="p-2 text-text-light align-middle">
                                        {item.description}
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

export default AttackTypesPage;