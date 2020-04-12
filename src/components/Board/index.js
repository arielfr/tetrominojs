const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const Block = require('../Block');

class Board extends PIXI.Container {
  constructor(resources) {
    super();

    this.res = resources;

    this.board = new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );

    this.boardEl = new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );

    this.init(resources);
  }

  init(resources) {
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        const block = new Block(resources['block-empty'].texture, BLOCK_SIZE);

        // Modify Position
        block.el.position.x = column * BLOCK_SIZE;
        block.el.position.y = row * BLOCK_SIZE;

        this.boardEl[row][column] = block.el;
        this.addChild(block.el);
      }
    }
  }

  add(tetromino) {
    const tempBoard = new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );

    let tetromRow = 0;

    for (let row = 0; row < this.board.length; row++) {
      let tetromCol = (tetromino.col < 0) ? Math.abs(tetromino.col) : 0;
      let found = false;

      for (let column = 0; column < this.board[row].length; column++) {
        if (
          row >= tetromino.row && row < (tetromino.row + tetromino.type.size) &&
          column >= tetromino.col && column < (tetromino.col + tetromino.type.size)
        ) {
          if ( tetromino.type.shapes[tetromino.currRotation][tetromRow][tetromCol] ) {
            tempBoard[row][column] = tetromino.type.texture;
          }
          found = true;
        } else {
          tempBoard[row][column] = this.board[row][column];
        }

        if (found) tetromCol++;
      }

      if (found) tetromRow++;
    }

    this.update(tempBoard);
  }

  update(board) {
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (board[row][column] !== 0) {
          this.boardEl[row][column].texture = this.res[board[row][column]].texture;
        } else {
          this.boardEl[row][column].texture = this.res['block-empty'].texture;
        }
      }
    }
  }
}

module.exports = Board;
