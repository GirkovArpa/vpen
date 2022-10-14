import { home } from '@env';
import { calcHandAngle, calcArmAngle, calcShift } from 'math.js';

export class Application extends Element {
  constructor() {
    super();

    this.adjustWindow();
    const child = new Window({ url: 'tablet/main.htm' });
    child.isResizable = false;
    child.isMaximizable = false;
  }

  adjustWindow() {
    const [width, height] = Window.this.screenBox('frame', 'dimension');
    const x = width / 2 - 500;
    const y = height / 2 - 300;
    Window.this.move(x, y, 1000, 600, true);
    return { width, height };
  }

  getCursorPosition() {
    const [x, y] = Window.this.box('position', 'cursor', 'self');
    return { x, y };
  }

  adjustArm() {
    const cursor = this.getCursorPosition();

    let angle = calcHandAngle(cursor.x, cursor.y);
    angle = (angle - 90) % 360;
    angle = 360 - angle;

    const handLength = 600;

    const shift = calcShift(angle, handLength);

    const WRIST = { x: cursor.x + shift.x, y: cursor.y + shift.y };

    this.$('#arm').style.left = WRIST.x;
    this.$('#arm').style.top = WRIST.y;

    let armDeg = calcArmAngle(cursor.x, cursor.y);
    armDeg = (armDeg - 67) % 360;
    armDeg = 360 - armDeg;
    const transform = `translate(-522px, -474px) rotate(${armDeg}deg)`;
    this.$('#arm').style.transform = transform;
  }

  adjustHand() {
    const cursor = this.getCursorPosition();

    this.$('#hand').style.left = cursor.x;
    this.$('#hand').style.top = cursor.y;

    let handDeg = calcHandAngle(cursor.x, cursor.y);
    handDeg = (handDeg - 45) % 360;
    this.$('#hand').style.transform = `translate(-100px, -100px) rotate(${handDeg}deg)`;
  }

  componentDidMount() {
    this.$('#arm').style.backgroundImage = `url("${home(['images/arm.png'])}")`;
    this.$('#hand').style.backgroundImage = `url("${home(['images/hand.png'])}")`;

    setInterval(() => {
      this.adjustHand();
      this.adjustArm();
    });
  }

  render() {
    return <body styleset={__DIR__ + 'main.css#body'}>
      <img id="arm" />
      <img id="hand" />
    </body>
  }
}