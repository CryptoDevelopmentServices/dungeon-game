const API_BASE = 'http://localhost:3001/api'; // Adjust if needed
const tokenKey = 'advcGameToken';

// Phaser config
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let player, cursors, coins, balanceText;
let currentBalance = 0;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', 'assets/tileset.png');
  this.load.tilemapTiledJSON('map', 'assets/map.json');
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
  this.load.image('coin', 'assets/coin.png');
}

function create() {
  // JWT check
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    alert('Not logged in! Redirecting...');
    window.location.href = 'index.html';
    return;
  }

  // Load map & tiles
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tileset', 'tiles');
  const groundLayer = map.createLayer('Ground', tileset, 0, 0);
  const wallsLayer = map.createLayer('Walls', tileset, 0, 0);
  wallsLayer.setCollisionByProperty({ collides: true });

  // Player setup
  player = this.physics.add.sprite(100, 100, 'player', 1);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, wallsLayer);

  cursors = this.input.keyboard.createCursorKeys();

  // Coins group
  coins = this.physics.add.group();

  // Create some coins at fixed positions (example)
  const coinPositions = [
    { x: 200, y: 150 },
    { x: 400, y: 300 },
    { x: 550, y: 200 },
  ];

  coinPositions.forEach(pos => {
    const coin = coins.create(pos.x, pos.y, 'coin');
    coin.setCircle(12);
  });

  this.physics.add.overlap(player, coins, collectCoin, null, this);

  // HUD
  balanceText = document.getElementById('balance');
  fetchBalance();

  // Logout button
  document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem(tokenKey);
    window.location.href = 'index.html';
  };
}

function update() {
  if (!player) return;

  player.setVelocity(0);

  if (cursors.left.isDown) player.setVelocityX(-160);
  else if (cursors.right.isDown) player.setVelocityX(160);

  if (cursors.up.isDown) player.setVelocityY(-160);
  else if (cursors.down.isDown) player.setVelocityY(160);
}

async function collectCoin(player, coin) {
  coin.disableBody(true, true);

  // Reward amount
  const rewardAmount = 1;

  try {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch(`${API_BASE}/game/reward`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: rewardAmount }),
    });
    const data = await res.json();
    if (res.ok) {
      currentBalance = data.balance;
      updateBalance();
    } else {
      alert(data.message || 'Reward failed');
    }
  } catch (e) {
    alert('Server error during reward');
  }
}

async function fetchBalance() {
  try {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch(`${API_BASE}/game/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      currentBalance = data.balance;
      updateBalance();
    }
  } catch (e) {
    console.error('Failed to fetch balance');
  }
}

function updateBalance() {
  balanceText.textContent = currentBalance.toFixed(2);
}
