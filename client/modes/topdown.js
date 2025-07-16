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
    const tileset = map.addTilesetImage('tiles', null, tileSize, tileSize, 0, 0);
    const layer = map.createLayer(0, tileset, 0, 0);

    layer.setCollisionBetween(0, 0); // Only tile 0 = wall is solid

    // === Spawn player ===
    const spawn = this.findSpawnPoint();
    this.player = new Player(this, spawn.x * tileSize + tileSize / 2, spawn.y * tileSize + tileSize / 2);
    this.physics.add.collider(this.player.sprite, layer);

    // === Spawn coins ===
    this.coins = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
      const pos = this.getRandomFloorTile(levelData);
      const coin = this.coins.create(pos.x * tileSize + tileSize / 2, pos.y * tileSize + tileSize / 2, 'coin');
      coin.setScale(0.8);
    }

    // === Spawn enemies ===
    this.enemies = this.physics.add.group();
    for (let i = 0; i < 3; i++) {
      const pos = this.getRandomFloorTile(levelData);
      const enemy = this.enemies.create(pos.x * tileSize + tileSize / 2, pos.y * tileSize + tileSize / 2, 'enemy');
      enemy.setCollideWorldBounds(true);
    }
  }

  update() {
    this.player.update();
  }

  generateDungeon(width, height) {
    const map = Array.from({ length: height }, () => Array(width).fill(0));

    const rooms = [];
    const roomCount = 8;
    const maxTries = 50;
    let tries = 0;

    while (rooms.length < roomCount && tries < maxTries) {
      const roomW = Phaser.Math.Between(6, 10);
      const roomH = Phaser.Math.Between(6, 10);
      const roomX = Phaser.Math.Between(1, width - roomW - 2);
      const roomY = Phaser.Math.Between(1, height - roomH - 2);
      const newRoom = { x: roomX, y: roomY, w: roomW, h: roomH };

      // Check for overlap
      let overlaps = false;
      for (const room of rooms) {
        if (
          roomX <= room.x + room.w + 1 &&
          roomX + roomW + 1 >= room.x &&
          roomY <= room.y + room.h + 1 &&
          roomY + roomH + 1 >= room.y
        ) {
          overlaps = true;
          break;
        }
      }

      if (overlaps) {
        tries++;
        continue;
      }

      // Carve room
      for (let y = roomY; y < roomY + roomH; y++) {
        for (let x = roomX; x < roomX + roomW; x++) {
          map[y][x] = Phaser.Math.RND.pick([1, 2, 3]);
        }
      }

      if (rooms.length > 0) {
        const prev = rooms[Phaser.Math.Between(0, rooms.length - 1)];
        const x1 = Math.floor(prev.x + prev.w / 2);
        const y1 = Math.floor(prev.y + prev.h / 2);
        const x2 = Math.floor(newRoom.x + newRoom.w / 2);
        const y2 = Math.floor(newRoom.y + newRoom.h / 2);

        if (Math.random() < 0.5) {
          this.createHallway(map, x1, y1, x2, y1);
          this.createHallway(map, x2, y1, x2, y2);
        } else {
          this.createHallway(map, x1, y1, x1, y2);
          this.createHallway(map, x1, y2, x2, y2);
        }
      }

      rooms.push(newRoom);
      tries = 0;
    }

    this.spawnRoom = rooms[0];
    return map;
  }

  createHallway(map, x1, y1, x2, y2) {
    const floorTile = 1;

    if (x1 === x2) {
      // Vertical
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        map[y][x1] = floorTile;
        if (x1 + 1 < map[0].length) map[y][x1 + 1] = floorTile;
      }
    } else if (y1 === y2) {
      // Horizontal
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        map[y1][x] = floorTile;
        if (y1 + 1 < map.length) map[y1 + 1][x] = floorTile;
      }
    }
  }

  findSpawnPoint() {
    const room = this.spawnRoom;
    const centerX = Math.floor(room.x + room.w / 2);
    const centerY = Math.floor(room.y + room.h / 2);
    return { x: centerX, y: centerY };
  }

  getRandomFloorTile(map) {
    const valid = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] >= 1 && map[y][x] <= 3) valid.push({ x, y });
      }
    }
    return Phaser.Utils.Array.GetRandom(valid);
  }
}
