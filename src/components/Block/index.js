const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');

/**
 * Black Class
 */
class Block extends PIXI.Container {
  constructor() {
    super();

    const rand = randomBetween(1, 7);

    console.log(Object.keys(types)[rand])

    this.draw();
  }

  draw() {
    const graphics = new PIXI.Graphics();

    graphics.lineStyle(1, 0, 1, 0);
    graphics.beginFill(0xFFAFF00, 1);
    graphics.drawRect(0, 0, 32, 32);

    this.addChild(graphics);
  }
}

/**
 * Module Export
 * @type {Block}
 */
module.exports = Block;
