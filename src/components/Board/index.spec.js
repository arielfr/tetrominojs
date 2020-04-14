const { BOARD_HEIGHT, BOARD_WIDTH } = require('../../constants');
const TetrominoTypes = require('../Tetromino/types');
const Tetromino = require('../Tetromino');

describe('Board', () => {

  const createEmptyBoard = () => {
    const board = [];

    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row = [];

      for (let i = 0; i < BOARD_WIDTH; i++) {
        row.push(0);
      }

      board.push(row);
    }

    return board;
  };

  const canFall = (board, tetromino) => {
    const currShape = tetromino.type.shapes[tetromino.currRotation];

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

    const nextRow = (tetromino.row + 1);

    if ( nextRow + rowLastHit >= BOARD_HEIGHT ) {
      return false;
    }

    let canFall = true;
    let rowCheck = 0;

    for (let row = nextRow; row <= (nextRow + rowLastHit); row++) {
      let colCheck = 0;

      for (let col = tetromino.col; col < (tetromino.col + tetromino.type.size); col++) {
        if (board[row][col] && currShape[rowCheck][colCheck]) {
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
  };

  describe('Can Fall Logic', () => {
    test('Empty Board', () => {
      const board = createEmptyBoard();
      const tetromino = new Tetromino({ type: TetrominoTypes.I });

      expect(canFall(board, tetromino)).toBeTruthy();
    });

    test('Last Element', () => {
      const board = createEmptyBoard();
      const tetromino = new Tetromino({ type: TetrominoTypes.I });

      expect(canFall(board, tetromino)).toBeTruthy();
    });
  });
});
