const { BOARD_WIDTH } = require('../../constants');
const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');

/**
 * Tetromino Class
 */
class Tetromino {
  constructor({ row, col, type, rotation }) {
    this.blocks = [];
    this.currRotation = (rotation !== undefined) ? rotation : 0;
    this.realRotation = this.currRotation;
    this.type = type || this.getRandomType();

    this.row = (row !== undefined) ? row : 0;
    this.col = (col !== undefined) ? col : Math.ceil(((BOARD_WIDTH - 1) / 2) - (this.type.size / 2));
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
