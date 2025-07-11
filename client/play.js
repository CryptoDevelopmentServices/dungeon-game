import { TopDownScene } from './modes/topdown.js';
// import { SideScrollerScene } from './modes/sidescroller.js'; // when ready

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: mode === "topdown" ? TopDownScene : undefined,
};

const game = new Phaser.Game(config);
