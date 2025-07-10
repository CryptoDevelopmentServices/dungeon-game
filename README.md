# :crossed_swords: Dungeon Game

[→ View Roadmap](ROADMAP.md)

## 🎮 Core Game Design

### 🎨 Visual Style:
- 🎮 8-bit or 16-bit pixel art (NES/SNES style)
- 🧭 Top-down or side-scrolling dungeon style

### ⚔️ Gameplay Features:
- 🏗️ Procedural dungeon generation (for replayability)
- 🥷 Combat: Basic melee/ranged attacks, dodge, enemy AI
- 💰 Loot system: Drop items, coins (your crypto), and gear

## 💰 Crypto Integration

### 🪙 Earn:
- 🏆 Players earn your coin (e.g., ADVC) by defeating enemies, completing levels, or daily challenges

### 🛒 Spend (In-game):
- 🗡️ Buy weapons, armor, potions, keys, or skill upgrades
- 🔓 Could also unlock areas or difficulty tiers

### 💸 Withdraw:
- 🔗 Allow user to connect a wallet
- 📤 Option to "withdraw to wallet" when a threshold is hit
- 🔁 Backend uses RPC to send real coins

## 🛒 In-App Purchases

Use earned coins to:
- 🎭 Buy skins (cosmetic)
- 💪 Boost stats
- 🕳️ Summon rare dungeons with better loot

## 🖥️ Tech Stack Suggestion

### 🖥️ Frontend/Game Engine:
- ⚙️ HTML5 + Phaser 3 (great for pixel games + web deployment)

### 🌐 Backend:
- 🟩 Node.js  
- 🔧 Manages accounts, wallet integration, database, and RPC calls

### 🔐 Blockchain Wallet Handling:
- 🪙 Use your AdventureCoin wallet RPC
- 🏷️ Assign each player a deposit address
- 📊 Track balances and confirm when coins can be spent/withdrawn

### 🗃️ Database:
- 📈 Track player inventory, XP, coin balance, and withdrawals
- 🧩 Sequelize

## :white_check_mark: MVP Plan

- 🕹️ Basic dungeon crawler prototype (movement + combat)
- 🪙 Add loot + coin earning logic
- 🎒 Inventory and shop system (spend coins)
- 🔗 Wallet integration + RPC withdrawal (ADVC)
- 👤 User login system (auth + profiles)
