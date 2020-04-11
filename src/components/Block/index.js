const { BLOCK_SIZE } = require('../../constants');

/**
 * Black Class
 */
class Block {
  constructor(color, size = BLOCK_SIZE) {
    this.el = this.draw(color, size);
  }

  draw(color, size) {
    const graphics = new PIXI.Graphics();

    graphics.lineStyle(1, 0, 1, 0);
    graphics.beginFill(color, 1);
    graphics.drawRect(0, 0, size, size);

    return graphics;
  }
}

/**
 * Module Export
 * @type {Block}
 */
module.exports = Block;
