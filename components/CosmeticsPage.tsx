import React from 'react';

type WikiView = 'main' | 'cosmetics';

interface CosmeticsPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const bannerData = [
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/85/Banner_The_Wait_Is_Over.png/500px-Banner_The_Wait_Is_Over.png', name: 'The Wait Is Over', obtainment: 'Global Transfer Quests', artCredit: 'Aquatic & Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/17/Banner_The_Brick_Incident.png/500px-Banner_The_Brick_Incident.png', name: 'The Brick Incident', obtainment: 'Unit Salvage Transfer', artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/d3/Banner_The_Grand_Reopening.png/500px-Banner_The_Grand_Reopening.png', name: 'The Grand Reopening', obtainment: 'Game 1 Night 6 on Easy Mode', artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/dc/Banner_The_Night_Returns.png/500px-Banner_The_Night_Returns.png', name: 'The Night Returns', obtainment: 'Game 1 Night 6 on Nightmare Mode', artCredit: 'Virtuavizz & Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/ed/Banner_New_Dawn.png/500px-Banner_New_Dawn.png', name: 'New Dawn', obtainment: 'Game 2 Night 6 on Easy Mode', artCredit: 'Wood & Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/d/d2/Banner_Remnants_of_the_Past.png/500px-Banner_Remnants_of_the_Past.png', name: 'Remnants of the Past', obtainment: 'Game 2 Night 6 on Nightmare Mode', artCredit: 'Boo & Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/f2/Banner_Behind_The_Scenes.png/500px-Banner_Behind_The_Scenes.png', name: 'Behind the Scenes', obtainment: 'Code: SORRYFORDELAY', artCredit: 'Nogurt & Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/87/Banner_Bite_of_87.png/500px-Banner_Bite_of_87.png', name: 'Bite of 87', obtainment: '-', artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/88/Banner_VIP.png/500px-Banner_VIP.png', name: 'VIP', obtainment: 'Own VIP Gamepass', artCredit: 'Virtuavizz' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/4c/Banner_Shiny_Hunter.png/500px-Banner_Shiny_Hunter.png', name: 'Shiny Hunter', obtainment: 'Own Shiny Hunter Gamepass', artCredit: 'Virtuavizz' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/e2/Banner_ARG_1.png/500px-Banner_ARG_1.png', name: 'ARG 1', obtainment: 'Top 50 Completers for ARG 1 in FNTD 1', artCredit: 'Boo' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/3e/Banner_ARG_2.png/500px-Banner_ARG_2.png', name: 'ARG 2', obtainment: 'Top 50 Completers for ARG 2 in FNTD 1', artCredit: 'Soulty' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/1/12/Banner_Fools_Hunt.png/500px-Banner_Fools_Hunt.png', name: 'Fools Hunt', obtainment: 'Top 50 Completers for Fools Hunt in FNTD 1', artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/e3/Banner_North.png/500px-Banner_North.png', name: 'North', obtainment: 'Developer Special Banner', artCredit: 'Nogurt' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a7/Banner_Nogurt.png/500px-Banner_Nogurt.png', name: 'Nogurt', obtainment: 'Developer Special Banner', artCredit: 'North' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a3/Banner_Wood.png/500px-Banner_Wood.png', name: 'Wood', obtainment: 'Developer Special Banner', artCredit: 'Nameless' },
  { image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/38/Banner_Virtuavizz.png/500px-Banner_Virtuavizz.png', name: 'Virtuavizz', obtainment: 'Developer Special Banner', artCredit: 'Virtuavizz' },
];

const CosmeticsPage: React.FC<CosmeticsPageProps> = ({ setView, title }) => {
  return (
    <div className="container-glow p-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-pixel text-lg text-text-light tracking-widest text-glow-cyan">
          {title.toUpperCase()}
        </h1>
        <button onClick={() => setView('main')} className="btn btn-yellow">Back</button>
      </div>

      <div className="h-[75vh] overflow-y-auto pr-2 space-y-8">
        <div className="bg-black/20 p-4 border border-border-dark">
          <p className="text-text-light">
            Cosmetics are items that can be obtained to customize a Player's Profile or Units. There are three types of Cosmetics: Titles, Banners, and Skins.
          </p>
        </div>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Titles</h2>
           <div className="bg-black/20 p-4 border border-border-dark">
              <p className="text-text-dark">Information about Titles coming soon.</p>
            </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Banners</h2>
          <div className="overflow-x-auto bg-black/20 border-2 border-border-dark">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Obtainment</th>
                  <th>Art Credit</th>
                </tr>
              </thead>
              <tbody>
                {bannerData.map((item, index) => (
                  <tr key={index}>
                    <td className="p-1">
                      <img src={item.image} alt={item.name} className="w-48 h-auto bg-black/20 p-1 border border-border-dark" />
                    </td>
                    <td className="font-pixel text-text-light align-middle">{item.name}</td>
                    <td className="text-text-dark align-middle">{item.obtainment}</td>
                    <td className="text-text-dark align-middle">{item.artCredit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-pixel text-xl text-glow-green mb-3">Skins</h2>
            <div className="bg-black/20 p-4 border border-border-dark">
                <p className="text-text-dark">Information about Skins coming soon.</p>
            </div>
        </section>
      </div>
    </div>
  );
};

export default CosmeticsPage;
