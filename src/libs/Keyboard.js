const KEYS = {
  KEY_DOWN: 40,
  KEY_UP: 38,
  KEY_LEFT: 37,
  KEY_RIGHT: 39,
  KEY_SPACE: 32,
};

/**
 * Keyboard handler
 */
class Keyboard {
  constructor() {
    this.key = null;
    this.blockSpace = false;

    this.addEvents();
  }

  addEvents () {
    window.addEventListener('keydown', (event) => {
      if (this.key === null) {
        if (event.keyCode !== KEYS.KEY_SPACE) {
          this.key = event.keyCode;
        } else if (!this.blockSpace) {
          this.key = event.keyCode;
        }
      }
    });

    window.addEventListener('keyup', (event) => {
      this.key = null;

      if (event.keyCode === KEYS.KEY_SPACE) {
        this.blockSpace = false;
      }
    });

    return this;
  }

  getKeyPress() {
    const keyPress = this.key;

    // Don't remove the space key
    if (keyPress !== KEYS.KEY_SPACE) {
      // Once you get the key, remove it
      this.key = null;
    }

    return keyPress;
  }

  unblockSpace() {
    this.key = null;
    this.blockSpace = true;
  }
}

/**
 * Default Export
 * @type {Keyboard}
 */
module.exports = new Keyboard();

/**
 * Key Map
 */
module.exports.KEYS = KEYS;
