class BaseScreen extends PIXI.Container {
  constructor() {
    super();

    this.visible = false;
  }

  enter(opts) {};

  exit(opts) {};
}

module.exports = BaseScreen;
