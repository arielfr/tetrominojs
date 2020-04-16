const { BLOCK_SIZE, LEVEL_WIDTH, LEVEL_HEIGHT, FONT_SIZE, FONT_FAMILY } = require('../../constants');
const Block = require('../Block');

class Level extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.title = 'LEVEL';
    this.number = 0;
    this.padding = 5;

    this.levelEl = null;

    this.createGraphicalContainer();

    this.addTitle();
    this.addLevel();
  }

  createGraphicalContainer() {
    const maxHeight = (LEVEL_HEIGHT + 1);
    const maxWidth = (LEVEL_WIDTH + 1);

    for (let row = 0; row <= maxHeight; row++) {
      for (let column = 0; column <= maxWidth; column++) {
        if ((row === 0 || row === maxHeight) || (column === 0 || column === maxWidth)) {
          let rowBlock = new Block(this.res['score-border'].texture, BLOCK_SIZE);

          if (row === 0 && column === 0) {
            rowBlock.el.texture = this.res['board-corner'].texture;
          } else if (row === 0 && column === maxWidth) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.x = 1;
            rowBlock.el.scale.x *= -1;
          } else if (row === maxHeight && column === 0) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.y = 1;
            rowBlock.el.scale.y *= -1;
          } else if (row === maxHeight && column === maxWidth) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.x = 1;
            rowBlock.el.scale.x *= -1;
            rowBlock.el.anchor.y = 1;
            rowBlock.el.scale.y *= -1;
          } else if (row === maxHeight) {
            rowBlock.el.angle = -90;
            rowBlock.el.pivot.set(BLOCK_SIZE, 0);
          } else if (row === 0) {
            rowBlock.el.angle = 90;
            rowBlock.el.pivot.set(0, BLOCK_SIZE);
          } else if (column === maxWidth) {
            rowBlock.el.anchor.x = 1;
            rowBlock.el.scale.x *= -1;
          }

          // Modify Position
          rowBlock.el.position.x = column * BLOCK_SIZE;
          rowBlock.el.position.y = row * BLOCK_SIZE;

          this.addChild(rowBlock.el);
        } else {
          let rowBlock = new Block(this.res['block-empty'].texture, BLOCK_SIZE);

          // Modify Position
          rowBlock.el.position.x = column * BLOCK_SIZE;
          rowBlock.el.position.y = row * BLOCK_SIZE;

          this.addChild(rowBlock.el);
        }
      }
    }
  }

  addTitle() {
    let title = new PIXI.Text(this.title, {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    title.position.x = BLOCK_SIZE + this.padding;
    title.position.y = BLOCK_SIZE + this.padding;

    this.addChild(title);
  }

  addLevel() {
    let score = new PIXI.Text(`${this.number}`, {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    score.anchor.set(1, 0);

    score.position.x = (BLOCK_SIZE * LEVEL_WIDTH) + BLOCK_SIZE - this.padding;
    score.position.y = (BLOCK_SIZE * 2) + this.padding;

    this.levelEl = score;

    this.addChild(score);
  }

  increase() {
    this.number = this.number + 1;
    this.levelEl.text = this.number;
  }
}

module.exports = Level;
