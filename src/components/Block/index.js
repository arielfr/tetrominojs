const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');

/**
 * Black Class
 */
class Block extends PIXI.Container {
  constructor() {
    super();

    this.type = this.getRandomType();

    this.draw();
  }

  getRandomType() {
    const rand = randomBetween(1, 7) - 1;
    return Object.keys(types)[rand];
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
