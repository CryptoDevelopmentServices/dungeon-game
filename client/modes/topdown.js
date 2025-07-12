import { Player } from '../entities/player.js';

export class TopDownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TopDownScene' });
  }

  preload() {
    this.load.image('tiles', 'assets/tileset.png'); // 64x64 image (2x2 tiles, 32px each)
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');
  }

  create() {
    const tileSize = 32;
    const mapWidth = 40;
    const mapHeight = 40;

    const levelData = this.generateDungeon(mapWidth, mapHeight);
    const map = this.make.tilemap({ data: levelData, tileWidth: tileSize, tileHeight: tileSize });

    const tileset = map.addTilesetImage('tiles', null, tileSize, tileSize);
    const layer = map.createLayer(0, tileset, 0, 0);
    layer.setCollision(0); // Tile 0 = wall

    const spawn = this.findSpawnPoint(levelData);
    this.player = new Player(this, spawn.x * tileSize, spawn.y * tileSize);
    this.physics.add.collider(this.player.sprite, layer);
  }

  update() {
    this.player.update();
  }

  generateDungeon(width, height) {
    // 0 = wall, 1 = floor
    const map = Array.from({ length: height }, () => Array(width).fill(0));
    const rooms = [];
    const roomCount = 8;

    for (let i = 0; i < roomCount; i++) {
      const roomW = Phaser.Math.Between(4, 8);
      const roomH = Phaser.Math.Between(4, 8);
      const roomX = Phaser.Math.Between(1, width - roomW - 2);
      const roomY = Phaser.Math.Between(1, height - roomH - 2);

      const newRoom = { x: roomX, y: roomY, w: roomW, h: roomH };

      // Carve floor for the room
      for (let y = roomY; y < roomY + roomH; y++) {
        for (let x = roomX; x < roomX + roomW; x++) {
          map[y][x] = 1;
        }
      }

      // Connect to previous room
      if (rooms.length > 0) {
        const prev = rooms[rooms.length - 1];
        const x1 = Math.floor(prev.x + prev.w / 2);
        const y1 = Math.floor(prev.y + prev.h / 2);
        const x2 = Math.floor(roomX + roomW / 2);
        const y2 = Math.floor(roomY + roomH / 2);

        // Horizontal tunnel
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          map[y1][x] = 1;
        }

        // Vertical tunnel
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          map[y][x2] = 1;
        }
      }

      rooms.push(newRoom);
    }

    return map;
  }

  findSpawnPoint(map) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 1) {
          return { x, y };
        }
      }
    }
    return { x: 2, y: 2 }; // fallback
  }
}
