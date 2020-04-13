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
    if (this.currTetromino && this.canRotate(delta)) {
      this.currTetromino.rotate(delta);
    }
  }

  fall() {
    if (this.currTetromino && this.canFall()) {
      this.currTetromino.fall();
    } else {
      this.fusion();
    }
  }

  canFall() {
    const currShape = this.currTetromino.type.shapes[this.currTetromino.currRotation];

    // Last row with value
    let rowLastHit = null;

    for (let row = currShape.length - 1; row >= 0; row--) {
      for (let col = 0; col < currShape[row].length; col++) {
        if (currShape[row][col]) {
          rowLastHit = row;
          break;
        }
      }

      if (rowLastHit !== null) break;
    }

    const nextRow = (this.currTetromino.row + 1);

    if ( nextRow + rowLastHit >= BOARD_HEIGHT ) {
      return false;
    }

    let canFall = true;
    let rowCheck = 0;

    for (let row = nextRow; row <= (nextRow + rowLastHit); row++) {
      let colCheck = 0;

      for (let col = this.currTetromino.col; col < (this.currTetromino.col + this.currTetromino.type.size); col++) {
        if (this.board[row][col] && currShape[rowCheck][colCheck]) {
          canFall = false;
          break;
        }

        colCheck++;
      }

      if (!canFall) {
        break;
      }

      rowCheck++;
    }

    return canFall;
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

    let canMove = true;

    if (!( this.currTetromino.col >= (0 - colFirstHit + 1) )) {
      return false;
    }

    let rowCheck = 0;

    for (let row = this.currTetromino.row; (row < (this.currTetromino.row + currShape.length) && row < BOARD_HEIGHT); row++) {
      let colCheck = 0;

      for (let col = (this.currTetromino.col - 1); col < (this.currTetromino.col + this.currTetromino.type.size - 1); col++) {
        if (this.board[row][col] && currShape[rowCheck][colCheck]) {
          canMove = false;
          break;
        }

        colCheck++;
      }

      if (!canMove) {
        break;
      }

      rowCheck++;
    }

    return canMove;
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

    let canMove = true;

    if (!( (this.currTetromino.col + 1 + colLastHit) < BOARD_WIDTH)) {
      return false;
    }

    let rowCheck = 0;

    for (let row = this.currTetromino.row; (row < (this.currTetromino.row + currShape.length) && row < BOARD_HEIGHT); row++) {
      let colCheck = 0;

      for (let col = this.currTetromino.col + 1; col < (this.currTetromino.col + this.currTetromino.type.size + 1); col++) {
        if (this.board[row][col] && currShape[rowCheck][colCheck]) {
          canMove = false;
          break;
        }

        colCheck++;
      }

      if (!canMove) {
        break;
      }

      rowCheck++;
    }

    return canMove;
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

    if (!( (this.currTetromino.col >= (0 - colFirstHit)) && ( (this.currTetromino.col + colLastHit) < BOARD_WIDTH) )) {
      return false;
    }

    let canMove = true;

    let rowCheck = 0;

    for (let row = this.currTetromino.row; (row < (this.currTetromino.row + currShape.length) && row < BOARD_HEIGHT); row++) {
      let colCheck = 0;

      for (let col = this.currTetromino.col; col < (this.currTetromino.col + this.currTetromino.type.size); col++) {
        if (this.board[row][col] && currShape[rowCheck][colCheck]) {
          canMove = false;
          break;
        }

        colCheck++;
      }

      if (!canMove) {
        break;
      }

      rowCheck++;
    }

    return canMove;
  }

  fusion() {
    this.board = this.getNewBoard();

    this.checkForLines();

    this.spawn();
  }

  checkForLines() {
    const fullLines = [];

    for (let row = 0; row < this.board.length; row++) {
      let line = true;

      for (let column = 0; column < this.board[row].length; column++) {
        if (!this.board[row][column]) {
          line = false;
        }
      }

      if (line) {
        fullLines.push(row);
      }
    }

    const newBoard = this.board.slice();

    for (let row = 0; row < fullLines.length; row++) {
      newBoard.splice(fullLines[row] - row, 1);
    }

    for (let i = 0; i < fullLines.length; i++) {
      newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
    }

    this.board = newBoard;
  }

  update() {
    this.draw(this.getNewBoard());
  }

  getNewBoard() {
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
          } else {
            tempBoard[row][column] = this.board[row][column];
          }
          found = true;
        } else {
          tempBoard[row][column] = this.board[row][column];
        }

        if (found) tetromCol++;
      }

      if (found) tetromRow++;
    }

    return tempBoard
  }

  draw(board) {
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (board[row][column] !== 0) {
          this.boardEl[row][column].texture = this.res[board[row][column]].texture;
        } else {
          this.boardEl[row][column].texture = this.board[row][column] ? this.boardEl[row][column].texture : this.res['block-empty'].texture;
        }
      }
    }
  }
}

module.exports = Board;
