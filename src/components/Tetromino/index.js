const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');

/**
 * Tetromino Class
 */
class Tetromino {
  constructor() {
    this.blocks = [];
    this.realRotation = 0;
    this.currRotation = 0;
    this.type = this.getRandomType();

    this.row = 0;
    this.col = 0;
  }

  getRandomType() {
    const rand = randomBetween(1, 7) - 1;
    return types[Object.keys(types)[rand]];
  }

  move(delta) {
    this.col = this.col + delta;
  }

  fall() {
    this.row++;
  }

  nextRotation(delta) {
    const rotation = Math.abs(this.realRotation + delta) % 4;
    return rotation;
  }

  rotate(delta) {
    this.realRotation = this.realRotation + delta;
    const rotation = Math.abs(this.realRotation) % 4;
    this.currRotation = rotation;
  }
}

/**
 * Module Export
 * @type {Tetromino}
 */
module.exports = Tetromino;
