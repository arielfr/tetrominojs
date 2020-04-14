const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const Block = require('../Block');

class Board extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.grid = this.createEmptyBoard();
    this.visibleGrid = this.createEmptyBoard();
  }

  createEmptyBoard() {
    return new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );
  }

  init() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        const block = new Block(this.res['block-empty'].texture, BLOCK_SIZE);

        // Modify Position
        block.el.position.x = column * BLOCK_SIZE;
        block.el.position.y = row * BLOCK_SIZE;

        this.visibleGrid[row][column] = block.el;
        this.addChild(block.el);
      }
    }
  }

  spawn(tetromino) {
    this.update(tetromino);
  }

  merge(tetromino) {
    this.grid = this.getGridWithTetromino(tetromino);
  }

  update(tetromino) {
    this.draw(
      this.getGridWithTetromino(tetromino)
    );
  }

  getGridWithTetromino(tetromino) {
    const tempBoard = this.createEmptyBoard();

    let tetromRow = 0;

    for (let row = 0; row < this.grid.length; row++) {
      let tetromCol = (tetromino.col < 0) ? Math.abs(tetromino.col) : 0;
      let found = false;

      for (let column = 0; column < this.grid[row].length; column++) {
        if (
          row >= tetromino.row && row < (tetromino.row + tetromino.type.size) &&
          column >= tetromino.col && column < (tetromino.col + tetromino.type.size)
        ) {
          if ( tetromino.type.shapes[tetromino.currRotation][tetromRow][tetromCol] ) {
            tempBoard[row][column] = tetromino.type.texture;
          } else {
            tempBoard[row][column] = this.grid[row][column];
          }
          found = true;
        } else {
          tempBoard[row][column] = this.grid[row][column];
        }

        if (found) tetromCol++;
      }

      if (found) tetromRow++;
    }

    return tempBoard
  }

  draw(board) {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        if (board[row][column] !== 0) {
          this.visibleGrid[row][column].texture = this.res[board[row][column]].texture;
        } else {
          this.visibleGrid[row][column].texture = this.grid[row][column] ? this.visibleGrid[row][column].texture : this.res['block-empty'].texture;
        }
      }
    }
  }
}

module.exports = Board;
