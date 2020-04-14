require('./styles/base.scss');

const Game = require('./Game');

window.onload = function () {
  const app = new PIXI.Application({
    width: 400,
    height: 700,
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
    const game = new Game(app);

    game.run();
  }
};
