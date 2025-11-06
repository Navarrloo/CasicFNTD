# 🎰 FNTD Casino & Wiki - Full-Featured Game

<div align="center">
  
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)

**Telegram Web App для Five Nights Tower Defense 2**

[Features](#features) • [Installation](#installation) • [Database Setup](#database-setup) • [Documentation](FEATURES.md)

</div>

---

## ✨ Features

### 🎮 Core Gameplay
- 🎰 **Casino** - Spin to win units with different rarities
- 🛒 **Trading** - Buy & sell units on marketplace
- 📚 **Wiki** - Complete encyclopedia of units, elements, attacks
- 👤 **Profile** - Inventory, achievements, stats, leaderboard

### 🆕 Version 2.0 - NEW!
- ⚒️ **Crafting** - Fuse units to create rarer ones (3→1)
- 🎡 **Wheel of Fortune** - Daily free spin for big prizes
- 📜 **Live Quests** - Daily & weekly missions with rewards
- ⚔️ **PvP Arena** - Battle other players, win souls
- 👥 **Referrals** - Invite friends, earn bonuses
- 🎁 **Gifts** - Send units to friends
- 🏆 **Battle Pass** - Seasonal progression system
- 🎫 **Lottery** - 24h jackpot draws
- 📊 **Advanced Stats** - Charts, analytics, insights
- 🎨 **Themes** - Dark, Light, FNAF 1, FNAF 2
- 🔊 **Sound Effects** - Immersive audio
- 💰 **Achievement Rewards** - Claim souls for unlocking achievements

### 💎 Enhanced Systems
- 🎁 **Daily Login Bonus** - Streak system (x2 at 3 days, x3 at 7+)
- 📈 **Statistics** - Track every unit win, profit/loss
- 📜 **Transaction History** - Full record of all trades
- ✨ **Rare Unit Effects** - Particles & glow for Mythic+ units
- 🔔 **Telegram Notifications** - Haptic feedback & alerts

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Supabase account (free tier works!)

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/YOUR_USERNAME/CasicFNTD.git
cd CasicFNTD
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Supabase:**
   - Create project at https://supabase.com
   - Run SQL scripts (see [Database Setup](#database-setup))
   - Edit `lib/supabase.ts` with your credentials

4. **Run locally:**
```bash
npm run dev
```

5. **Open:** http://localhost:5173

### Build for production:
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Setup

### Step 1: Create Tables
Run `supabase.create-tables.sql` in Supabase SQL Editor

This creates:
- `profiles` table
- `listings` table
- RLS policies
- `buy_listing()` function
- `cancel_listing()` function

### Step 2: Add New Fields
Run `supabase.migration.sql` in SQL Editor

This adds all new columns for:
- Daily bonuses
- Statistics
- Quests
- Referrals
- Battle Pass
- Lottery
- And more...

### Step 3: Configure CORS (if needed)
- Supabase Dashboard → Project Settings → API
- Add `*` to CORS allowed origins
- (For production, use your actual domain)

---

## 📁 Project Structure

```
CasicFNTD-main/
├── components/
│   ├── achievements/        # Achievement system
│   ├── icons/               # Icon components
│   ├── layout/              # NavBar, layouts
│   ├── shared/              # Reusable components
│   ├── trade/               # Marketplace components
│   ├── CraftingPage.tsx     # 🆕 Crafting system
│   ├── WheelOfFortunePage.tsx # 🆕 Wheel of Fortune
│   ├── QuestsLivePage.tsx   # 🆕 Live quests
│   ├── PvPBattlePage.tsx    # 🆕 PvP battles
│   ├── ReferralPage.tsx     # 🆕 Referral system
│   ├── GiftsPage.tsx        # 🆕 Gift system
│   ├── BattlePassPage.tsx   # 🆕 Battle Pass
│   ├── LotteryPage.tsx      # 🆕 Lottery
│   ├── AdvancedStatsPage.tsx # 🆕 Advanced stats
│   ├── SettingsPage.tsx     # 🆕 Settings
│   └── MorePage.tsx         # 🆕 Menu page
├── hooks/                   # Custom React hooks
├── lib/
│   └── supabase.ts         # Database config
├── utils/
│   ├── sounds.ts           # 🆕 Sound manager
│   └── notifications.ts    # 🆕 Telegram notifications
├── types.ts                # TypeScript types
├── App.tsx                 # Main app component
└── supabase.migration.sql  # 🆕 Full DB migration

```

---

## 🎯 How to Play

### Getting Started:
1. **Claim daily bonus** (auto-popup on login)
2. **Spin casino** to win units (1 soul/spin)
3. **Check quests** and complete them
4. **Craft units** or trade on marketplace
5. **Invite friends** for referral bonuses

### Pro Tips:
- Complete daily quests first
- Use free wheel spin every day
- Craft common units → sell rares
- Save souls for Battle Pass premium
- Build strong PvP team for profit

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Database:** Supabase (PostgreSQL)
- **Styling:** TailwindCSS + Custom CSS
- **Platform:** Telegram Web App
- **Real-time:** Supabase Realtime subscriptions

---

## 📸 Screenshots

(Add your screenshots here)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Make your changes
4. Submit pull request

---

## 📝 Changelog

### Version 2.0.0 (Latest)
- ✅ Added 10 new game modes
- ✅ Crafting system
- ✅ PvP battles
- ✅ Quests with progress tracking
- ✅ Achievement rewards
- ✅ Sound effects
- ✅ Theme customization
- ✅ Advanced statistics
- ✅ And much more!

### Version 1.0.0
- Basic casino functionality
- Wiki pages
- Trading marketplace
- Profile system
- Admin panel

---

## 🔗 Links

- **Bot:** @YOUR_BOT_USERNAME
- **Supabase:** https://supabase.com
- **Developer:** @NAVARRLORBX

---

## 📄 License

MIT © 2025

---

## ⚠️ Important Notes

1. **All images** are loaded from external sources (Wikitide, CloudFront)
2. **Sound files** are from Mixkit (free license)
3. **Database** requires Supabase (free tier works)
4. **For production:** Update CORS, use environment variables

---

**Made with ❤️ for FNTD community**

🎮 **Happy Gaming!** 🎉
