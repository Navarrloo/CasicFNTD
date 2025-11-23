import { Unit, Rarity, Achievement } from '../types';

export const ADMIN_USERNAMES = ['NAVARRLO', 'AVE4GE'];
export const CASINO_COST = 1;
export const STARTING_BALANCE = 1000;
export const BALANCE_ICON = '/currency/soul-icon.png';

// --- ACHIEVEMENTS ---
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_spin', name: 'Lucky Start', description: 'Spin the casino wheel for the first time.', icon: '🎲', reward: 50 },
  { id: 'wiki_explorer', name: 'Wiki Explorer', description: 'Visit at least 3 different pages in the Wiki.', icon: '📚', reward: 75 },
  { id: 'novice_collector', name: 'Novice Collector', description: 'Own 5 or more units in your inventory.', icon: '📦', reward: 100 },
  { id: 'first_trade', name: 'First Deal', description: 'Successfully create your first trade listing.', icon: '🤝', reward: 150 },
  { id: 'big_spender', name: 'Big Spender', description: 'Spend a total of 1000 souls.', icon: '💸', reward: 200 },
  { id: 'millionaire', name: 'Millionaire', description: 'Have 10,000 souls at once.', icon: '💰', reward: 500 },
  { id: 'lucky_7', name: 'Lucky Seven', description: 'Win a Mythic or better unit.', icon: '🍀', reward: 300 },
  { id: 'trader_pro', name: 'Trader Pro', description: 'Complete 10 trades on marketplace.', icon: '🏪', reward: 400 },
  { id: 'battle_winner', name: 'Battle Master', description: 'Win 5 PvP battles.', icon: '⚔️', reward: 250 },
  { id: 'crafter', name: 'Master Crafter', description: 'Craft your first unit.', icon: '⚒️', reward: 200 },
];

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
  9: {
    id: 9,
    passives: [
      {
        name: 'Shadow Realm',
        description: 'Shadow Freddy harnesses dark energy to deal devastating damage.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 2500, damage: 253, range: 20, cooldown: 3, attackType: '[Circle AoE]' },
        { level: 2, cost: 1000, damage: 283, range: 22, cooldown: 3 },
        { level: 3, cost: 1500, damage: 304, range: 24, cooldown: 3 },
        { level: 4, cost: 2500, damage: 334, range: 24, cooldown: 4 },
        { level: 5, cost: 2500, damage: 364, range: 26, cooldown: 3, attackType: '[Full AoE]' },
        { level: 6, cost: 3500, damage: 354, range: 26, cooldown: 3 },
        { level: 7, cost: 4000, damage: 405, range: 28, cooldown: 3 },
        { level: 8, cost: 4500, damage: 455, range: 29, cooldown: 3 },
      ],
      shiny: [
        { level: 1, cost: 2500, damage: 278, range: 20, cooldown: 3, attackType: '[Circle AoE]' },
        { level: 2, cost: 1000, damage: 311, range: 22, cooldown: 3 },
        { level: 3, cost: 1500, damage: 334, range: 24, cooldown: 3 },
        { level: 4, cost: 2500, damage: 367, range: 24, cooldown: 4 },
        { level: 5, cost: 2500, damage: 400, range: 26, cooldown: 3, attackType: '[Full AoE]' },
        { level: 6, cost: 3500, damage: 389, range: 26, cooldown: 3 },
        { level: 7, cost: 4000, damage: 445, range: 28, cooldown: 3 },
        { level: 8, cost: 4500, damage: 500, range: 29, cooldown: 3 },
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
  109: {
    id: 109,
    passives: [
      {
        name: 'Chain Attack',
        description: 'Withered Chica\'s attacks can chain between enemies.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 800, damage: 100, range: 15, cooldown: 5, attackType: '[Chain]' },
        { level: 2, cost: 800, damage: 130, range: 17, cooldown: 5 },
        { level: 3, cost: 1200, damage: 150, range: 19, cooldown: 4.5 },
        { level: 4, cost: 1600, damage: 170, range: 21, cooldown: 4.5 },
        { level: 5, cost: 2000, damage: 200, range: 22, cooldown: 4.2 },
      ],
      shiny: [
        { level: 1, cost: 800, damage: 110, range: 15, cooldown: 5, attackType: '[Chain]' },
        { level: 2, cost: 800, damage: 143, range: 17, cooldown: 5 },
        { level: 3, cost: 1200, damage: 165, range: 19, cooldown: 4.5 },
        { level: 4, cost: 1600, damage: 187, range: 21, cooldown: 4.5 },
        { level: 5, cost: 2000, damage: 220, range: 22, cooldown: 4.2 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  110: {
    id: 110,
    passives: [
      {
        name: 'Overwhelming Horde',
        description: 'For each Zombie Cupcake (Zombie Chica\'s summon) on the field, increases this units damage by 1% (up to 10%).'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 600, damage: 80, range: 25, cooldown: 4, attackType: '[Explosion]' },
        { level: 2, cost: 800, damage: 90, range: 27, cooldown: 4 },
        { level: 3, cost: 1000, damage: 100, range: 29, cooldown: 4 },
        { level: 4, cost: 1400, damage: 120, range: 31, cooldown: 4 },
      ],
      shiny: [
        { level: 1, cost: 600, damage: 88, range: 25, cooldown: 4, attackType: '[Explosion]' },
        { level: 2, cost: 800, damage: 99, range: 27, cooldown: 4 },
        { level: 3, cost: 1000, damage: 110, range: 29, cooldown: 4 },
        { level: 4, cost: 1400, damage: 132, range: 31, cooldown: 4 },
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
    ]
  },
  115: {
    id: 115,
    passives: [
      {
        name: 'Arcade Machine',
        description: 'Every Wave completed, Fazcade makes Money based on its Upgrade. [Upgrade 1: 200 Cash, Upgrade 2: 450 Cash, Upgrade 3: 1000 Cash, Upgrade 4: 1600 Cash].'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 450, damage: 0, range: 0, cooldown: 0, attackType: '[Farm]' },
        { level: 2, cost: 900, damage: 0, range: 0, cooldown: 0 },
        { level: 3, cost: 2000, damage: 0, range: 0, cooldown: 0 },
        { level: 4, cost: 3250, damage: 0, range: 0, cooldown: 0 },
      ],
      shiny: [
        { level: 1, cost: 450, damage: 0, range: 0, cooldown: 0, attackType: '[Farm]' },
        { level: 2, cost: 900, damage: 0, range: 0, cooldown: 0 },
        { level: 3, cost: 2000, damage: 0, range: 0, cooldown: 0 },
        { level: 4, cost: 3250, damage: 0, range: 0, cooldown: 0 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  3: {
    id: 3,
    passives: [
      {
        name: 'Unhandy',
        description: 'The cooldown of Withered Bonnie is divided by the range of this unit divided by 10.'
      },
      {
        name: 'The Main Event',
        description: 'Upon placement, this unit gains 100% Range for 7s. (Active on Upgrades 6+)'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1250, damage: 251, range: 8, cooldown: 1.5, attackType: '[Single Target]' },
        { level: 2, cost: 1300, damage: 300, range: 9, cooldown: 1.8 },
        { level: 3, cost: 1500, damage: 347, range: 9, cooldown: 1.8 },
        { level: 4, cost: 1600, damage: 394, range: 9, cooldown: 1.8 },
        { level: 5, cost: 1700, damage: 441, range: 9, cooldown: 1.8 },
        { level: 6, cost: 1800, damage: 488, range: 10, cooldown: 2 },
        { level: 7, cost: 1900, damage: 535, range: 10, cooldown: 2 },
        { level: 8, cost: 2000, damage: 582, range: 10, cooldown: 2 },
        { level: 9, cost: 2100, damage: 629, range: 11, cooldown: 2.2 },
        { level: 10, cost: 2200, damage: 676, range: 11, cooldown: 2.2 },
      ],
      shiny: [
        { level: 1, cost: 1250, damage: 276.1, range: 8, cooldown: 1.5, attackType: '[Single Target]' },
        { level: 2, cost: 1300, damage: 330, range: 9, cooldown: 1.8 },
        { level: 3, cost: 1500, damage: 381.7, range: 9, cooldown: 1.8 },
        { level: 4, cost: 1600, damage: 433.4, range: 9, cooldown: 1.8 },
        { level: 5, cost: 1700, damage: 485.1, range: 9, cooldown: 1.8 },
        { level: 6, cost: 1800, damage: 536.8, range: 10, cooldown: 2 },
        { level: 7, cost: 1900, damage: 588.5, range: 10, cooldown: 2 },
        { level: 8, cost: 2000, damage: 640.2, range: 10, cooldown: 2 },
        { level: 9, cost: 2100, damage: 691.9, range: 11, cooldown: 2.2 },
        { level: 10, cost: 2200, damage: 743.6, range: 11, cooldown: 2.2 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  4: {
    id: 4,
    passives: [
      {
        name: 'Speed Runner',
        description: 'Withered Foxy gets 30% Cooldown for each enemy on the track up to 150%.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1800, damage: 240, range: 23, cooldown: 6, attackType: '[Cone]' },
        { level: 2, cost: 1900, damage: 280, range: 23, cooldown: 5.8 },
        { level: 3, cost: 2000, damage: 320, range: 24, cooldown: 5.6 },
        { level: 4, cost: 2100, damage: 360, range: 24, cooldown: 5.4 },
        { level: 5, cost: 2200, damage: 400, range: 25, cooldown: 5.2 },
        { level: 6, cost: 2300, damage: 460, range: 25, cooldown: 5 },
        { level: 7, cost: 2400, damage: 520, range: 26, cooldown: 4.8 },
        { level: 8, cost: 2500, damage: 580, range: 26, cooldown: 4.6 },
        { level: 9, cost: 2600, damage: 640, range: 27, cooldown: 4.4 },
        { level: 10, cost: 2700, damage: 700, range: 27, cooldown: 4.2 },
      ],
      shiny: [
        { level: 1, cost: 1800, damage: 264, range: 23, cooldown: 6, attackType: '[Cone]' },
        { level: 2, cost: 1900, damage: 308, range: 23, cooldown: 5.8 },
        { level: 3, cost: 2000, damage: 352, range: 24, cooldown: 5.6 },
        { level: 4, cost: 2100, damage: 396, range: 24, cooldown: 5.4 },
        { level: 5, cost: 2200, damage: 440, range: 25, cooldown: 5.2 },
        { level: 6, cost: 2300, damage: 506, range: 25, cooldown: 5 },
        { level: 7, cost: 2400, damage: 572, range: 26, cooldown: 4.8 },
        { level: 8, cost: 2500, damage: 638, range: 26, cooldown: 4.6 },
        { level: 9, cost: 2600, damage: 704, range: 27, cooldown: 4.4 },
        { level: 10, cost: 2700, damage: 770, range: 27, cooldown: 4.2 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  5: {
    id: 5,
    passives: [
      {
        name: 'Phase Out',
        description: 'Every 45s, Withered Freddy teleports to the front (or back) most enemy in range and attacks dealing 150% damage. Additionally, from teleporting he cannot be sold for 10s.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1900, damage: 220, range: 20, cooldown: 4, attackType: '[Single Target]' },
        { level: 2, cost: 2000, damage: 260, range: 21, cooldown: 3.9 },
        { level: 3, cost: 2100, damage: 300, range: 22, cooldown: 3.8 },
        { level: 4, cost: 2200, damage: 340, range: 23, cooldown: 3.7 },
        { level: 5, cost: 2300, damage: 380, range: 24, cooldown: 3.6 },
        { level: 6, cost: 2400, damage: 440, range: 25, cooldown: 3.5 },
        { level: 7, cost: 2500, damage: 500, range: 26, cooldown: 3.4 },
        { level: 8, cost: 2600, damage: 560, range: 27, cooldown: 3.3 },
        { level: 9, cost: 2700, damage: 620, range: 28, cooldown: 3.2 },
        { level: 10, cost: 2800, damage: 680, range: 29, cooldown: 3.1 },
      ],
      shiny: [
        { level: 1, cost: 1900, damage: 242, range: 20, cooldown: 4, attackType: '[Single Target]' },
        { level: 2, cost: 2000, damage: 286, range: 21, cooldown: 3.9 },
        { level: 3, cost: 2100, damage: 330, range: 22, cooldown: 3.8 },
        { level: 4, cost: 2200, damage: 374, range: 23, cooldown: 3.7 },
        { level: 5, cost: 2300, damage: 418, range: 24, cooldown: 3.6 },
        { level: 6, cost: 2400, damage: 484, range: 25, cooldown: 3.5 },
        { level: 7, cost: 2500, damage: 550, range: 26, cooldown: 3.4 },
        { level: 8, cost: 2600, damage: 616, range: 27, cooldown: 3.3 },
        { level: 9, cost: 2700, damage: 682, range: 28, cooldown: 3.2 },
        { level: 10, cost: 2800, damage: 748, range: 29, cooldown: 3.1 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  114: {
    id: 114,
    passives: [
      {
        name: 'Metal Mayhem',
        description: 'This unit gains 15% Damage for each Animatronic placed.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 900, damage: 150, range: 20, cooldown: 3.5, attackType: '[Single Target]' },
        { level: 2, cost: 1000, damage: 180, range: 21, cooldown: 3.4 },
        { level: 3, cost: 1100, damage: 210, range: 22, cooldown: 3.3 },
        { level: 4, cost: 1200, damage: 240, range: 23, cooldown: 3.2 },
        { level: 5, cost: 1300, damage: 270, range: 24, cooldown: 3.1 },
      ],
      shiny: [
        { level: 1, cost: 900, damage: 165, range: 20, cooldown: 3.5, attackType: '[Single Target]' },
        { level: 2, cost: 1000, damage: 198, range: 21, cooldown: 3.4 },
        { level: 3, cost: 1100, damage: 231, range: 22, cooldown: 3.3 },
        { level: 4, cost: 1200, damage: 264, range: 23, cooldown: 3.2 },
        { level: 5, cost: 1300, damage: 297, range: 24, cooldown: 3.1 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  116: {
    id: 116,
    passives: [
      {
        name: 'Party Time',
        description: 'Every 30 seconds, Party Glock Freddy gains 100% Attack Speed for 10 seconds.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1500, damage: 120, range: 25, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 1600, damage: 145, range: 26, cooldown: 2.4 },
        { level: 3, cost: 1700, damage: 170, range: 27, cooldown: 2.3 },
        { level: 4, cost: 1800, damage: 195, range: 28, cooldown: 2.2 },
        { level: 5, cost: 1900, damage: 220, range: 29, cooldown: 2.1 },
        { level: 6, cost: 2000, damage: 250, range: 30, cooldown: 2 },
      ],
      shiny: [
        { level: 1, cost: 1500, damage: 132, range: 25, cooldown: 2.5, attackType: '[Single Target]' },
        { level: 2, cost: 1600, damage: 159.5, range: 26, cooldown: 2.4 },
        { level: 3, cost: 1700, damage: 187, range: 27, cooldown: 2.3 },
        { level: 4, cost: 1800, damage: 214.5, range: 28, cooldown: 2.2 },
        { level: 5, cost: 1900, damage: 242, range: 29, cooldown: 2.1 },
        { level: 6, cost: 2000, damage: 275, range: 30, cooldown: 2 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  120: {
    id: 120,
    passives: [
      {
        name: 'Bare Bones',
        description: 'This unit deals 25% more damage to bosses.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1200, damage: 160, range: 22, cooldown: 3, attackType: '[Single Target]' },
        { level: 2, cost: 1300, damage: 190, range: 23, cooldown: 2.9 },
        { level: 3, cost: 1400, damage: 220, range: 24, cooldown: 2.8 },
        { level: 4, cost: 1500, damage: 250, range: 25, cooldown: 2.7 },
        { level: 5, cost: 1600, damage: 280, range: 26, cooldown: 2.6 },
        { level: 6, cost: 1700, damage: 310, range: 27, cooldown: 2.5 },
      ],
      shiny: [
        { level: 1, cost: 1200, damage: 176, range: 22, cooldown: 3, attackType: '[Single Target]' },
        { level: 2, cost: 1300, damage: 209, range: 23, cooldown: 2.9 },
        { level: 3, cost: 1400, damage: 242, range: 24, cooldown: 2.8 },
        { level: 4, cost: 1500, damage: 275, range: 25, cooldown: 2.7 },
        { level: 5, cost: 1600, damage: 308, range: 26, cooldown: 2.6 },
        { level: 6, cost: 1700, damage: 341, range: 27, cooldown: 2.5 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  121: {
    id: 121,
    passives: [
      {
        name: 'Ceiling Dweller',
        description: 'Mangle attacks from directly above, ignoring obstacles and terrain.'
      },
      {
        name: 'Mangled Radio',
        description: 'Every 20s, Mangle emits static that stuns all enemies in range for 2s.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 5000, damage: 450, range: 20, cooldown: 4.5, attackType: '[Cone]' },
        { level: 2, cost: 5500, damage: 520, range: 21, cooldown: 4.3 },
        { level: 3, cost: 6000, damage: 590, range: 22, cooldown: 4.1 },
        { level: 4, cost: 6500, damage: 660, range: 23, cooldown: 3.9 },
        { level: 5, cost: 7000, damage: 730, range: 24, cooldown: 3.7 },
        { level: 6, cost: 7500, damage: 820, range: 25, cooldown: 3.5 },
        { level: 7, cost: 8000, damage: 910, range: 26, cooldown: 3.3 },
        { level: 8, cost: 8500, damage: 1000, range: 27, cooldown: 3.1 },
      ],
      shiny: [
        { level: 1, cost: 5000, damage: 495, range: 20, cooldown: 4.5, attackType: '[Cone]' },
        { level: 2, cost: 5500, damage: 572, range: 21, cooldown: 4.3 },
        { level: 3, cost: 6000, damage: 649, range: 22, cooldown: 4.1 },
        { level: 4, cost: 6500, damage: 726, range: 23, cooldown: 3.9 },
        { level: 5, cost: 7000, damage: 803, range: 24, cooldown: 3.7 },
        { level: 6, cost: 7500, damage: 902, range: 25, cooldown: 3.5 },
        { level: 7, cost: 8000, damage: 1001, range: 26, cooldown: 3.3 },
        { level: 8, cost: 8500, damage: 1100, range: 27, cooldown: 3.1 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  123: {
    id: 123,
    passives: [
      {
        name: 'Soul Calling',
        description: 'Every 15s, Puppet summons a Soul on the track that will walk through every Enemy dealing 60% Damage and apply 20% [Slow] for 5s. The Soul cannot attack Bosses. (Active on Upgrades 5+)'
      },
      {
        name: 'Music Box',
        description: 'Every 10s, Puppet does Damage, +5% Damage for each Unit placed with a maximum of 150%, to all Enemies in Range based on the number of units placed.'
      },
      {
        name: 'Protector',
        description: 'Every 30s, Puppet applies 10% [Slow] to all Enemies for 7.5s. Additionally, this will Upgrade a random Unit with the lowest Upgrade. (Active on Upgrades 12+, cannot affect Heroes)'
      },
      {
        name: 'Happiest Day [Ability]',
        description: 'Upon activation, Puppet provides +25% Damage for all Units for 15s. [45s Global CD]. (Active on Upgrades 18+)'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1350, damage: 126.3, range: 20, cooldown: 3, attackType: '[Single Target]' },
        { level: 2, cost: 500, damage: 131.4, range: 20, cooldown: 3 },
        { level: 3, cost: 750, damage: 136.4, range: 20, cooldown: 3 },
        { level: 4, cost: 1000, damage: 141.5, range: 20, cooldown: 3 },
        { level: 5, cost: 1250, damage: 146.5, range: 20, cooldown: 3 },
        { level: 6, cost: 1750, damage: 151.6, range: 25, cooldown: 3 },
        { level: 7, cost: 2000, damage: 161.7, range: 25, cooldown: 3 },
        { level: 8, cost: 2250, damage: 171.8, range: 25, cooldown: 3 },
        { level: 9, cost: 2500, damage: 181.9, range: 25, cooldown: 3 },
        { level: 10, cost: 2750, damage: 192, range: 25, cooldown: 3 },
        { level: 11, cost: 3500, damage: 202.1, range: 30, cooldown: 2.8 },
        { level: 12, cost: 3500, damage: 217.2, range: 30, cooldown: 2.8 },
        { level: 13, cost: 5000, damage: 247.5, range: 30, cooldown: 2.8 },
        { level: 14, cost: 5500, damage: 262.7, range: 30, cooldown: 2.8 },
        { level: 15, cost: 6500, damage: 277.8, range: 35, cooldown: 2.5 },
        { level: 16, cost: 7000, damage: 298, range: 35, cooldown: 2.5 },
        { level: 17, cost: 7500, damage: 318.2, range: 35, cooldown: 2.5 },
        { level: 18, cost: 8000, damage: 338.4, range: 35, cooldown: 2.5 },
        { level: 19, cost: 8500, damage: 358.6, range: 35, cooldown: 2.5 },
        { level: 20, cost: 9000, damage: 378.8, range: 35, cooldown: 2.5 },
      ],
      shiny: [
        { level: 1, cost: 1350, damage: 138.93, range: 20, cooldown: 3, attackType: '[Single Target]' },
        { level: 2, cost: 500, damage: 144.54, range: 20, cooldown: 3 },
        { level: 3, cost: 750, damage: 150.04, range: 20, cooldown: 3 },
        { level: 4, cost: 1000, damage: 155.65, range: 20, cooldown: 3 },
        { level: 5, cost: 1250, damage: 161.15, range: 20, cooldown: 3 },
        { level: 6, cost: 1750, damage: 166.76, range: 25, cooldown: 3 },
        { level: 7, cost: 2000, damage: 177.87, range: 25, cooldown: 3 },
        { level: 8, cost: 2250, damage: 188.98, range: 25, cooldown: 3 },
        { level: 9, cost: 2500, damage: 200.09, range: 25, cooldown: 3 },
        { level: 10, cost: 2750, damage: 211.2, range: 25, cooldown: 3 },
        { level: 11, cost: 3500, damage: 222.31, range: 30, cooldown: 2.8 },
        { level: 12, cost: 3500, damage: 238.92, range: 30, cooldown: 2.8 },
        { level: 13, cost: 5000, damage: 272.25, range: 30, cooldown: 2.8 },
        { level: 14, cost: 5500, damage: 288.97, range: 30, cooldown: 2.8 },
        { level: 15, cost: 6500, damage: 305.58, range: 35, cooldown: 2.5 },
        { level: 16, cost: 7000, damage: 327.8, range: 35, cooldown: 2.5 },
        { level: 17, cost: 7500, damage: 350.02, range: 35, cooldown: 2.5 },
        { level: 18, cost: 8000, damage: 372.24, range: 35, cooldown: 2.5 },
        { level: 19, cost: 8500, damage: 394.46, range: 35, cooldown: 2.5 },
        { level: 20, cost: 9000, damage: 416.68, range: 35, cooldown: 2.5 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  124: {
    id: 124,
    passives: [
      {
        name: "Rider's Hellfire",
        description: 'Every 45s causes a firestorm within this unit\'s range for 15s. All enemies within this unit\'s range during a firestorm are afflicted with a burn that deals 12% of this unit\'s damage every second as long as they are in range.'
      },
      {
        name: 'Mutilation',
        description: 'Enemies struck by this unit are afflicted with a permanent [Bleed] dealing 2% of this unit\'s damage every second and stopping regeneration.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 5400, damage: 808, range: 24, cooldown: 6.4, attackType: '[Cone]' },
        { level: 2, cost: 3400, damage: 955, range: 25, cooldown: 6.4 },
        { level: 3, cost: 3600, damage: 1172, range: 26, cooldown: 6.4 },
        { level: 4, cost: 4200, damage: 1258, range: 26, cooldown: 6 },
        { level: 5, cost: 4800, damage: 1434, range: 27, cooldown: 5.8 },
        { level: 6, cost: 5400, damage: 1697, range: 27, cooldown: 5.8 },
        { level: 7, cost: 7000, damage: 1859, range: 31, cooldown: 6.6 },
        { level: 8, cost: 6600, damage: 2040, range: 33, cooldown: 6.3 },
        { level: 9, cost: 7200, damage: 2278, range: 35, cooldown: 6 },
        { level: 10, cost: 7800, damage: 2424, range: 36, cooldown: 5.6 },
      ],
      shiny: [
        { level: 1, cost: 5400, damage: 888.8, range: 24, cooldown: 6.4, attackType: '[Cone]' },
        { level: 2, cost: 3400, damage: 1050.5, range: 25, cooldown: 6.4 },
        { level: 3, cost: 3600, damage: 1289.2, range: 26, cooldown: 6.4 },
        { level: 4, cost: 4200, damage: 1383.8, range: 26, cooldown: 6 },
        { level: 5, cost: 4800, damage: 1577.4, range: 27, cooldown: 5.8 },
        { level: 6, cost: 5400, damage: 1866.7, range: 27, cooldown: 5.8 },
        { level: 7, cost: 7000, damage: 2044.9, range: 31, cooldown: 6.6 },
        { level: 8, cost: 6600, damage: 2244, range: 33, cooldown: 6.3 },
        { level: 9, cost: 7200, damage: 2505.8, range: 35, cooldown: 6 },
        { level: 10, cost: 7800, damage: 2666.4, range: 36, cooldown: 5.6 },
      ]
    },
    history: [
      { date: '11/15/25', change: 'Introduced' }
    ]
  },
  125: {
    id: 125,
    passives: [
      {
        name: 'Trick or Treat!',
        description: 'Every 30s gains a random buff (or debuff!) to itself of 3, lasting 30s. [1. Increases damage by 15%] [2. Decreases cooldown by 10%] [3. Decreases damage by 5% and increases cooldown by 5%.]'
      },
      {
        name: 'Angel or Devil?',
        description: 'When attacking an enemy, has a chance to either burn for 10% damage for 1s, or stun an enemy for 0.4s.'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1400, damage: 160, range: 16, cooldown: 4.2, attackType: '[Line]' },
        { level: 2, cost: 1200, damage: 180, range: 17, cooldown: 4.2 },
        { level: 3, cost: 1500, damage: 200, range: 18, cooldown: 4.2 },
        { level: 4, cost: 1900, damage: 210, range: 19, cooldown: 3.8 },
        { level: 5, cost: 2200, damage: 230, range: 20, cooldown: 3.8 },
        { level: 6, cost: 2500, damage: 250, range: 21, cooldown: 3.8 },
      ],
      shiny: [
        { level: 1, cost: 1400, damage: 176, range: 16, cooldown: 4.2, attackType: '[Line]' },
        { level: 2, cost: 1200, damage: 198, range: 17, cooldown: 4.2 },
        { level: 3, cost: 1500, damage: 220, range: 18, cooldown: 4.2 },
        { level: 4, cost: 1900, damage: 231, range: 19, cooldown: 3.8 },
        { level: 5, cost: 2200, damage: 253, range: 20, cooldown: 3.8 },
        { level: 6, cost: 2500, damage: 275, range: 21, cooldown: 3.8 },
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
    ]
  },
  126: {
    id: 126,
    passives: [
      {
        name: 'Explosive Jack-O-Lanterns',
        description: 'Every 5s, lays an exploding jack-o-lantern on the track somewhere within this unit\'s range (Max of 3 pumpkins per placement). When an enemy touches this pumpkin, the pumpkin will explode, dealing 120% of this unit\'s damage, and burning for 10% of that damage.'
      },
      {
        name: 'Jack-O Blaze',
        description: 'All attacks from this unit apply a burn for 5% of its damage for 3s. When attacking a burned enemy, this unit does 20% more damage. (This damage boost does not apply to pumpkins)'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 1000, damage: 135, range: 22, cooldown: 4.7, attackType: '[Explosion]' },
        { level: 2, cost: 1000, damage: 150, range: 22, cooldown: 4.7 },
        { level: 3, cost: 1400, damage: 165, range: 24, cooldown: 4.5 },
        { level: 4, cost: 1800, damage: 180, range: 24, cooldown: 4.5 },
        { level: 5, cost: 2000, damage: 200, range: 26, cooldown: 4.3 },
        { level: 6, cost: 2000, damage: 225, range: 26, cooldown: 4.3 },
      ],
      shiny: [
        { level: 1, cost: 1000, damage: 148.5, range: 22, cooldown: 4.7, attackType: '[Explosion]' },
        { level: 2, cost: 1000, damage: 165, range: 22, cooldown: 4.7 },
        { level: 3, cost: 1400, damage: 181.5, range: 24, cooldown: 4.5 },
        { level: 4, cost: 1800, damage: 198, range: 24, cooldown: 4.5 },
        { level: 5, cost: 2000, damage: 220, range: 26, cooldown: 4.3 },
        { level: 6, cost: 2000, damage: 247.5, range: 26, cooldown: 4.3 },
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
    ]
  },
  127: {
    id: 127,
    passives: [
      {
        name: 'Agonizing Energy',
        description: 'Attacks apply [Poison] for 2s, dealing 20% Damage.'
      },
      {
        name: 'Blackout [Ability]',
        description: 'Upon activation, Shadow Bonnie darkens the map for 15s. During the Blackout, every Enemy killed by him grants a +0.2% Damage and +0.2% Range with a maximum of 20%. [60s Local CD] (Active on Upgrades 6+)'
      }
    ],
    stats: {
      regular: [
        { level: 1, cost: 3500, damage: 500, range: 25, cooldown: 4.8, attackType: '[Single Target]' },
        { level: 2, cost: 2500, damage: 550, range: 25, cooldown: 4.8 },
        { level: 3, cost: 3500, damage: 600, range: 27.5, cooldown: 4.8 },
        { level: 4, cost: 6000, damage: 650, range: 24, cooldown: 5 },
        { level: 5, cost: 4500, damage: 700, range: 24, cooldown: 5 },
        { level: 6, cost: 5000, damage: 750, range: 24, cooldown: 4.7 },
        { level: 7, cost: 5500, damage: 800, range: 25, cooldown: 4.7 },
      ],
      shiny: [
        { level: 1, cost: 3500, damage: 550, range: 25, cooldown: 4.8, attackType: '[Single Target]' },
        { level: 2, cost: 2500, damage: 605, range: 25, cooldown: 4.8 },
        { level: 3, cost: 3500, damage: 660, range: 27.5, cooldown: 4.8 },
        { level: 4, cost: 6000, damage: 715, range: 24, cooldown: 5 },
        { level: 5, cost: 4500, damage: 770, range: 24, cooldown: 5 },
        { level: 6, cost: 5000, damage: 825, range: 24, cooldown: 4.7 },
        { level: 7, cost: 5500, damage: 880, range: 25, cooldown: 4.7 },
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  128: { // Slasher Bonnie
    id: 128,
    passives: [
      { name: 'Indiscriminate Bloodshed', description: 'Bloodlust boost now becomes permanent once obtained, stack cap still applies. Once this unit reaches 5 Bloodlust stacks, this unit\'s attack type changes to a 45 Degree Cone.' },
      { name: 'Bloodlust', description: 'For each enemy in range: increase damage by 5%, range by 3%, and decrease cooldown by 2%. (Max of 5 stacks; 25% damage, 15% range, 10% cooldown) Upon reaching its final upgrade, these stats increase to 7.5% damage, 5% range, and 3% cooldown. (Max 37.5% damage, 25% range, 15% cooldown)' }
    ],
    stats: {
      regular: [
        { level: 1, damage: 170, range: 15, cooldown: 2.5, attackType: 'Small Circle', cost: 2550 },
        { level: 2, damage: 190, range: 17, cooldown: 2.5, attackType: 'Small Circle', cost: 1600 },
        { level: 3, damage: 210, range: 21, cooldown: 2.2, attackType: 'Small Circle', cost: 2100 },
        { level: 4, damage: 240, range: 21, cooldown: 2.2, attackType: 'Small Circle', cost: 2800 },
        { level: 5, damage: 260, range: 23, cooldown: 2.6, attackType: 'Small Circle', cost: 3300 },
        { level: 6, damage: 280, range: 25, cooldown: 2.6, attackType: 'Small Circle', cost: 2800 },
        { level: 7, damage: 320, range: 26, cooldown: 2.5, attackType: 'Small Circle', cost: 3300 }
      ],
      shiny: [
        { level: 1, damage: 187, range: 16.5, cooldown: 2.5, attackType: 'Small Circle', cost: 2550 },
        { level: 2, damage: 209, range: 18.7, cooldown: 2.5, attackType: 'Small Circle', cost: 1600 },
        { level: 3, damage: 231, range: 23.1, cooldown: 2.2, attackType: 'Small Circle', cost: 2100 },
        { level: 4, damage: 264, range: 23.1, cooldown: 2.2, attackType: 'Small Circle', cost: 2800 },
        { level: 5, damage: 286, range: 25.3, cooldown: 2.6, attackType: 'Small Circle', cost: 3300 },
        { level: 6, damage: 308, range: 27.5, cooldown: 2.6, attackType: 'Small Circle', cost: 2800 },
        { level: 7, damage: 352, range: 28.6, cooldown: 2.5, attackType: 'Small Circle', cost: 3300 }
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
    ]
  },
  129: { // Scarecrow Freddy
    id: 129,
    passives: [
      { name: 'Guardian of the Fields', description: 'While in (Guardian) form, this unit slows all enemies in range by 30%, and debuffs all towers in range by 5% Damage and 5% Range. Additionally while in (Guardian) form this unit does 40% of its damage every second passively to all enemies in range.' },
      { name: 'Crop Raiser', description: 'While in (Raiser) form, this unit speeds up all enemies in range by 5%, and buffs all towers in range by 15% Damage and 15% Range. Additionally while in (Raiser) form, this unit will attack the strongest enemy in range every 3s for 200% of its damage.' },
      { name: 'Form Change [Ability]', description: 'Choose between (Guardian) and (Raiser) forms. [1 Time Use Local CD]' }
    ],
    stats: {
      regular: [
        { level: 1, damage: 80, range: 20, cooldown: 0, attackType: 'Support', cost: 1400 },
        { level: 2, damage: 90, range: 20, cooldown: 0, attackType: 'Support', cost: 1600 },
        { level: 3, damage: 100, range: 20, cooldown: 0, attackType: 'Support', cost: 2000 },
        { level: 4, damage: 110, range: 22, cooldown: 0, attackType: 'Support', cost: 3000 },
        { level: 5, damage: 120, range: 22, cooldown: 0, attackType: 'Support', cost: 3600 }
      ],
      shiny: [
        { level: 1, damage: 88, range: 22, cooldown: 0, attackType: 'Support', cost: 1400 },
        { level: 2, damage: 99, range: 22, cooldown: 0, attackType: 'Support', cost: 1600 },
        { level: 3, damage: 110, range: 22, cooldown: 0, attackType: 'Support', cost: 2000 },
        { level: 4, damage: 121, range: 24.2, cooldown: 0, attackType: 'Support', cost: 3000 },
        { level: 5, damage: 132, range: 24.2, cooldown: 0, attackType: 'Support', cost: 3600 }
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
    ]
  },
  130: { // Purple Guy
    id: 130,
    passives: [
      { name: 'Soul Absorption', description: 'Purple Guy gains +0.1% Damage for every Enemy killed with a maximum of 25% Damage.' },
      { name: 'Endo Summon', description: 'Purple Guy does not attack, but summons an Endo on the track on its Cooldown, with 100% Damage as Health. Every 3rd Summon, he will instead summon a Gun Endo which shoots Enemies as it walks down the track doing 40% Damage Single Target and 65% Damage as Health.' },
      { name: 'Salvage [Ability]', description: 'When activated, the Player can sacrifice a chosen Unit, removing a Placement, and place a Single Target Turret that has 75% Max Damage and 100% Cooldown. This Ability is active on Upgrade 9. Additionally, this Ability can only be used once for each Placement.' }
    ],
    stats: {
      regular: [
        { level: 1, damage: 400, range: 20, cooldown: 3.2, attackType: 'Summoner', cost: 2000 },
        { level: 2, damage: 435, range: 20, cooldown: 3.2, attackType: 'Summoner', cost: 2400 },
        { level: 3, damage: 470, range: 20, cooldown: 3.2, attackType: 'Summoner', cost: 2800 },
        { level: 4, damage: 510, range: 20, cooldown: 3.2, attackType: 'Summoner', cost: 3200 },
        { level: 5, damage: 545, range: 20, cooldown: 3.2, attackType: 'Summoner', cost: 3600 },
        { level: 6, damage: 620, range: 20, cooldown: 2.8, attackType: 'Summoner', cost: 4500 },
        { level: 7, damage: 660, range: 20, cooldown: 2.8, attackType: 'Summoner', cost: 5000 },
        { level: 8, damage: 700, range: 20, cooldown: 2.6, attackType: 'Summoner', cost: 5800 },
        { level: 9, damage: 750, range: 20, cooldown: 2.6, attackType: 'Summoner', cost: 7000 }
      ],
      shiny: [
        { level: 1, damage: 440, range: 22, cooldown: 3.2, attackType: 'Summoner', cost: 2000 },
        { level: 2, damage: 478.5, range: 22, cooldown: 3.2, attackType: 'Summoner', cost: 2400 },
        { level: 3, damage: 517, range: 22, cooldown: 3.2, attackType: 'Summoner', cost: 2800 },
        { level: 4, damage: 561, range: 22, cooldown: 3.2, attackType: 'Summoner', cost: 3200 },
        { level: 5, damage: 599.5, range: 22, cooldown: 3.2, attackType: 'Summoner', cost: 3600 },
        { level: 6, damage: 682, range: 22, cooldown: 2.8, attackType: 'Summoner', cost: 4500 },
        { level: 7, damage: 726, range: 22, cooldown: 2.8, attackType: 'Summoner', cost: 5000 },
        { level: 8, damage: 770, range: 22, cooldown: 2.6, attackType: 'Summoner', cost: 5800 },
        { level: 9, damage: 825, range: 22, cooldown: 2.6, attackType: 'Summoner', cost: 7000 }
      ]
    },
    history: [
      { date: '10/19/25', change: 'Introduced' }
    ]
  },
  131: { // Dreadbear
    id: 131,
    passives: [
      { name: 'Heartbeat Current', description: 'Every 60 seconds an electric shock spreads from Dreadbear\'s heart throughout the rest of his body, decreasing his cooldown by 15% for 20 seconds.' },
      { name: 'Curse of Dreadbear', description: 'Upon placement, this unit receives a 30% damage, 10% cooldown, and 20% range boost. If another Dreadbear unit is placed within this unit\'s range, this unit will lose all of these boosts.' },
      { name: 'Tesla Towers [Ability]', description: 'This unit gains an active ability to place a tesla tower in their range made from the scraps of their destroyed holding board. These tesla towers attack on Dreadbear\'s cooldown at the strongest enemy in range for 140% of his damage. Additionally these teslas have 20 range. (Max of 2 tesla towers) Active on Upgrades 6+' }
    ],
    stats: {
      regular: [
        { level: 1, damage: 300, range: 20, cooldown: 9, attackType: 'Line', cost: 3000 },
        { level: 2, damage: 340, range: 20, cooldown: 9, attackType: 'Line', cost: 3000 },
        { level: 3, damage: 380, range: 20, cooldown: 9, attackType: 'Line', cost: 3600 },
        { level: 4, damage: 420, range: 20, cooldown: 9, attackType: 'Line', cost: 4000 },
        { level: 5, damage: 860, range: 24, cooldown: 9, attackType: 'Full AoE', cost: 6000 },
        { level: 6, damage: 940, range: 25, cooldown: 9, attackType: 'Full AoE', cost: 7200 },
        { level: 7, damage: 980, range: 25, cooldown: 9, attackType: 'Full AoE', cost: 7200 },
        { level: 8, damage: 1040, range: 25, cooldown: 9, attackType: 'Full AoE', cost: 7800 },
        { level: 9, damage: 1100, range: 25, cooldown: 9, attackType: 'Full AoE', cost: 8400 }
      ],
      shiny: [
        { level: 1, damage: 330, range: 22, cooldown: 9, attackType: 'Line', cost: 3000 },
        { level: 2, damage: 374, range: 22, cooldown: 9, attackType: 'Line', cost: 3000 },
        { level: 3, damage: 418, range: 22, cooldown: 9, attackType: 'Line', cost: 3600 },
        { level: 4, damage: 462, range: 22, cooldown: 9, attackType: 'Line', cost: 4000 },
        { level: 5, damage: 946, range: 26.4, cooldown: 9, attackType: 'Full AoE', cost: 6000 },
        { level: 6, damage: 1034, range: 27.5, cooldown: 9, attackType: 'Full AoE', cost: 7200 },
        { level: 7, damage: 1078, range: 27.5, cooldown: 9, attackType: 'Full AoE', cost: 7200 },
        { level: 8, damage: 1144, range: 27.5, cooldown: 9, attackType: 'Full AoE', cost: 7800 },
        { level: 9, damage: 1210, range: 27.5, cooldown: 9, attackType: 'Full AoE', cost: 8400 }
      ]
    },
    history: [
      { date: '11/01/25', change: 'Introduced' }
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
  { id: 110, name: 'Undead Chica', rarity: Rarity.Rare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/c1/Unit_Undead_Chica.png', cost: 220, description: 'A rusty undead version of Chica with explosive power.' },

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
  { id: 115, name: 'Fazcade', rarity: Rarity.Mythic, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/6/6e/Unit_Fazcade.png', cost: 900, description: 'An arcade machine that generates cash with each wave completed.' },

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
  { id: 128, name: 'Slasher Bonnie', rarity: Rarity.Secret, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/8/81/Unit_Slasher_Bonnie.png', cost: 2550, description: 'A bloodthirsty bonnie whose rage grows with every enemy in sight.' },
  { id: 129, name: 'Scarecrow Freddy', rarity: Rarity.Secret, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/a/aa/Unit_Scarecrow_Freddy.png', cost: 1400, description: 'A mystical scarecrow who can switch between guardian and raiser forms.' },

  // Nightmare
  { id: 121, name: 'Mangle', rarity: Rarity.Nightmare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/0/0d/Unit_Mangle.png', cost: 5000, description: 'A chaotic mess of parts that attacks from the ceiling. Yes.' },
  { id: 130, name: 'Purple Guy', rarity: Rarity.Nightmare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/c/cc/Unit_Purple_Guy.png', cost: 2000, description: 'The infamous killer who summons endoskeletons to do his bidding.' },
  { id: 131, name: 'Dreadbear', rarity: Rarity.Nightmare, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/e/e1/Unit_Dreadbear.png', cost: 3000, description: 'A hulking electric nightmare bear who summons tesla towers.' },

  // Hero
  { id: 122, name: 'Golden Freddy', rarity: Rarity.Hero, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/f/fe/Unit_Golden_Freddy.png', cost: 10000, description: 'It\'s me. A ghostly bear with reality-bending powers.' },
  { id: 123, name: 'Puppet', rarity: Rarity.Hero, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/d/da/Unit_Puppet.png', cost: 10000, description: 'The puppet master who guards the souls. Upgrades and empowers your defense.' },

  // Apex
  { id: 124, name: 'Headless Horseman Mangle', rarity: Rarity.Apex, image: 'https://images.weserv.nl/?url=static.wikitide.net/fivenightstowerdefense2wiki/e/e7/Unit_Headless_Horseman_Mangle.png', cost: 15000, description: 'A hellish rider who brings firestorm and devastation to all enemies.' },
];