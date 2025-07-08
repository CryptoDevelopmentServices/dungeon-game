export class SideScrollerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SideScrollerScene' });
  }

  preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('ground', 'assets/ground.png');
  }

  create() {
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 580, 'ground').setScale(2).refreshBody();

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
