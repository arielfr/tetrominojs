const { BLOCK_SIZE } = require('../../constants');

/**
 * Black Class
 */
class Block {
  constructor(texture, size = BLOCK_SIZE) {
    this.el = this.draw(texture, size);
  }

  draw(texture, size) {
    const sprite = new PIXI.Sprite(texture);

    sprite.position.x = 0;
    sprite.position.y = 0;

    sprite.width = size;
    sprite.height = size;

    return sprite;
  }
}

/**
 * Module Export
 * @type {Block}
 */
module.exports = Block;
