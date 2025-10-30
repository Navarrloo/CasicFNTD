import { Unit, Rarity } from './types';

export const ADMIN_USERNAMES = ['NAVARRLO', 'AVE4GE'];
export const CASINO_COST = 1;
export const STARTING_BALANCE = 1000;
export const BALANCE_ICON = 'https://images.weserv.nl/?url=files.catbox.moe/dbovxg.webp';

// --- DETAILED UNIT DATA ---
export interface UnitStatLevel {
  level: number;
  cost: number;
  damage: number | string;
  range: number;
  cooldown: number;
  attackType?: string;
}

export interface UnitPassive {
  name: string;
  description: string;
}

export interface UnitHistory {
  date: string;
  change: string;
}

export interface UnitDetails {
  id: number;
  passives: UnitPassive[];
  stats: {
    regular: UnitStatLevel[];
    shiny: UnitStatLevel[];
  };
  history?: UnitHistory[];
}

export const UNIT_DETAILS: Record<number, UnitDetails> = {
  7: {
    id: 7,
    passives: [
      {
        name: 'Stolen Batteries',
        description: 'Balloon Boy applies +2% Range for all Units in Range, increasing by 2% per Upgrade.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 400, damage: 0, range: 15, cooldown: 0, attackType: '[Support]' },
        { level: 2, cost: 450, damage: 0, range: 15, cooldown: 0 },
        { level: 3, cost: 650, damage: 0, range: 16, cooldown: 0 },
        { level: 4, cost: 850, damage: 0, range: 17, cooldown: 0 },
        { level: 5, cost: 1050, damage: 0, range: 18, cooldown: 0 },
      ],
      shiny: [
        { level: 1, cost: 400, damage: 0, range: 15, cooldown: 0, attackType: '[Support]' },
        { level: 2, cost: 450, damage: 0, range: 15, cooldown: 0 },
        { level: 3, cost: 650, damage: 0, range: 16, cooldown: 0 },
        { level: 4, cost: 850, damage: 0, range: 17, cooldown: 0 },
        { level: 5, cost: 1050, damage: 0, range: 18, cooldown: 0 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  101: {
    id: 101,
    passives: [
      {
        name: 'Mic Toss',
        description: 'Every 5 attacks, Freddy throws his microphone applying [Bleed] for 1s, dealing 10% Damage.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 250, damage: 35, range: 20, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 350, damage: 40, range: 22.5, cooldown: 2.5 },
        { level: 3, cost: 450, damage: 45, range: 25, cooldown: 2 },
        { level: 4, cost: 600, damage: 50, range: 27.5, cooldown: 2 },
      ],
      shiny: [
        { level: 1, cost: 250, damage: '38.5', range: 20, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 350, damage: 44, range: 22.5, cooldown: 2.5 },
        { level: 3, cost: 450, damage: '49.5', range: 25, cooldown: 2 },
        { level: 4, cost: 600, damage: 55, range: 27.5, cooldown: 2 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  102: {
    id: 102,
    passives: [
      {
        name: 'Specialty Cupcake',
        description: "Every 5 attacks, Chica's cupcake will apply [Burn] for 1s, dealing 10% Damage."
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 300, damage: 25, range: 15, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 500, damage: 30, range: 18, cooldown: 2 },
        { level: 3, cost: 900, damage: 30, range: 22, cooldown: 1.5 },
        { level: 4, cost: 1350, damage: 35, range: 25, cooldown: 1.5 },
      ],
      shiny: [
        { level: 1, cost: 300, damage: '27.5', range: 15, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 500, damage: 33, range: 18, cooldown: 2 },
        { level: 3, cost: 900, damage: 33, range: 22, cooldown: 1.5 },
        { level: 4, cost: 1350, damage: '38.5', range: 25, cooldown: 1.5 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  103: {
    id: 103,
    passives: [
      {
        name: 'Strum',
        description: "Every 5 attacks, Bonnie strums his guitar applying [Stun] for 0.1s."
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 275, damage: 30, range: 17.5, cooldown: 2.5, attackType: '[Cone AoE]' },
        { level: 2, cost: 450, damage: 35, range: 20, cooldown: 2.5 },
        { level: 3, cost: 750, damage: 40, range: 22.5, cooldown: 2 },
        { level: 4, cost: 1250, damage: 40, range: 25, cooldown: 1.5 },
      ],
      shiny: [
        { level: 1, cost: 275, damage: 33, range: 17.5, cooldown: 2.5, attackType: '[Cone AoE]' },
        { level: 2, cost: 450, damage: '38.5', range: 20, cooldown: 2.5 },
        { level: 3, cost: 750, damage: 44, range: 22.5, cooldown: 2 },
        { level: 4, cost: 1250, damage: 44, range: 25, cooldown: 1.5 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  104: {
    id: 104,
    passives: [
      {
        name: 'Right Hook',
        description: "Foxy performs a follow-up attack with 25% Damage every 6th attack."
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 350, damage: 25, range: 10, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 500, damage: 30, range: 11, cooldown: 2 },
        { level: 3, cost: 800, damage: 30, range: 13, cooldown: 1.5 },
        { level: 4, cost: 1200, damage: 35, range: 15, cooldown: 1.5 },
      ],
      shiny: [
        { level: 1, cost: 350, damage: '27.5', range: 10, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 500, damage: 33, range: 11, cooldown: 2 },
        { level: 3, cost: 800, damage: 33, range: 13, cooldown: 1.5 },
        { level: 4, cost: 1200, damage: '38.5', range: 15, cooldown: 1.5 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  105: {
    id: 105,
    passives: [
      {
        name: 'Megalomaniac',
        description: "JJ obtains +0.1% Range for every Enemy killed within her Range [10% Maximum]."
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 500, damage: 35, range: 20, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 750, damage: 40, range: 22, cooldown: 2 },
        { level: 3, cost: 900, damage: 50, range: 25, cooldown: 1.5 },
        { level: 4, cost: 1400, damage: 60, range: 28, cooldown: 1.5 },
      ],
      shiny: [
        { level: 1, cost: 500, damage: '38.5', range: 20, cooldown: 2, attackType: '[Line AoE]' },
        { level: 2, cost: 750, damage: 44, range: 22, cooldown: 2 },
        { level: 3, cost: 900, damage: 55, range: 25, cooldown: 1.5 },
        { level: 4, cost: 1400, damage: 66, range: 28, cooldown: 1.5 },
      ]
    },
     history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  106: {
    id: 106,
    passives: [
      {
        name: 'Paper Cuts',
        description: 'Paper Pals applies [Bleed] for 1s, dealing 5% Damage.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 475, damage: 50, range: 24, cooldown: 3, attackType: '[Circle AoE]' },
        { level: 2, cost: 650, damage: 50, range: 26, cooldown: 2.5 },
        { level: 3, cost: 900, damage: 55, range: 28, cooldown: 2.5 },
        { level: 4, cost: 1250, damage: 65, range: 30, cooldown: 2 },
      ],
      shiny: [
        { level: 1, cost: 475, damage: 55, range: 24, cooldown: 3, attackType: '[Circle AoE]' },
        { level: 2, cost: 650, damage: 55, range: 26, cooldown: 2.5 },
        { level: 3, cost: 900, damage: '60.5', range: 28, cooldown: 2.5 },
        { level: 4, cost: 1250, damage: '71.5', range: 30, cooldown: 2 },
      ]
    },
     history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  107: {
    id: 107,
    passives: [
      {
        name: 'Faz-Shotgun',
        description: 'Toy Freddy’s Damage scales with distance between Enemies — 120% at 20% Range, 110% at 40%, 100% at 60%, 90% at 80%, and 80% at 100%.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 750, damage: 75, range: 20, cooldown: 3, attackType: '[Small Cone]' },
        { level: 2, cost: 650, damage: 90, range: 22, cooldown: 2.8 },
        { level: 3, cost: 1050, damage: 90, range: 22, cooldown: 2.5 },
        { level: 4, cost: 1350, damage: 115, range: 24, cooldown: 2.5 },
        { level: 5, cost: 1750, damage: 125, range: 25, cooldown: 2.2 },
      ],
      shiny: [
        { level: 1, cost: 750, damage: '82.5', range: 20, cooldown: 3, attackType: '[Small Cone]' },
        { level: 2, cost: 650, damage: 99, range: 22, cooldown: 2.8 },
        { level: 3, cost: 1050, damage: 99, range: 22, cooldown: 2.5 },
        { level: 4, cost: 1350, damage: '126.5', range: 24, cooldown: 2.5 },
        { level: 5, cost: 1750, damage: '137.5', range: 25, cooldown: 2.2 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  108: {
    id: 108,
    passives: [
      {
        name: 'Energy Surplus',
        description: 'Every 5th attack, Toy Bonnie deals +250% Damage.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 850, damage: 55, range: 22, cooldown: 2.6, attackType: '[Small Cone]' },
        { level: 2, cost: 850, damage: 65, range: 26, cooldown: 2.6 },
        { level: 3, cost: 1050, damage: 80, range: 26, cooldown: 2.6 },
        { level: 4, cost: 1450, damage: 100, range: 28, cooldown: 2.4 },
        { level: 5, cost: 1850, damage: 120, range: 28, cooldown: 2.4 },
      ],
      shiny: [
        { level: 1, cost: 850, damage: '60.5', range: 22, cooldown: 2.6, attackType: '[Small Cone]' },
        { level: 2, cost: 850, damage: '71.5', range: 26, cooldown: 2.6 },
        { level: 3, cost: 1050, damage: 88, range: 26, cooldown: 2.6 },
        { level: 4, cost: 1450, damage: 110, range: 28, cooldown: 2.4 },
        { level: 5, cost: 1850, damage: 132, range: 28, cooldown: 2.4 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  111: {
    id: 111,
    passives: [
      {
        name: 'Birthday Boy',
        description: 'Provides a 3% buff to damage, range, and cooldown to every unit in its radius.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 400, damage: 0, range: 15, cooldown: 0, attackType: '[Support]' },
        { level: 2, cost: 600, damage: 0, range: 16, cooldown: 0 },
        { level: 3, cost: 800, damage: 0, range: 17, cooldown: 0 },
        { level: 4, cost: 1050, damage: 0, range: 18, cooldown: 0 },
      ],
      shiny: [
        { level: 1, cost: 400, damage: 0, range: 15, cooldown: 0, attackType: '[Support]' },
        { level: 2, cost: 600, damage: 0, range: 16, cooldown: 0 },
        { level: 3, cost: 800, damage: 0, range: 17, cooldown: 0 },
        { level: 4, cost: 1050, damage: 0, range: 18, cooldown: 0 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
  112: {
    id: 112,
    passives: [
      {
        name: 'Short Circuit',
        description: 'Every 5th attack, Toy Chica deals +100% Damage.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1100, damage: 120, range: 24, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 1000, damage: 130, range: 26, cooldown: 2.5 },
        { level: 3, cost: 1400, damage: 140, range: 28, cooldown: 2.5 },
        { level: 4, cost: 1650, damage: 155, range: 30, cooldown: 2.2 },
        { level: 5, cost: 2100, damage: 175, range: 32, cooldown: 2.2 },
      ],
      shiny: [
        { level: 1, cost: 1100, damage: '132', range: 24, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 1000, damage: '143', range: 26, cooldown: 2.5 },
        { level: 3, cost: 1400, damage: '154', range: 28, cooldown: 2.5 },
        { level: 4, cost: 1650, damage: '170.5', range: 30, cooldown: 2.2 },
        { level: 5, cost: 2100, damage: '192.5', range: 32, cooldown: 2.2 },
      ]
    },
    history: [
        { date: '10/19/25', change: 'Introduced' }
    ]
  },
};


// --- BASIC UNIT DATA ---
export const UNITS: Unit[] = [
  // Uncommon
  { id: 101, name: 'Freddy', rarity: Rarity.Uncommon, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/42/Unit_Freddy.png', cost: 100, description: 'The face of Fazbear Entertainment. A reliable frontman.' },
  { id: 102, name: 'Chica', rarity: Rarity.Uncommon, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/e/e8/Unit_Chica.png', cost: 100, description: 'Loves pizza and serves up some decent damage.' },
  { id: 103, name: 'Bonnie', rarity: Rarity.Uncommon, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/4/43/Unit_Bonnie.png', cost: 100, description: 'A rockstar rabbit with a killer guitar solo.' },
  { id: 104, name: 'Foxy', rarity: Rarity.Uncommon, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/9/9e/Unit_Foxy.png', cost: 120, description: 'A swift pirate fox who rushes down his enemies.' },
  
  // Rare
  { id: 105, name: 'JJ', rarity: Rarity.Rare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/c1/Unit_JJ.png', cost: 250, description: 'Similar to Balloon Boy, JJ hides under the desk and disables threats.' },
  { id: 106, name: 'PaperPals', rarity: Rarity.Rare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/b/b6/Unit_Paper_Pals.png', cost: 200, description: 'A trio of paper decorations that somehow are able to fight.' },

  // Epic
  {
    id: 7,
    name: 'Balloon Boy',
    rarity: Rarity.Epic,
    image: "https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/b/b5/Unit_Balloon_Boy.png",
    description: 'His laughter is your nightmare. A master of disruption.',
    cost: 350,
  },
  { id: 107, name: 'Toy Freddy', rarity: Rarity.Epic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/8/8a/Unit_Toy_Freddy.png', cost: 400, description: 'A polished, plastic version of Freddy, but don\'t let his friendly look fool you.' },
  { id: 108, name: 'Toy Bonnie', rarity: Rarity.Epic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/a6/Unit_Toy_Bonnie.png', cost: 400, description: 'This blue bunny has a shiny guitar and an even shinier glare.' },
  { id: 109, name: 'Withered Chica', rarity: Rarity.Epic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/cc/Unit_Withered_Chica.png', cost: 450, description: 'A broken down but still dangerous animatronic with a horrific jaw.' },
  { id: 111, name: 'Cupcake', rarity: Rarity.Epic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/7/78/Unit_Cupcake.png', cost: 300, description: 'More than just a tasty treat, this cupcake packs a surprising punch.' },
  
  // Mythic
  {
    id: 3,
    name: 'Withered Bonnie',
    rarity: Rarity.Mythic,
    image: "https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/c3/Unit_Withered_Bonnie.png",
    description: 'Faceless and relentless, he strikes fear and heavy damage.',
    cost: 850,
  },
  { id: 112, name: 'Toy Chica', rarity: Rarity.Mythic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/3b/Unit_Toy_Chica.png', cost: 800, description: 'She\'s got a sweet tooth for destruction.' },
  { id: 114, name: 'Endo 01', rarity: Rarity.Mythic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/a1/Unit_Endo_01.png', cost: 750, description: 'The basic endoskeleton, a versatile and adaptable fighter.' },
  { id: 115, name: 'Fazcade', rarity: Rarity.Mythic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/6e/Unit_Fazcade.png', cost: 900, description: 'A walking arcade machine that shoots out high-score-breaking projectiles.' },
  
  // Secret
  {
    id: 4,
    name: 'Withered Foxy',
    rarity: Rarity.Secret,
    image: "https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/3/32/Unit_Withered_Foxy.png",
    description: 'Even more broken, yet faster and deadlier than ever.',
    cost: 1600,
  },
  {
    id: 5,
    name: 'Withered Freddy',
    rarity: Rarity.Secret,
    image: "https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/b/b7/Unit_Withered_Freddy.png",
    description: 'The leader is back, and he\'s not happy.',
    cost: 1400,
  },
  {
    id: 9,
    name: 'Shadow Freddy',
    rarity: Rarity.Secret,
    image: "https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/00/Unit_Shadow_Freddy.png",
    description: 'A mysterious purple bear that can crash the game... and your enemies.',
    cost: 2000,
  },
  { id: 116, name: 'Party Glock Freddy', rarity: Rarity.Secret, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/8/85/Unit_Party_Glock_Freddy.png', cost: 1500, description: 'This party animal brought more than just cake.' },
  { id: 120, name: 'Endo 02', rarity: Rarity.Secret, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/b/b5/Unit_Endo_02.png', cost: 1200, description: 'An upgraded endoskeleton with superior combat abilities.' },
  
  // Nightmare
  { id: 121, name: 'Mangle', rarity: Rarity.Nightmare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/0d/Unit_Mangle.png', cost: 5000, description: 'A chaotic mess of parts that attacks from the ceiling. Yes.' },
  
  // Hero
  { id: 122, name: 'Golden Freddy', rarity: Rarity.Hero, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/f/fe/Unit_Golden_Freddy.png', cost: 10000, description: 'It\'s me. A ghostly bear with reality-bending powers.' },
];