const { BLOCK_SIZE, INSTRUCTIONS_WIDTH, INSTRUCTIONS_HEIGHT, FONT_SIZE, FONT_FAMILY } = require('../../constants');
const Block = require('../Block');

class Next extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.padding = 5;

    this.createGraphicalContainer();

    this.addInstructions();
  }

  createGraphicalContainer() {
    const maxHeight = (INSTRUCTIONS_HEIGHT + 1);
    const maxWidth = (INSTRUCTIONS_WIDTH + 1);

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

  addInstructions() {
    let title = new PIXI.Text('KEYS', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    title.position.x = (BLOCK_SIZE * (INSTRUCTIONS_WIDTH - 3)) - (title.width / 2);
    title.position.y = BLOCK_SIZE + this.padding;

    let upDown = new PIXI.Text('UP/DOWN', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    upDown.position.x = BLOCK_SIZE + this.padding;
    upDown.position.y = title.position.y + title.height + (this.padding * 4);

    let upDownValue = new PIXI.Text('ROTATE', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    upDownValue.anchor.set(1, 0);

    upDownValue.position.x = (BLOCK_SIZE * INSTRUCTIONS_WIDTH) + BLOCK_SIZE - this.padding;
    upDownValue.position.y = upDown.position.y + upDown.height + this.padding;

    let leftRight = new PIXI.Text('LEFT/RIGHT', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    leftRight.position.x = BLOCK_SIZE + this.padding;
    leftRight.position.y = upDownValue.position.y + upDownValue.height + (this.padding * 4);

    let leftRightValue = new PIXI.Text('MOVE', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    leftRightValue.anchor.set(1, 0);

    leftRightValue.position.x = (BLOCK_SIZE * INSTRUCTIONS_WIDTH) + BLOCK_SIZE - this.padding;
    leftRightValue.position.y = leftRight.position.y + leftRight.height + this.padding;

    let space = new PIXI.Text('SPACE', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    space.position.x = BLOCK_SIZE + this.padding;
    space.position.y = leftRightValue.position.y + leftRightValue.height + (this.padding * 4);

    let spaceValue = new PIXI.Text('FALL', {
      fontFamily: FONT_FAMILY,
      fontSize: `${FONT_SIZE}px`,
      align: 'right',
      fill: '#ffffff',
    });

    spaceValue.anchor.set(1, 0);

    spaceValue.position.x = (BLOCK_SIZE * INSTRUCTIONS_WIDTH) + BLOCK_SIZE - this.padding;
    spaceValue.position.y = space.position.y + space.height + this.padding;

    this.addChild(title);
    this.addChild(upDown);
    this.addChild(upDownValue);
    this.addChild(leftRight);
    this.addChild(leftRightValue);
    this.addChild(space);
    this.addChild(spaceValue);
  }
}

module.exports = Next;
