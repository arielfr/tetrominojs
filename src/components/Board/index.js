const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const Block = require('../Block');
const Tetromino = require('../Tetromino');

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

    this.currTetromino = null;

    this.init(resources);
    this.spawn();
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

  spawn() {
    this.currTetromino = new Tetromino(this.res);
    this.update();
  }

  move(delta) {
    if (this.currTetromino) {
      if (delta === -1) {
        if (this.canMoveLeft()) {
          this.currTetromino.move(delta);
        }
      } else {
        if (this.canMoveRight()) {
          this.currTetromino.move(delta);
        }
      }
    }
  }

  rotate(delta) {
    if (this.currTetromino) {
      if (this.canRotate(delta)) {
        this.currTetromino.rotate(delta);
      }
    }
  }

  fall() {
    if (this.currTetromino) {
      this.currTetromino.fall();
    }
  }

  canMoveLeft() {
    const currShape = this.currTetromino.type.shapes[this.currTetromino.currRotation];

    let colFirstHit = null;

    for (let row = 0; row < currShape.length; row++) {
      for (let col = 0; col < currShape[row].length; col++) {
        if (colFirstHit === null && currShape[row][col]) {
          colFirstHit = col;
          break;
        } else if (currShape[row][col] && col < colFirstHit) {
          colFirstHit = col;
        }
      }
    }

    if ( this.currTetromino.col >= (0 - colFirstHit + 1) ) {
      return true;
    } else{
      return false;
    }
  }

  canMoveRight() {
    const currShape = this.currTetromino.type.shapes[this.currTetromino.currRotation];

    let colLastHit = null;

    for (let row = 0; row < currShape.length; row++) {
      for (let col = currShape[row].length; col >= 0; col--) {
        if (colLastHit === null && currShape[row][col]) {
          colLastHit = col;
          break;
        } else if (currShape[row][col] && col > colLastHit) {
          colLastHit = col;
        }
      }
    }

    if ( (this.currTetromino.col + 1 + colLastHit) < BOARD_WIDTH) {
      return true;
    } else{
      return false;
    }
  }

  canRotate(delta) {
    const nextRotation = this.currTetromino.nextRotation(delta);
    const currShape = this.currTetromino.type.shapes[nextRotation];

    let colFirstHit = null;
    let colLastHit = null;

    for (let row = 0; row < currShape.length; row++) {
      for (let col = 0; col < currShape[row].length; col++) {
        if (colFirstHit === null && currShape[row][col]) {
          colFirstHit = col;
        } else if (currShape[row][col] && col < colFirstHit) {
          colFirstHit = col;
        }

        if (colLastHit === null && currShape[row][col]) {
          colLastHit = col;
        } else if (currShape[row][col] && col > colLastHit) {
          colLastHit = col;
        }
      }
    }

    if ( (this.currTetromino.col >= (0 - colFirstHit)) && ( (this.currTetromino.col + colLastHit) < BOARD_WIDTH) ) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    const tempBoard = new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );

    let tetromRow = 0;

    for (let row = 0; row < this.board.length; row++) {
      let tetromCol = (this.currTetromino.col < 0) ? Math.abs(this.currTetromino.col) : 0;
      let found = false;

      for (let column = 0; column < this.board[row].length; column++) {
        if (
          row >= this.currTetromino.row && row < (this.currTetromino.row + this.currTetromino.type.size) &&
          column >= this.currTetromino.col && column < (this.currTetromino.col + this.currTetromino.type.size)
        ) {
          if ( this.currTetromino.type.shapes[this.currTetromino.currRotation][tetromRow][tetromCol] ) {
            tempBoard[row][column] = this.currTetromino.type.texture;
          }
          found = true;
        } else {
          tempBoard[row][column] = this.board[row][column];
        }

        if (found) tetromCol++;
      }

      if (found) tetromRow++;
    }

    this.draw(tempBoard);
  }

  draw(board) {
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
