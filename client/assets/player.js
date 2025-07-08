export class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 150;
    const sprite = this.sprite;

    sprite.setVelocity(0);

    if (this.cursors.left.isDown) {
      sprite.setVelocityX(-speed);
      sprite.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      sprite.setVelocityX(speed);
      sprite.setFlipX(false);
    }

    if (this.cursors.up.isDown) {
      sprite.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      sprite.setVelocityY(speed);
    }
  }
}
