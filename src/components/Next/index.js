const { BLOCK_SIZE, NEXT_WIDTH, NEXT_HEIGHT, FONT_SIZE, FONT_FAMILY } = require('../../constants');
const Block = require('../Block');

class Next extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.title = 'NEXT';
    this.padding = 5;
    this.titleEl = null;
    this.tetromino = null;

    this.createGraphicalContainer();

    this.addTitle();
  }

  createGraphicalContainer() {
    const maxHeight = (NEXT_HEIGHT + 1);
    const maxWidth = (NEXT_WIDTH + 1);

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

    title.position.x = (BLOCK_SIZE * (NEXT_WIDTH - 2)) - (title.width / 2);
    title.position.y = BLOCK_SIZE + this.padding;

    this.titleEl = title;

    this.addChild(title);
  }

  addTetromino(tetromino) {
    if (this.tetromino) {
      this.removeChild(this.tetromino);
    }

    const container = new PIXI.Container();
    const shape = tetromino.shape;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        let rowBlock;

        if (shape[row][col]) {
          rowBlock = new Block(this.res[tetromino.type.texture].texture, BLOCK_SIZE);

          // Modify Position
          rowBlock.el.position.x = col * BLOCK_SIZE;
          rowBlock.el.position.y = row * BLOCK_SIZE;

          container.addChild(rowBlock.el);
        }
      }
    }

    container.position.x = (BLOCK_SIZE * (NEXT_WIDTH - 2)) - (container.width / 2);
    container.position.y = (BLOCK_SIZE * (NEXT_HEIGHT - 2)) - (container.height / 2) + (this.titleEl.height) + this.padding;

    this.tetromino = container;

    this.addChild(this.tetromino);
  }

}

module.exports = Next;
