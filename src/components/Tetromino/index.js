const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');
const { BLOCK_SIZE } = require('../../constants');
const Block = require('../Block');

/**
 * Black Class
 */
class Tetromino extends PIXI.Container {
  constructor(resources) {
    super();

    this.blocks = [];
    this.currRotation = 0;
    this.type = this.getRandomType();

    // Add the for blocks on the same position
    for (let i = 0; i < 4; i++) {
      const block = new Block(resources[this.type.texture].texture, this.type.color, BLOCK_SIZE);
      this.blocks.push(block.el);
      this.addChild(block.el);
    }

    this.draw(this.currRotation);
  }

  getRandomType() {
    const rand = randomBetween(1, 7) - 1;
    return types[Object.keys(types)[rand]];
  }

  move(delta) {
    this.position.set(this.position.x + (BLOCK_SIZE * delta), this.position.y);
  }

  rotate(delta) {
    this.currRotation = this.currRotation + delta;

    const rotation = Math.abs(this.currRotation) % 4;

    this.draw(rotation);
  }

  draw(rotation = 0) {
    const currShape = this.type.shapes[rotation];
    let i = 0;

    for (let x = 0; x < currShape.length; x++) {
      for (let y = 0; y < currShape[x].length; y++) {
        if (currShape[x][y]) {
          this.blocks[i].x = x * BLOCK_SIZE;
          this.blocks[i].y = y * BLOCK_SIZE;
          i++;
        }
      }
    }
  }
}

/**
 * Module Export
 * @type {Tetromino}
 */
module.exports = Tetromino;
