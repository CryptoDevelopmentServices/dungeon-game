import { TopDownScene } from './modes/topdown.js';
import { SideScrollerScene } from './modes/sidescroller.js';

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'topdown'; // `?mode=sidescroller` to switch

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  scene: mode === 'topdown' ? TopDownScene : SideScrollerScene,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: mode === 'sidescroller' ? { y: 500 } : { y: 0 },
      debug: false
    }
  }
};

new Phaser.Game(config);
