require('./styles/base.scss');

const Board = require('./components/Board');
const Tetromino = require('./components/Tetromino');
const Keyboard = require('./libs/Keyboard');

window.onload = function () {
  const app = new PIXI.Application({
    width: 750,
    height: 750,
    backgroundColor: 0x1099bb,
    resolution: 1,
  });

  app.loader.add('block-empty', 'images/empty.png');
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
    const board = new Board(app.loader.resources);
    const tetronimo = new Tetromino(app.loader.resources);

    app.stage.addChild(board);

    // board.addChild(tetronimo);

    // Game Configs
    const delaySpeed = 1800;
    let startDate = new Date();

    app.ticker.add(() => {
      /*
      const now = new Date();
      const keyPress = Keyboard.getKeyPress();

      if (keyPress === Keyboard.KEYS.KEY_UP) {
        tetronimo.rotate(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_DOWN) {
        tetronimo.rotate(1);
      }

      if (keyPress === Keyboard.KEYS.KEY_LEFT) {
        tetronimo.move(-1);
      }

      if (keyPress === Keyboard.KEYS.KEY_RIGHT) {
        tetronimo.move(1);
      }

      if ((now - startDate) >= delaySpeed) {
        startDate = new Date();

        tetronimo.fall();
      }
      */
    });
  }
};
