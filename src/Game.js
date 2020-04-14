const GamePlay = require('./screens/GamePlay');

class Game {
  constructor(app) {
    this.app = app;
    this.gameStates = {};
    this.state = null;
  }

  /**
   * start game, execute after all assets are loaded
   */
  run() {
    // define available game states
    this.addState('play', new GamePlay(this.app));

    // set initial state
    this.setState('play');

    // start the updates
    this.app.ticker.add(this.update, this);
  }

  /**
   * Add new state
   * @param {String} stateName
   * @param {Object} state new state instance
   */
  addState(stateName, state) {
    this.gameStates[stateName] = state;
    this.app.stage.addChild(state);
  }

  /**
   * Handle game update
   */
  update() {
    if (this.state) {
      this.state.update();
    }
  }

  /**
   * changes current state
   * @param {String} stateName
   * @param {Object} opts additional options passed by previous state
   */
  setState(stateName, opts) {
    let oldState = this.state;

    this.state = null;

    if (oldState) {
      if (!opts.keepVisible) {
        oldState.visible = false;
      }
      oldState.exit(opts);
    }

    let newState = this.gameStates[stateName];

    newState.enter(opts);
    newState.visible = true;

    this.state = newState;
  }
}

module.exports = Game;
