const { BLOCK_SIZE, LINES_HEIGHT, SCORE_HEIGHT, INSTRUCTIONS_WIDTH } = require('../constants');
const BaseScreen = require('./BaseScreen');
const Keyboard = require('../libs/Keyboard');
const GameEngine = require('../components/GameEngine');

class GamePlay extends BaseScreen {
  constructor(app) {
    super();

    this.engine = new GameEngine({ resources: app.loader.resources });

    // Speed of hard fall
    this.startDate = null;

    // Adding Background to Screen
    const background = new PIXI.TilingSprite(
      app.loader.resources.background.texture,
      app.renderer.width,
      app.renderer.height
    );

    this.addChild(background);
    this.addChild(this.engine.lines);
    this.addChild(this.engine.board);
    this.addChild(this.engine.score);
    this.addChild(this.engine.next);
    this.addChild(this.engine.level);
    this.addChild(this.engine.instructions);

    this.engine.instructions.position.x = BLOCK_SIZE;
    this.engine.instructions.position.y = BLOCK_SIZE * 4;

    this.engine.lines.position.x = (BLOCK_SIZE * 3) + (BLOCK_SIZE * INSTRUCTIONS_WIDTH);
    this.engine.lines.position.y = BLOCK_SIZE;

    this.engine.board.position.x = (BLOCK_SIZE * 3) + (BLOCK_SIZE * INSTRUCTIONS_WIDTH);
    this.engine.board.position.y = (this.engine.lines.position.y + (BLOCK_SIZE * LINES_HEIGHT) + (BLOCK_SIZE * 2));

    this.engine.score.position.x = (BLOCK_SIZE * 15) + (BLOCK_SIZE * INSTRUCTIONS_WIDTH);
    this.engine.score.position.y = BLOCK_SIZE;

    this.engine.next.position.x =(BLOCK_SIZE * 15) + (BLOCK_SIZE * INSTRUCTIONS_WIDTH);
    this.engine.next.position.y = this.engine.score.position.y + (BLOCK_SIZE * SCORE_HEIGHT) + (BLOCK_SIZE * 2);

    this.engine.level.position.x = (BLOCK_SIZE * 15) + (BLOCK_SIZE * INSTRUCTIONS_WIDTH);
    this.engine.level.position.y = this.engine.score.position.y + this.engine.next.position.y + (BLOCK_SIZE * SCORE_HEIGHT) + (BLOCK_SIZE * 4);
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

      if ( ((now - this.startDate) >= this.engine.hardFallDelaySpeed) && keyPress === Keyboard.KEYS.KEY_SPACE ) {
        this.startDate = new Date();
        const fusionMade = this.engine.fall();

        if (fusionMade) {
          Keyboard.unblockSpace();
        }
      }else if ((now - this.startDate) >= this.engine.gameSpeed) {
        this.startDate = new Date();

        this.engine.fall();
      }
    }

    this.engine.update();
  }
}

module.exports = GamePlay;
