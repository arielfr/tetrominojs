const { BOARD_HEIGHT, BOARD_WIDTH } = require('../../constants');
const Tetromino = require('../Tetromino');
const Board = require('../Board');
const Score = require('../Score');
const Next = require('../Next');
const Level = require('../Level');
const Lines = require('../Lines');

class GameEngine {
  constructor({ board, resources }) {
    this.board = board || new Board({ resources });
    this.score = new Score({ resources });
    this.next = new Next({ resources });
    this.level = new Level({ resources });
    this.lines = new Lines({ resources });

    this.gameOver = false;
    this.gameOverStartDate = new Date();
    this.gameOverDelaySpeed = 50;
    this.gameOverAnimationActive = true;

    this.gameSpeed = 1000;
    this.hardFallDelaySpeed = 50;

    this.MOVEMENT_TYPES = {
      ROTATE: 'ROTATE',
      RIGHT: 'RIGHT',
      LEFT: 'LEFT',
      DOWN: 'DOWN',
    };

    this.currTetromino = new Tetromino({});
    this.tetrominos = [];

    for (let i = 0; i < 5; i++) {
      this.tetrominos.push(new Tetromino({}));
    }

    // Spawn First Tetromino
    this.board.spawn(this.currTetromino);

    // Update Next Tetromino
    this.next.addTetromino(this.tetrominos[0]);
  }

  canMove(tetromino, type) {
    let shape = tetromino.shape;
    let startRowLoop = tetromino.row;
    let endRowLoop = (tetromino.row + (shape.length - 1));
    let startColLoop = tetromino.col;
    let endColLoop = (tetromino.col + (shape.length - 1));

    if (type === this.MOVEMENT_TYPES.DOWN) {
      // Start row is going to be the last
      startRowLoop = startRowLoop + 1;
      endRowLoop = endRowLoop + 1;
    }

    if (type === this.MOVEMENT_TYPES.LEFT) {
      startColLoop = startColLoop - 1;
      endColLoop = endColLoop - 1;
    }

    if (type === this.MOVEMENT_TYPES.RIGHT) {
      startColLoop = startColLoop + 1;
      endColLoop = endColLoop + 1;
    }

    if (type === this.MOVEMENT_TYPES.ROTATE) {
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
            if (this.board.grid[row][col] && shape[shapeRow][shapeColumn]) {
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
  }

  fall() {
    let fusionMade = false;

    if (this.currTetromino && this.canMove(this.currTetromino, 'DOWN')) {
      this.currTetromino.fall();
    } else {
      this.fusion();
      fusionMade = true;
    }

    return fusionMade;
  }

  move(delta) {
    if (this.currTetromino) {
      if (delta === -1) {
        if (this.canMove(this.currTetromino, 'LEFT')) {
          this.currTetromino.move(delta);
        }
      } else {
        if (this.canMove(this.currTetromino, 'RIGHT')) {
          this.currTetromino.move(delta);
        }
      }
    }
  }

  rotate(delta) {
    if (this.canMove(this.currTetromino, 'ROTATE')) {
      this.currTetromino.rotate(delta);
    }
  }

  fusion() {
    // Merge the Tetromino with the board
    this.board.merge(this.currTetromino);

    const current = this.tetrominos.splice(0, 1);
    this.tetrominos.push(new Tetromino({}));
    this.currTetromino = current[0];

    const lines = this.checkForLines();

    this.score.calculate(this.level.number, lines);
    this.lines.increase(lines);

    if (lines !== 0 && this.lines.number % 10 === 0) {
      this.level.increase();
      this.gameSpeed = this.gameSpeed - 50;
    }

    this.board.spawn(this.currTetromino);

    // Update Next Tetromino
    this.next.addTetromino(this.tetrominos[0]);

    // If you can't move the spawn element is game over
    if (!this.canMove(this.currTetromino)) {
      this.gameOver = true;
      console.log('GAME OVER');
    }
  }

  checkForLines() {
    const fullLines = [];

    for (let row = 0; row < this.board.grid.length; row++) {
      let line = true;

      for (let column = 0; column < this.board.grid[row].length; column++) {
        if (!this.board.grid[row][column]) {
          line = false;
        }
      }

      if (line) {
        fullLines.push(row);
      }
    }

    const newBoard = this.board.grid.slice();

    for (let row = 0; row < fullLines.length; row++) {
      newBoard.splice(fullLines[row] - row, 1);
    }

    for (let i = 0; i < fullLines.length; i++) {
      newBoard.unshift(new Array(BOARD_WIDTH).fill(0));
    }

    this.board.grid = newBoard;

    return fullLines.length;
  }

  update() {
    if (this.gameOver) {
      if (this.gameOverAnimationActive) {
        const now = new Date();

        if ((now - this.gameOverStartDate) >= this.gameOverDelaySpeed) {
          const rowComplete = this.board.completeEmptyRowWithRandomBlocks();
          this.gameOverStartDate = new Date();

          if (rowComplete === 0) {
            this.gameOverAnimationActive = false;
          }
        }
      }
    } else {
      this.board.update(this.currTetromino);
    }
  }
}

module.exports = GameEngine;
