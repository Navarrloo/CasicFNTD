import React from 'react';
import { WikiView } from './WikiPage';


interface EstablishmentsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const establishmentData = [
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a5/Establishment_Chocolate_Coin.png/100px-Establishment_Chocolate_Coin.png', name: 'Шоколадная Монета', rarity: 'Uncommon', bonus: { text: '+1.5% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/47/Establishment_Sale.png/100px-Establishment_Sale.png', name: 'Распродажа', rarity: 'Uncommon', bonus: { text: '+2% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a1/Establishment_Arcade.png/100px-Establishment_Arcade.png', name: 'Аркада', rarity: 'Rare', bonus: { text: '+2.5% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Aquatic' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/48/Establishment_T-Shirt.png/100px-Establishment_T-Shirt.png', name: 'Футболка', rarity: 'Rare', bonus: { text: '+3% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/36/Establishment_Ticket_Eater.png/100px-Establishment_Ticket_Eater.png', name: 'Пожиратель Билетов', rarity: 'Epic', bonus: { text: '+5% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8c/Establishment_Catalog.png/100px-Establishment_Catalog.png', name: 'Каталог', rarity: 'Epic', bonus: { text: '+5% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4f/Establishment_Paycheck.png/100px-Establishment_Paycheck.png', name: 'Зарплата', rarity: 'Mythic', bonus: { text: '+7.5% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Wood' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/bc/Establishment_Bonnie_and_Chica_Fight.png/100px-Establishment_Bonnie_and_Chica_Fight.png', name: 'Битва Бонни и Чики', rarity: 'Mythic', bonus: { text: '+7.5% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/bc/Establishment_Shhh.png/100px-Establishment_Shhh.png', name: 'Тссс', rarity: 'Mythic', bonus: { text: '+3% Душ', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/50/Establishment_In_the_Jar.png/100px-Establishment_In_the_Jar.png', name: 'В банке', rarity: 'Mythic', bonus: { text: '+2% Фаз-Рейтинга', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/7f/Establishment_Clover.png/100px-Establishment_Clover.png', name: 'Клевер', rarity: 'Mythic', bonus: { text: '+2% Удачи', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8c/Establishment_Fazbear_Mafia.png/100px-Establishment_Fazbear_Mafia.png', name: 'Фазбер Мафия', rarity: 'Secret', bonus: { text: '+10% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b1/Establishment_Crying_Helpy.png/100px-Establishment_Crying_Helpy.png', name: 'Плачущий Хелпи', rarity: 'Secret', bonus: { text: '+10% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/87/Establishment_Puppet_Souls.png/100px-Establishment_Puppet_Souls.png', name: 'Души Марионетки', rarity: 'Secret', bonus: { text: '+5% Душ', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/da/Establishment_Freddy_Fazboost.png/100px-Establishment_Freddy_Fazboost.png', name: 'Фредди Фазбуст', rarity: 'Secret', bonus: { text: '+5% Фаз-Рейтинга', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/9/91/Establishment_Peaceful_Luck.png/100px-Establishment_Peaceful_Luck.png', name: 'Мирная Удача', rarity: 'Secret', bonus: { text: '+4% Удачи', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Boo' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/37/Establishment_Scrooge_McHelpy.png/100px-Establishment_Scrooge_McHelpy.png', name: 'Скрудж МакХелпи', rarity: 'Nightmare', bonus: { text: '+12.5% Токенов', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Boo' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/5/56/Establishment_Pimptrap.png/100px-Establishment_Pimptrap.png', name: 'Пимптрап', rarity: 'Nightmare', bonus: { text: '+12.5% Скидка Торговца', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/4a/Currency_Token.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c1/Establishment_Springbonnie.png/100px-Establishment_Springbonnie.png', name: 'Спрингбонни', rarity: 'Nightmare', bonus: { text: '+8% Душ', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/65/Currency_Soul.png' }, artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/f4/Establishment_Foxy%27s_Throne.png/100px-Establishment_Foxy%27s_Throne.png', name: "Трон Фокси", rarity: 'Nightmare', bonus: { text: '+10% Фаз-Рейтинга', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' }, artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/9/90/Establishment_You_Won%21.png/100px-Establishment_You_Won%21.png', name: 'Вы Выиграли!', rarity: 'Nightmare', bonus: { text: '+5% Удачи', icon: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/ac/Potion_Luck.png/50px-Potion_Luck.png' }, artCredit: 'Boo' },
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
        <button onClick={() => setView('main')} className="btn btn-yellow">Назад</button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-8 flex-grow min-h-0">
        <div className="bg-black/20 p-4 border border-border-dark">
          <p className="text-text-light">
            Заведения — это одна из основных механик в игре. Они повышают различные характеристики при получении.
          </p>
        </div>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Получение</h2>
          <div className="bg-black/20 p-4 border border-border-dark space-y-4">
            <p className="text-text-light">
              Заведения можно получить через <b>Торговый Автомат</b> в Лобби. Каждое заведение имеет шанс выпадения в зависимости от редкости. Торговый Автомат обновляется каждый час с 6 новыми заведениями.
            </p>
            <div className="overflow-x-auto">
              <table className="stats-table">
                <thead>
                  <tr><th>Редкость</th><th>Шанс</th></tr>
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
          <h2 className="font-pixel text-xl text-glow-green mb-3">Список Заведений</h2>
          <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
            <table className="stats-table">
              <thead>
                <tr>
                  <th className="w-24">Изображение</th>
                  <th>Название</th>
                  <th>Редкость</th>
                  <th>Бонус</th>
                  <th>Автор Арта</th>
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
