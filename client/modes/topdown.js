export class TopDownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TopDownScene' });
  }

  preload() {
    this.load.image('player', 'assets/player.png');
  }

  create() {
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) this.player.setVelocityX(-160);
    if (this.cursors.right.isDown) this.player.setVelocityX(160);
    if (this.cursors.up.isDown) this.player.setVelocityY(-160);
    if (this.cursors.down.isDown) this.player.setVelocityY(160);
  }
}
