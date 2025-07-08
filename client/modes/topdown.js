import { Player } from '../entities/player.js';

export class TopDownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TopDownScene' });
  }

  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');
    
    const floorLayer = map.createLayer('Floor', tileset, 0, 0);
    const wallLayer = map.createLayer('Walls', tileset, 0, 0);
    wallLayer.setCollisionByProperty({ collides: true });

    this.player = new Player(this, 100, 100);
    this.physics.add.collider(this.player.sprite, wallLayer);
  }

  update() {
    this.player.update();
  }
}
