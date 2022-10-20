import { home } from '@env';
import { scale } from 'math.js';

export class Application extends Element {
  window = this.adjustWindow();

  constructor() {
    super();
    Window.this.on('size', () => {
      const [width, height] = Window.this.box('dimension', 'client');
      const window = { width, height };
      this.componentUpdate({ window });
    });
    Window.this.on('statechange', () => {
      const [width, height] = Window.this.box('dimension', 'client');
      const window = { width, height };
      this.componentUpdate({ window });
    });
  }

  componentDidMount() {
    this.$('#hand').style.backgroundImage = `url("${home(['images/hand2.png'])}")`;
    this.$('#tablet').style.backgroundImage = `url("${home(['images/tablet.png'])}")`;

    setInterval(() => this.adjustHand());
  }

  adjustWindow() {
    const [width, height] = Window.this.screenBox('frame', 'dimension');
    const x = width / 2 - 500;
    const y = height / 2 - 300;
    Window.this.move(x, y, 1000, 600, true);
    return { width, height };
  }

  getCursorPosition() {
    const [x, y] = Window.this.box('position', 'cursor', 'monitor');
    return { x, y };
  }

  adjustHand() {
    const cursor = this.getCursorPosition();

    //const [x, y, width, height] = Window.this.screenBox('frame', 'xywh', true);
    //const desktop = { x, y, width, height };

    const top = scale(cursor.y, 0, this.window.height, 350, 600);
    this.$('#hand').style.top = top;

    let left = this.window.width - cursor.x;
    left = scale(left, 0, this.window.width, 40 + 130, 860 - 130);

    let adjustment = (40 * cursor.y) / this.window.height;

    const distanceFromCenter = Math.abs(this.window.width / 2 - cursor.x);
    const fractionFromCenter = (distanceFromCenter / this.window.width) * 2;

    adjustment *= fractionFromCenter;
    if (cursor.x < this.window.width / 2) {
      adjustment = -adjustment;
    }

    left += adjustment;

    this.$('#hand').style.left = left;

    let rotation = 15 * (1 - cursor.x / this.window.width);
    this.$('#hand').style.transform = `translate(0, -300px) rotate(${rotation}deg)`;
  }

  render() {
    return <body styleset={__DIR__ + "main.css#body"}>
      <img id="hand" />
      <img id="tablet" />
    </body>;
  }
}