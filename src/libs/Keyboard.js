/**
 * Keyboard handler
 */
class Keyboard {
  constructor() {
    this.key = null;

    this.addEvents();
  }

  addEvents () {
    window.addEventListener('keydown', (event) => {
      if (this.key === null) {
        this.key = event.keyCode;
      }
    });

    window.addEventListener('keyup', (event) => {
      this.key = null;
    });

    return this;
  }

  getKeyPress() {
    const keyPress = this.key;

    // Once you get the key, remove it
    this.key = null;

    return keyPress;
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
module.exports.KEYS = {
  KEY_DOWN: 40,
  KEY_UP: 38,
  KEY_LEFT: 37,
  KEY_RIGHT: 39,
  KEY_SPACE: 32,
};
