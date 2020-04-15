const BaseScreen = require('./BaseScreen');
const Keyboard = require('../libs/Keyboard');
const GameEngine = require('../components/GameEngine');

class GamePlay extends BaseScreen {
  constructor(app) {
    super();

    this.engine = new GameEngine({ resources: app.loader.resources });

    this.delaySpeed = 300;
    // Speed of hard fall
    this.hardFallDelaySpeed = 50;
    this.startDate = null;

    // Adding Background to Screen
    const background = new PIXI.TilingSprite(
      app.loader.resources.background.texture,
      app.renderer.width,
      app.renderer.height);

    this.addChild(background);
    this.addChild(this.engine.board);

    this.engine.board.position.x = Math.ceil(160);
    this.engine.board.position.y = Math.ceil(32);
  }

  /**
   * When the Game enter this screen set the startDate for preventing missing frames
   */
  enter() {
    this.startDate = new Date();
  }

  update() {
    if (!this.engine.gameOver) {
      const now = new Date();
      const keyPress = Keyboard.getKeyPress();

      if (keyPress === Keyboard.KEYS.KEY_UP) {
        this.engine.rotate(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_DOWN) {
        this.engine.rotate(1);
      }

      if (keyPress === Keyboard.KEYS.KEY_LEFT) {
        this.engine.move(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_RIGHT) {
        this.engine.move(1);
      }

      if ( ((now - this.startDate) >= this.hardFallDelaySpeed) && keyPress === Keyboard.KEYS.KEY_SPACE ) {
        this.startDate = new Date();
        const fusionMade = this.engine.fall();

        if (fusionMade) {
          Keyboard.unblockSpace();
        }
      }else if ((now - this.startDate) >= this.delaySpeed) {
        this.startDate = new Date();

        this.engine.fall();
      }

      this.engine.update();
    }
  }
}

module.exports = GamePlay;
