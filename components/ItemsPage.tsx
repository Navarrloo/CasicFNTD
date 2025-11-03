import React from 'react';
import { WikiView } from './WikiPage';

interface ItemsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

interface Item {
    name: string;
    icon: string;
}

const itemData = {
    currency: [
        { name: 'Tokens', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4a/Currency_Token.png/50px-Currency_Token.png' },
        { name: 'Souls', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/6/65/Currency_Soul.png/50px-Currency_Soul.png' },
    ],
    tickets: [
        { name: 'VIP', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/7d/Ticket_VIP.png/50px-Ticket_VIP.png' },
        { name: 'Premium Pass', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b7/Ticket_Premium_Pass.png/50px-Ticket_Premium_Pass.png' },
        { name: 'Shiny Hunter', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/be/Ticket_Shiny_Hunter.png/50px-Ticket_Shiny_Hunter.png' },
        { name: 'Quick Open', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a8/Ticket_Quick_Open.png/50px-Ticket_Quick_Open.png' },
    ],
    food: [
        { name: 'Candy Bar', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/15/Food_Candy_Bar.png/50px-Food_Candy_Bar.png' },
        { name: 'Soda', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/3f/Food_Soda.png/50px-Food_Soda.png' },
        { name: 'Pizza', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/df/Food_Pizza.png/50px-Food_Pizza.png' },
        { name: 'Wings', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/0/02/Food_Wings.png/50px-Food_Wings.png' },
        { name: 'Cupcake', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/dc/Food_Cupcake.png/50px-Food_Cupcake.png' },
        { name: 'Oil', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/58/Food_Oil.png/50px-Food_Oil.png' },
        { name: 'Birthday Cake', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/77/Food_Birthday_Cake.png/50px-Food_Birthday_Cake.png' },
        { name: 'Chocolate Freddy', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/e7/Food_Chocolate_Freddy.png/50px-Food_Chocolate_Freddy.png' },
    ],
    materials: [
        { name: 'Battery', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/7a/Material_Battery.png/50px-Material_Battery.png' },
        { name: 'Plush', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/3c/Material_Plush.png/50px-Material_Plush.png' },
        { name: 'Spring', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ae/Material_Spring.png/50px-Material_Spring.png' },
        { name: 'Television', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c7/Material_Television.png/50px-Material_Television.png' },
    ],
    presentsRarity: [
        { name: 'Uncommon', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c6/Present_Uncommon.png/50px-Present_Uncommon.png' },
        { name: 'Rare', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/15/Present_Rare.png/50px-Present_Rare.png' },
        { name: 'Epic', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8c/Present_Epic.png/50px-Present_Epic.png' },
        { name: 'Mythic', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4f/Present_Mythic.png/50px-Present_Mythic.png' },
    ],
    presentsSeasonal: [
        { name: 'Season 1', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a3/Present_Season_1.png/50px-Present_Season_1.png' },
    ],
    presentsUnit: [
        { name: 'Golden Freddy', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a8/Present_Golden_Freddy.png/50px-Present_Golden_Freddy.png' },
        { name: 'Puppet', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/11/Present_Puppet.png/50px-Present_Puppet.png' },
        { name: 'Mangle', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/57/Present_Mangle.png/50px-Present_Mangle.png' },
        { name: 'Party Packer Cupcake', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/87/Present_Party_Packer_Cupcake.png/50px-Present_Party_Packer_Cupcake.png' },
        { name: 'Party Glock Freddy', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ad/Present_Party_Glock_Freddy.png/50px-Present_Party_Glock_Freddy.png' },
        { name: 'Balloon Boy', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/ba/Present_Balloon_Boy.png/50px-Present_Balloon_Boy.png' },
        { name: 'Shadow Bonnie', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8b/Present_Shadow_Bonnie.png/50px-Present_Shadow_Bonnie.png' },
    ]
};

const ItemCard: React.FC<{ item: Item }> = ({ item }) => (
    <div className="flex flex-col items-center text-center gap-1.5 group">
        <div className="relative aspect-square bg-black/30 p-2 border border-border-dark w-full transition-all duration-200 group-hover:scale-105 group-hover:bg-black/50 group-hover:border-accent-cyan">
            <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
        </div>
        <p className="font-pixel text-xs text-text-dark h-8 transition-colors duration-200 group-hover:text-accent-cyan">{item.name}</p>
    </div>
);


const ItemsPage: React.FC<ItemsPageProps> = ({ setView, title }) => {
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
            Items are a core part of the FNTD 2 experience, used for progression, summoning, and enhancing units.
          </p>
        </div>

        {/* Categories */}
        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Currency</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.currency.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Tickets</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.tickets.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Food</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.food.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Materials</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.materials.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Presents</h2>
           <h3 className="font-pixel text-lg text-glow-purple mb-3 mt-4">By Rarity</h3>
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.presentsRarity.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
           <h3 className="font-pixel text-lg text-glow-purple mb-3 mt-4">Seasonal</h3>
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.presentsSeasonal.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
           <h3 className="font-pixel text-lg text-glow-purple mb-3 mt-4">By Unit</h3>
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {itemData.presentsUnit.map(item => <ItemCard key={item.name} item={item} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemsPage;
