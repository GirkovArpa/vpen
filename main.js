import { $, $$ } from '@sciter';
import { localizePath } from './util.js';

// LINUX BUG: with quark it ALWAYS prepends image SRC with "this://app"

main();

function main() {
  loadImages();
  adjustWindow();
  trackCursor();
  openChildWindow();
  showSplash();
}

async function loadImages() {
  $('#hand').style.variable(
    'bg-img',
    `url('${localizePath('images/hand.png')}')`
  );
  $('#arm').style.variable(
    'bg-img',
    `url('${localizePath('images/arm.png')}')`
  );
}

function showSplash() {
  const about = new Window({ url: 'about.html' });
}

function openChildWindow() {
  const child = new Window({ url: 'child.html' });
  child.isResizable = false;
  child.isMinimizable = true;
  child.isMaximizable = false;
}

function adjustWindow() {
  const [w, h] = Window.this.screenBox('frame', 'dimension');
  const x = w / 2 - 500;
  const y = h / 2 - 300;
  Window.this.move(x, y, 1000, 600, true);
  return { width: w, height: h };
}

function trackCursor() {
  setInterval(() => {
    adjustHand();
    adjustArm();
  });
}

function adjustHand() {
  const CURSOR = getCursorPosition();

  $('#hand').style.left = CURSOR.x;
  $('#hand').style.top = CURSOR.y;

  let handDeg = calcHandAngle(CURSOR.x, CURSOR.y);
  handDeg = (handDeg - 45) % 360;
  $(
    '#hand'
  ).style.transform = `translate(-100px, -100px) rotate(${handDeg}deg)`;
}

function adjustArm() {
  const CURSOR = getCursorPosition();

  let angle = calcHandAngle(CURSOR.x, CURSOR.y);
  angle = (angle - 90) % 360;
  angle = 360 - angle;

  const handLength = 600;

  const shift = calcShift(angle, handLength);

  const WRIST = { x: CURSOR.x + shift.x, y: CURSOR.y + shift.y };

  $('#arm').style.left = WRIST.x;
  $('#arm').style.top = WRIST.y;

  let armDeg = calcArmAngle(CURSOR.x, CURSOR.y);
  armDeg = (armDeg - 67) % 360;
  armDeg = 360 - armDeg;
  const transform = `translate(-522px, -474px) rotate(${armDeg}deg)`;
  $('#arm').style.transform = transform;
}

function getCursorPosition() {
  const [cursorX, cursorY] = Window.this.box('position', 'cursor', 'self');
  const CURSOR = { x: cursorX, y: cursorY };
  return CURSOR;
}

/* https://www.statskingdom.com/410multi_linear_regression.html */
function calcHandAngle(x, y) {
  return 45 + x * 0.0292826 - y * 0.078125;
}

function calcArmAngle(x, y) {
  return 90 - 0.0336842 * x;
}

function calcShift(angle, distance) {
  return {
    x: distance * Math.sin(toRadians(angle)),
    y: distance * Math.cos(toRadians(angle)),
  };
}

function toRadians(deg) {
  return deg * (Math.PI / 180);
}
