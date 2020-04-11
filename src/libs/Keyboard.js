/**
 * Keyboard handler
 */
class Keyboard {
  constructor() {
    this.keys = {};
  }

  addEvents () {
    window.addEventListener('keydown', (event) => {
      this.keys[event.keyCode] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.keys[event.keyCode] = false;
    });

    return this;
  }

  getKeys() {
    return this.keys;
  }

  isKeyPress(keyCode) {
    return this.getKeys()[keyCode];
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
