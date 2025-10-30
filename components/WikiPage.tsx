import React from 'react';
import FazRatingPage from './FazRatingPage';
import UnitEncyclopediaPage from './UnitEncyclopediaPage';
import EnchantmentsPage from './EnchantmentsPage';
import ElementsPage from './ElementsPage'; 
import AttackTypesPage from './AttackTypesPage';
import QuestsPage from './QuestsPage';
import ItemsPage from './ItemsPage';
import EstablishmentsPage from './EstablishmentsPage';
import CosmeticsPage from './CosmeticsPage';

type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating' | 'enchantments' | 'elements' | 'attack_types' | 'quests' | 'items' | 'establishments' | 'cosmetics';

interface WikiButtonProps {
  label: string;
  imageUrl: string;
  onClick: () => void;
}

const WikiButton: React.FC<WikiButtonProps> = ({ label, imageUrl, onClick }) => (
  <button onClick={onClick} className="wiki-button">
    <img src={imageUrl} alt={label} />
    <span>{label}</span>
    <span className="chevron text-accent-cyan">{'>'}</span>
  </button>
);

const wikiNav = {
  units: [
    { label: 'Units', view: 'units' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/e/ef/Button_Units.png' },
    { label: 'Elements', view: 'elements' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/c4/Button_Elements.png' },
    { label: 'Attack Types', view: 'attack_types' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/a8/Button_Attack_Types.png' },
    { label: 'Enchantments', view: 'enchantments' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png'},
  ],
  other: [
    { label: 'Faz-Rating', view: 'faz_rating' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' },
    { label: 'Items', view: 'items' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/af/Button_Items.png' },
    { label: 'Quests', view: 'quests' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/5/53/Button_Quests.png' },
    { label: 'Establishments', view: 'establishments' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/ac/Button_Establishments.png' },
    { label: 'Cosmetics', view: 'cosmetics' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/d1/Button_Cosmetics.png' },
  ],
  wikiContent: [
     { label: 'Guidelines', view: 'coming_soon' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/de/Button_Guidelines.png' },
     { label: 'Staff', view: 'coming_soon' as WikiView, imageUrl: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/02/Button_Staff.png' },
  ]
};

const ComingSoonView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="container-glow h-full flex flex-col items-center justify-center">
    <h1 className="font-pixel text-3xl text-glow-yellow mb-4">COMING SOON</h1>
    <p className="text-text-dark text-center mb-8">This section is under construction.</p>
    <button onClick={onBack} className="btn btn-yellow">Back to Wiki</button>
  </div>
);

const WikiMenuView: React.FC<{ setView: (view: WikiView) => void }> = ({ setView }) => (
  <div className="container-glow p-4">
      <h1 className="font-pixel text-2xl text-glow-cyan tracking-widest text-center mb-6 border-b border-accent-cyan/20 pb-4">FNTD 2 WIKI</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-pixel text-lg text-glow-green mb-3">Units & Mechanics</h2>
          <div className="flex flex-col gap-2">
            {wikiNav.units.map(item => (
              <WikiButton key={item.label} {...item} onClick={() => setView(item.view)} />
            ))}
          </div>
        </div>

        <div>
            <h2 className="font-pixel text-lg text-glow-yellow mb-3">Game Content</h2>
            <div className="flex flex-col gap-2">
                {wikiNav.other.map(item => (
                <WikiButton key={item.label} {...item} onClick={() => setView(item.view)} />
                ))}
            </div>
        </div>

        <div>
            <h2 className="font-pixel text-lg text-glow-purple mb-3">Community</h2>
            <div className="flex flex-col gap-2">
                {wikiNav.wikiContent.map(item => (
                <WikiButton key={item.label} {...item} onClick={() => setView(item.view)} />
                ))}
            </div>
        </div>
      </div>
  </div>
);


const WikiPage: React.FC = () => {
  const [view, setView] = React.useState<WikiView>('main');

  const renderContent = () => {
    switch(view) {
      case 'units':
        return <UnitEncyclopediaPage setView={setView} title="Unit Encyclopedia" />;
      case 'elements':
        return <ElementsPage setView={setView} title="Elements" />;
      case 'attack_types':
        return <AttackTypesPage setView={setView} title="Attack Types" />;
      case 'enchantments':
        return <EnchantmentsPage setView={setView} title="Enchantments" />;
      case 'quests':
        return <QuestsPage setView={setView} title="Quests" />;
      case 'items':
        return <ItemsPage setView={setView} title="Items" />;
      case 'establishments':
        return <EstablishmentsPage setView={setView} title="Establishments" />;
      case 'cosmetics':
        return <CosmeticsPage setView={setView} title="Cosmetics" />;
      case 'coming_soon':
        return <ComingSoonView onBack={() => setView('main')} />;
      case 'faz_rating':
        return <FazRatingPage setView={setView} title="FAZ-RATING PROGRESSION" />;
      case 'main':
      default:
        return <WikiMenuView setView={setView} />;
    }
  }

  return (
    <div className="animate-fadeIn h-full">
       {renderContent()}
    </div>
  );
};

export default WikiPage;
