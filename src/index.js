require('./styles/base.scss');

const Game = require('./Game');

window.onload = function () {
  const app = new PIXI.Application({
    width: 1024,
    height: 864,
    backgroundColor: 0x000000,
    resolution: 1,
  });

  app.loader.add('background', 'images/screen/background.png');
  app.loader.add('board-border', 'images/screen/board-border.png');
  app.loader.add('board-corner', 'images/screen/board-corner.png');
  app.loader.add('score-border', 'images/screen/score-border.png');
  app.loader.add('score-corner', 'images/screen/score-corner.png');
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
    const game = new Game(app);

    game.run();
  }
};
