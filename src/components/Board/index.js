const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const Block = require('../Block');

class Board extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.grid = this.createEmptyBoard();
    this.boardEl = this.createEmptyBoard();

    this.currTetromino = null;
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row = [];

      for (let i = 0; i < BOARD_WIDTH; i++) {
        row.push(0);
      }

      board.push(row);
    }

    return board;
  }

  init() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        const block = new Block(this.res['block-empty'].texture, BLOCK_SIZE);

        // Modify Position
        block.el.position.x = column * BLOCK_SIZE;
        block.el.position.y = row * BLOCK_SIZE;

        this.boardEl[row][column] = block.el;
        this.addChild(block.el);
      }
    }
  }

  spawn(tetromino) {
    this.currTetromino = tetromino;
    this.update();
  }

  merge() {
    this.grid = this.getNewBoard();
  }

  update() {
    this.draw(this.getNewBoard());
  }

  getNewBoard() {
    const tempBoard = this.createEmptyBoard();

    let tetromRow = 0;

    for (let row = 0; row < this.grid.length; row++) {
      let tetromCol = (this.currTetromino.col < 0) ? Math.abs(this.currTetromino.col) : 0;
      let found = false;

      for (let column = 0; column < this.grid[row].length; column++) {
        if (
          row >= this.currTetromino.row && row < (this.currTetromino.row + this.currTetromino.type.size) &&
          column >= this.currTetromino.col && column < (this.currTetromino.col + this.currTetromino.type.size)
        ) {
          if ( this.currTetromino.type.shapes[this.currTetromino.currRotation][tetromRow][tetromCol] ) {
            tempBoard[row][column] = this.currTetromino.type.texture;
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
          this.boardEl[row][column].texture = this.res[board[row][column]].texture;
        } else {
          this.boardEl[row][column].texture = this.grid[row][column] ? this.boardEl[row][column].texture : this.res['block-empty'].texture;
        }
      }
    }
  }
}

module.exports = Board;
