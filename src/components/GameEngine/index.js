const { BOARD_HEIGHT, BOARD_WIDTH } = require('../../constants');

class GameEngine {
  constructor(board) {
    this.board = board;
  }

  canFall(tetromino) {
    return this.canMove(this.board, tetromino, tetromino.shape, 'DOWN');
  }

  canMove(tetromino, shape, type) {
    let startRowLoop = tetromino.row;
    let endRowLoop = (tetromino.row + (shape.length - 1));
    let startColLoop = tetromino.col;
    let stopColLoop = (tetromino.col + shape.length);

    if (type === 'DOWN') {
      // Start row is going to be the last
      startRowLoop = startRowLoop + 1;
      endRowLoop = endRowLoop + 1;

      if (endRowLoop === (BOARD_HEIGHT + (shape.length - 1))) {
        return false;
      }
    }

    let moveAllowed = true;
    let shapeRow = 0;

    for (let row = startRowLoop; row < endRowLoop; row++) {
      // Maybe some pieces of Tetromino are out of the board (invisible)
      if ( row < BOARD_HEIGHT ) {
        let shapeColumn = 0;

        for (let col = startColLoop; col < stopColLoop; col++) {
          // Maybe some pieces of Tetromino are out of the board (invisible)
          if (col >= 0 ) {
            if (this.board[row][col] && shape[shapeRow][shapeColumn]) {
              moveAllowed = false;
              break;
            }
          }
          shapeColumn++;
        }
      }

      // If the movement is already restricted break the loop
      if (!moveAllowed) {
        break;
      }

      shapeRow++;
    }

    return moveAllowed;
  }
}

module.exports = GameEngine;
