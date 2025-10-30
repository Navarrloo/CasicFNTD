import React from 'react';

type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating' | 'enchantments' | 'establishments';

interface EstablishmentsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const establishmentData = [
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a5/Establishment_Chocolate_Coin.png/100px-Establishment_Chocolate_Coin.png', name: 'Chocolate Coin', rarity: 'Uncommon', bonus: { text: '+1.5% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/47/Establishment_Sale.png/100px-Establishment_Sale.png', name: 'Sale', rarity: 'Uncommon', bonus: { text: '+2% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a1/Establishment_Arcade.png/100px-Establishment_Arcade.png', name: 'Arcade', rarity: 'Rare', bonus: { text: '+2.5% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Aquatic' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/48/Establishment_T-Shirt.png/100px-Establishment_T-Shirt.png', name: 'T-Shirt', rarity: 'Rare', bonus: { text: '+3% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/36/Establishment_Ticket_Eater.png/100px-Establishment_Ticket_Eater.png', name: 'Ticket Eater', rarity: 'Epic', bonus: { text: '+5% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8c/Establishment_Catalog.png/100px-Establishment_Catalog.png', name: 'Catalog', rarity: 'Epic', bonus: { text: '+5% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4f/Establishment_Paycheck.png/100px-Establishment_Paycheck.png', name: 'Paycheck', rarity: 'Mythic', bonus: { text: '+7.5% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Wood' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/bc/Establishment_Bonnie_and_Chica_Fight.png/100px-Establishment_Bonnie_and_Chica_Fight.png', name: 'Bonnie and Chica Fight', rarity: 'Mythic', bonus: { text: '+7.5% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/bc/Establishment_Shhh.png/100px-Establishment_Shhh.png', name: 'Shhh', rarity: 'Mythic', bonus: { text: '+3% Souls', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/50/Establishment_In_the_Jar.png/100px-Establishment_In_the_Jar.png', name: 'In the Jar', rarity: 'Mythic', bonus: { text: '+2% Faz-Rating', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/7f/Establishment_Clover.png/100px-Establishment_Clover.png', name: 'Clover', rarity: 'Mythic', bonus: { text: '+2% Luck', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8c/Establishment_Fazbear_Mafia.png/100px-Establishment_Fazbear_Mafia.png', name: 'Fazbear Mafia', rarity: 'Secret', bonus: { text: '+10% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b1/Establishment_Crying_Helpy.png/100px-Establishment_Crying_Helpy.png', name: 'Crying Helpy', rarity: 'Secret', bonus: { text: '+10% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/87/Establishment_Puppet_Souls.png/100px-Establishment_Puppet_Souls.png', name: 'Puppet Souls', rarity: 'Secret', bonus: { text: '+5% Souls', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/da/Establishment_Freddy_Fazboost.png/100px-Establishment_Freddy_Fazboost.png', name: 'Freddy Fazboost', rarity: 'Secret', bonus: { text: '+5% Faz-Rating', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/9/91/Establishment_Peaceful_Luck.png/100px-Establishment_Peaceful_Luck.png', name: 'Peaceful Luck', rarity: 'Secret', bonus: { text: '+4% Luck', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Boo' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/37/Establishment_Scrooge_McHelpy.png/100px-Establishment_Scrooge_McHelpy.png', name: 'Scrooge McHelpy', rarity: 'Nightmare', bonus: { text: '+12.5% Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Boo' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/56/Establishment_Pimptrap.png/100px-Establishment_Pimptrap.png', name: 'Pimptrap', rarity: 'Nightmare', bonus: { text: '+12.5% Merchant Discount', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c1/Establishment_Springbonnie.png/100px-Establishment_Springbonnie.png', name: 'Springbonnie', rarity: 'Nightmare', bonus: { text: '+8% Souls', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/f4/Establishment_Foxy%27s_Throne.png/100px-Establishment_Foxy%27s_Throne.png', name: "Foxy's Throne", rarity: 'Nightmare', bonus: { text: '+10% Faz-Rating', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/9/90/Establishment_You_Won%21.png/100px-Establishment_You_Won%21.png', name: 'You Won!', rarity: 'Nightmare', bonus: { text: '+5% Luck', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Boo' },
];

const rarityChances = [
  { rarity: 'Uncommon', chance: 'N/A' },
  { rarity: 'Rare', chance: 'N/A' },
  { rarity: 'Epic', chance: 'N/A' },
  { rarity: 'Mythic', chance: 'N/A' },
  { rarity: 'Secret', chance: 'N/A' },
  { rarity: 'Nightmare', chance: 'N/A' },
];

const rarityColors: Record<string, string> = {
  'Uncommon': 'var(--accent-green)',
  'Rare': '#58a5fe',
  'Epic': 'var(--accent-purple)',
  'Mythic': 'var(--accent-yellow)',
  'Secret': 'var(--accent-red)',
  'Nightmare': '#492590',
};

const RarityDisplay: React.FC<{ rarity: string }> = ({ rarity }) => (
  <span className="font-pixel" style={{ color: rarityColors[rarity] || 'white' }}>
    {rarity}
  </span>
);

const BonusDisplay: React.FC<{ bonus: { text: string; icon: string } }> = ({ bonus }) => (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
        <img src={bonus.icon} alt="bonus icon" className="w-4 h-4" />
        <span className="font-pixel text-text-light text-sm">{bonus.text}</span>
    </div>
);


const EstablishmentsPage: React.FC<EstablishmentsPageProps> = ({ setView, title }) => {
  return (
    <div className="container-glow p-4 animate-fadeIn flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
          {title.toUpperCase()}
        </h1>
        <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-8 flex-grow min-h-0">
        <div className="bg-black/20 p-4 border border-border-dark">
          <p className="text-text-light">
            Establishments are one of the Main Mechanics in the game. They increase a variety of Stats when obtained.
          </p>
        </div>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Obtainment</h2>
          <div className="bg-black/20 p-4 border border-border-dark space-y-4">
             <p className="text-text-light">
                Establishments can be obtained through the <b>Vending Machine</b> found in the Lobby. Each Establishment has a chance to drop depending on its Rarity. The Vending Machine refreshes every hour with 6 new Establishments.
            </p>
            <div className="overflow-x-auto">
                <table className="stats-table">
                    <thead>
                        <tr><th>Rarity</th><th>Chance</th></tr>
                    </thead>
                    <tbody>
                        {rarityChances.map(item => (
                            <tr key={item.rarity}>
                                <td><RarityDisplay rarity={item.rarity} /></td>
                                <td className="text-text-dark">{item.chance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">List of Establishments</h2>
          <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="w-24">Image</th>
                  <th>Name</th>
                  <th>Rarity</th>
                  <th>Bonus</th>
                  <th>Art Credit</th>
                </tr>
              </thead>
              <tbody>
                {establishmentData.map((item, index) => (
                  <tr key={index}>
                    <td className="p-1">
                      <img src={item.image} alt={item.name} className="w-20 h-auto bg-black/20 p-1 border border-border-dark" />
                    </td>
                    <td className="font-pixel text-text-light">{item.name}</td>
                    <td><RarityDisplay rarity={item.rarity} /></td>
                    <td><BonusDisplay bonus={item.bonus} /></td>
                    <td className="text-text-dark">{item.artCredit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstablishmentsPage;