require('./styles/base.scss');

const Tetromino = require('./components/Tetromino');
const Keyboard = require('./libs/Keyboard');

window.onload = function () {
  const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: 1,
  });

  document.getElementById('game').appendChild(app.view);

  // When all the assets are loaded start the game
  app.loader.onComplete.add(startGame);

  // Start the application
  app.loader.load();

  function startGame () {
    const block = new Tetromino();

    app.stage.addChild(block);

    app.ticker.add(() => {
      const keyPress = Keyboard.getKeyPress();

      if (keyPress === Keyboard.KEYS.KEY_UP) {
        block.rotate(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_DOWN) {
        block.rotate(1);
      }

      if (keyPress === Keyboard.KEYS.KEY_LEFT) {
        block.move(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_RIGHT) {
        block.move(1);
      }
    });
  }
};
