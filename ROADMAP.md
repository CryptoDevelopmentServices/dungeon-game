# ✅ CURRENT STACK RECAP

## Frontend:
- 🧱 HTML5/CSS + JavaScript  
- 🎮 Phaser 3 (Top-down + side-scroller support)  
- 🔐 Login/Register/Profile pages  
- 🧭 Dynamic navbar with balance + logout  
- 🎨 Pixel assets + tileset + map  

## Backend:
- 🟩 Node.js + Express  
- 🗃️ Sequelize (with SQLite for now)  
- 🔐 Auth routes (register/login)  
- 👤 User model with balance + wallet  
- 💻 Placeholder RPC integration (`generateAddress`)  

---

# ✅ What's Working

| Feature                    | Status                                        |
|---------------------------|-----------------------------------------------|
| User registration/login   | ✅ Working                                    |
| Wallet address generation | ⚠️ Local coin daemon must be online          |
| Static assets served      | ✅                                             |
| Game loads top-down scene | ✅                                             |
| Coin art, player/enemy sprites | ✅                                       |
| Nav bar + logout + balance| ✅                                             |

---

# 🔧 What’s Needed To Get the Game Fully Working

## 🔲 1. Fully Functional Phaser Game Logic
- Load and render `map.json` using `tileset.png`
- Place player sprite and animate
- Spawn coins (pickup items)
- Add enemy logic (movement, collision)
- Add basic combat
- Coin pickup increases balance (client-side → API)

## 🔲 2. Backend Game API
- `POST /api/game/collect` → update balance on coin pickup  
- `POST /api/game/damage` or `POST /api/game/defeat` → handle enemy kills (optional)  
- `POST /api/wallet/withdraw` → initiate withdrawal to external wallet  

## 🔲 3. Secure Coin Handling
- Lock coin reward logic behind server validation (avoid cheating)  
- Add JWT-based auth middleware (recommended)  
- Store balance securely (update via server only)  

## 🔲 4. Coin Daemon Integration
- Ensure `generateAddress()` uses a live RPC coin daemon (port `9982`)  
- Add `sendtoaddress` RPC method for withdrawals  
- Create `wallet.js` route with `/withdraw` and `/balance` endpoints  

## 🔲 5. Profile Page Features
- Show current username, wallet address, balance  
- Add “Withdraw” button with input for address  
- Optional: inventory, stats, battle history  

---

# ⚙️ Suggested Game Flow (Example)
1. User logs in → gets session + balance  
2. Game loads (top-down or side-scroll)  
3. Player moves + picks up coins  
4. Client sends `POST /api/game/collect` → updates DB balance  
5. Balance shown live in HUD / nav  
6. Player can go to Profile → request withdrawal  

---

# 🚀 Optional Enhancements

| Feature               | Purpose                                  |
|----------------------|-------------------------------------------|
| 🗺️ Tiled map editor | Easier level design                      |
| ⚔️ Equipment upgrades| Use coins to buy gear                    |
| 🧠 Enemy AI (simple) | Chasing, damage, patrol logic            |
| 💾 Save/load game    | Via API or `localStorage`                |
| 📱 PWA/mobile support| Run game on phones easily                |

---

# ✅ Action Plan: What To Do Next

### Phase 1: Game Engine Logic (Top-down)
- Build out `client/scenes/topdown.js` with:
  - Tilemap loader  
  - Player movement  
  - Coin pickup & server sync  

### Phase 2: Game API
- Add routes in `server/routes/game.js`:  
  - `POST /collect`  
  - `GET /stats`  
  - `POST /withdraw`  

### Phase 3: Wallet Integration
- Update `methods.js` to actually call coin daemon  
- Handle `sendtoaddress`, `getbalance`  

---

# 🧠 Bonus Suggestion

Add a `DEV_MODE` flag to your JavaScript to simulate logic before the coin daemon is ready:

```js
if (DEV_MODE) {
  console.log('Coin collected, +10 ADVC');
}
```