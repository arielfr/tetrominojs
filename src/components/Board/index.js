const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const Block = require('../Block');
const Tetromino = require('../Tetromino');

class Board extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.board = this.createEmptyBoard();
    this.boardEl = this.createEmptyBoard();

    this.currTetromino = null;
    this.tetrominos = [];

    for (let i = 0; i < 5; i++) {
      this.tetrominos.push(new Tetromino({}));
    }
    this.init(resources);
    this.spawn();
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
    if (this.canSpawn()) {
      const current = this.tetrominos.splice(0, 1);
      this.tetrominos.push(new Tetromino({}));
      this.currTetromino = current[0];
    } else {
      // Game Over
    }

    this.update();
  }

  canMove(board, tetromino, type) {
    let shape = tetromino.shape;
    let startRowLoop = tetromino.row;
    let endRowLoop = (tetromino.row + (shape.length - 1));
    let startColLoop = tetromino.col;
    let endColLoop = (tetromino.col + shape.length);

    if (type === 'DOWN') {
      // Start row is going to be the last
      startRowLoop = startRowLoop + 1;
      endRowLoop = endRowLoop + 1;
    }

    if (type === 'LEFT') {
      startColLoop = startColLoop - 1;
      endColLoop = endColLoop - 1;
    }

    if (type === 'RIGHT') {
      startColLoop = startColLoop + 1;
      endColLoop = endColLoop + 1;
    }

    if (type === 'ROTATE') {
      shape = tetromino.type.shapes[tetromino.nextRotation(1)];
    }

    let moveAllowed = true;
    let shapeRow = 0;

    for (let row = startRowLoop; row <= endRowLoop; row++) {
      let shapeColumn = 0;

      for (let col = startColLoop; col <= endColLoop; col++) {
        // Maybe some pieces of Tetromino are out of the board (invisible)
        if (row <= (BOARD_HEIGHT - 1)) {
          // Maybe some pieces of Tetromino are out of the board (invisible)
          if (col >= 0 && col <= (BOARD_WIDTH - 1)) {
            if (board[row][col] && shape[shapeRow][shapeColumn]) {
              moveAllowed = false;
              break;
            }
          } else {
            // Check Tetromino with shape get out of the Board
            if (shape[shapeRow][shapeColumn]) {
              moveAllowed = false;
            }
          }
        } else {
          // Check if one of the pieces of the Tetromino are going to be outside the Board
          if (shape[shapeRow][shapeColumn]) {
            moveAllowed = false;
          }
        }

        shapeColumn++;
      }


      // If the movement is already restricted break the loop
      if (!moveAllowed) {
        break;
      }

      shapeRow++;
    }

    return moveAllowed;
  };

  move(delta) {
    if (this.currTetromino) {
      if (delta === -1) {
        if (this.canMove(this.board, this.currTetromino, 'LEFT')) {
          this.currTetromino.move(delta);
        }
      } else {
        if (this.canMove(this.board, this.currTetromino, 'RIGHT')) {
          this.currTetromino.move(delta);
        }
      }
    }
  }

  rotate(delta) {
    if (this.canMove(this.board, this.currTetromino, 'ROTATE')) {
      this.currTetromino.rotate(delta);
    }
  }

  fall() {
    if (this.currTetromino && this.canMove(this.board, this.currTetromino, 'DOWN')) {
      this.currTetromino.fall();
    } else {
      this.fusion();
    }
  }

  canSpawn() {
    const currTetromino = this.tetrominos[0];
    const currShape = currTetromino.type.shapes[currTetromino.currRotation];

    let canSpawn = true;

    let rowCheck = 0;

    for (let row = currTetromino.row; (row < (currTetromino.row + currShape.length) && row < BOARD_HEIGHT); row++) {
      let colCheck = 0;

      for (let col = currTetromino.col; col < (currTetromino.col + currTetromino.type.size); col++) {
        if (this.board[row][col] && currShape[rowCheck][colCheck]) {
          canSpawn = false;
          break;
        }

        colCheck++;
      }

      if (!canSpawn) {
        break;
      }

      rowCheck++;
    }

    return canSpawn;
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
    const tempBoard = this.createEmptyBoard();

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
