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
    return canMove(board, tetromino, 'DOWN');
  };

  const canMoveLeft = (board, tetromino) => {
    return canMove(board, tetromino, 'LEFT');
  };

  const canMoveRight = (board, tetromino) => {
    return canMove(board, tetromino, 'RIGHT');
  };

  const canRotate = (board, tetromino) => {
    return canMove(board, tetromino, 'ROTATE');
  };

  const canMove = (board, tetromino, type) => {
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
        if (row < (BOARD_HEIGHT - 1)) {
          // Maybe some pieces of Tetromino are out of the board (invisible)
          if (col >= 0 && col < (BOARD_WIDTH - 1)) {
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

  describe('Movement Logic', () => {
    describe('Can Fall Logic', () => {
      test('Empty Board', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        expect(canFall(board, tetromino)).toBeTruthy();
      });

      test('Last Element', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: (BOARD_HEIGHT - 1) });

        expect(canFall(board, tetromino)).toBeFalsy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        board[2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeTruthy();

        board[3] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        board[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeFalsy();
      });

      test('No collision with another column', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        board[1] = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeTruthy();
      });

      test('Collision one block', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        board[1] = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeFalsy();
      });

      test('Collision one block in another column', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 1 });

        board[1] = [1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeTruthy();

        board[1] = [1, 1, 0, 0, 0, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeFalsy();
      });

      test('No colission in negative column', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: -2, rotation: 1 });

        board[1] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeTruthy();

        board[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(canFall(board, tetromino)).toBeFalsy();
      });
    });

    describe('Can Move Left Logic', () => {
      test('Collision with border', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        expect(canMoveLeft(board, tetromino)).toBeFalsy();
      });

      test('Movement Allowed', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 1 });

        expect(canMoveLeft(board, tetromino)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        expect(canMoveLeft(board, tetromino)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(canMoveLeft(board, tetromino)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: -1, rotation: 1 });

        board[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(canMoveLeft(board, tetromino)).toBeFalsy();
      });

      test('No collision with another row', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(canMoveLeft(board, tetromino)).toBeTruthy();
      });

      test('Collision one block', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(canMoveLeft(board, tetromino)).toBeFalsy();
      });
    });

    describe('Can Move Right Logic', () => {
      test('Collision with border', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 4 });

        expect(canMoveRight(board, tetromino)).toBeFalsy();
      });

      test('Movement Allowed', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        expect(canMoveRight(board, tetromino)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 5 });

        expect(canMoveRight(board, tetromino)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board[0] = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        expect(canMoveRight(board, tetromino)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board[0] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        expect(canMoveRight(board, tetromino)).toBeFalsy();
      });

      test('No collision with another row', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board[0] = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(canMoveRight(board, tetromino)).toBeTruthy();
      });

      test('Collision last block row', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 0, col: 0, rotation: 1 });

        board[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[3] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

        expect(canMoveRight(board, tetromino)).toBeFalsy();
      });

      test('Collision first block row', () => {
        const board = createEmptyBoard();
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 0, col: 0, rotation: 1 });

        board[0] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        board[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(canMoveRight(board, tetromino)).toBeFalsy();
      });
    });

    describe('Can Rotate Logic', () => {
      test('No collision with top border', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(canRotate(board, tetromino)).toBeTruthy();
      });

      test('Collision with bottom border', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, row: (BOARD_HEIGHT - 1) });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(canRotate(board, tetromino)).toBeFalsy();
      });

      test('Rotation Allowed', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(canRotate(board, tetromino)).toBeTruthy();
      });

      test('No collision with invisible', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 3 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(canRotate(board, tetromino)).toBeTruthy();
      });

      test('No Collision with invisible', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board[1] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

        expect(canRotate(board, tetromino)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board[1] = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

        expect(canRotate(board, tetromino)).toBeFalsy();
      });

      test('No collision with last row', () => {
        const board = createEmptyBoard();

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board[3] = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

        expect(canRotate(board, tetromino)).toBeFalsy();
      });
    });
  });
});
