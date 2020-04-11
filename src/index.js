require('./styles/base.scss');

const Block = require('./components/Block');

window.onload = function () {
  const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: 1,
  });

  document.getElementById('game').appendChild(app.view);

  const block = new Block();

  console.log(app.stage.addChild(block))
};
