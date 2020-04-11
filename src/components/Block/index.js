const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');
const { BLOCK_SIZE } = require('../../constants');

/**
 * Black Class
 */
class Block extends PIXI.Container {
  constructor() {
    super();

    this.rotation = 0;
    this.type = this.getRandomType();

    this.draw();
  }

  getRandomType() {
    const rand = randomBetween(1, 7) - 1;
    return types[Object.keys(types)[rand]];
  }

  draw() {
    const currShape = this.type.shapes[this.rotation];

    for (let i = 0; i < currShape.length; i++) {
      for (let j = 0; j < currShape[i].length; j++) {
        if (currShape[i][j]) {
          const graphics = new PIXI.Graphics();

          graphics.lineStyle(1, 0, 1, 0);
          graphics.beginFill(this.type.color, 1);
          graphics.drawRect(BLOCK_SIZE * j, BLOCK_SIZE * i, BLOCK_SIZE, BLOCK_SIZE);

          this.addChild(graphics);
        }
      }
    }
  }
}

/**
 * Module Export
 * @type {Block}
 */
module.exports = Block;
