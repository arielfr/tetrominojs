const { BOARD_HEIGHT, BOARD_WIDTH } = require('../../constants');
const TetrominoTypes = require('../Tetromino/types');
const Tetromino = require('../Tetromino');

global.PIXI = {
  Container: class Container {
    constructor() {}
    addChild() {}
  },
  Sprite: () => ({
    position: {},
  }),
};

const GameEngine = require('./index');

describe('Board', () => {
  const createEmptyBoard = () => {
    const grid = new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );

    return {
      grid,
      init: () => ({}),
      spawn: () => ({}),
    };
  };

  describe('Movement Logic', () => {
    describe('Can Fall Logic', () => {
      test('Empty Board', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();
      });

      test('Last Element', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: (BOARD_HEIGHT - 1) });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeFalsy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        board.grid[2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();

        board.grid[3] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I });

        board.grid[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeFalsy();
      });

      test('No collision with another column', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        board.grid[1] = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();
      });

      test('Collision one block', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        board.grid[1] = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeFalsy();
      });

      test('Collision one block in another column', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 1 });

        board.grid[1] = [1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();

        board.grid[1] = [1, 1, 0, 0, 0, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeFalsy();
      });

      test('No colission in negative column', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: -2, rotation: 1 });

        board.grid[1] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeTruthy();

        board.grid[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.DOWN)).toBeFalsy();
      });
    });

    describe('Can Move Left Logic', () => {
      test('Collision with border', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeFalsy();
      });

      test('Movement Allowed', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 1 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board.grid[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: -1, rotation: 1 });

        board.grid[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeFalsy();
      });

      test('No collision with another row', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board.grid[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[1] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[2] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeTruthy();
      });

      test('Collision one block', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board.grid[0] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[1] = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[2] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.LEFT)).toBeFalsy();
      });
    });

    describe('Can Move Right Logic', () => {
      test('Collision with border', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 3 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeFalsy();
      });

      test('Movement Allowed', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 4 });

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeTruthy();
      });

      test('Not Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board.grid[0] = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, rotation: 1 });

        board.grid[0] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeFalsy();
      });

      test('No collision with another row', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 1, col: 0, rotation: 1 });

        board.grid[0] = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
        board.grid[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeTruthy();
      });

      test('Collision last block row', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 0, col: 0, rotation: 1 });

        board.grid[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[3] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeFalsy();
      });

      test('Collision first block row', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, row: 0, col: 0, rotation: 1 });

        board.grid[0] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        board.grid[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        board.grid[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.RIGHT)).toBeFalsy();
      });
    });

    describe('Can Rotate Logic', () => {
      test('No collision with top border', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeTruthy();
      });

      test('Collision with bottom border', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0, row: (BOARD_HEIGHT - 1) });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeFalsy();
      });

      test('Rotation Allowed', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeTruthy();
      });

      test('No collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: (BOARD_WIDTH - 1) - 3 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeTruthy();
      });

      test('No Collision with invisible', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board.grid[1] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeTruthy();
      });

      test('Collision', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board.grid[1] = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeFalsy();
      });

      test('No collision with last row', () => {
        const board = createEmptyBoard();
        const ge = new GameEngine({ board });

        //       0              1             2             3
        // [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        const tetromino = new Tetromino({ type: TetrominoTypes.I, col: 0 });

        // Next Rotation
        //       0              1             2             3
        // [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]

        board.grid[3] = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

        expect(ge.canMove(tetromino, ge.MOVEMENT_TYPES.ROTATE)).toBeFalsy();
      });
    });
  });
});
