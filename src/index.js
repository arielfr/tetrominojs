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

  app.loader.add('block-i', 'images/I.png');
  app.loader.add('block-j', 'images/J.png');
  app.loader.add('block-l', 'images/L.png');
  app.loader.add('block-o', 'images/O.png');
  app.loader.add('block-s', 'images/S.png');
  app.loader.add('block-t', 'images/T.png');
  app.loader.add('block-z', 'images/Z.png');

  document.getElementById('game').appendChild(app.view);

  // When all the assets are loaded start the game
  app.loader.onComplete.add(startGame);

  // Start the application
  app.loader.load();

  function startGame () {
    const block = new Tetromino(app.loader.resources);

    app.stage.addChild(block);

    // Game Configs
    const delaySpeed = 1800;
    let startDate = new Date();

    app.ticker.add(() => {
      const now = new Date();
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

      if ((now - startDate) >= delaySpeed) {
        startDate = new Date();

        block.fall();
      }
    });
  }
};
