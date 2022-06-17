import { $, $$ } from '@sciter';
import { localizePath } from './util.js';

main();

function main() {
  loadImages();
  const WINDOW = adjustWindow();
  trackCursor(WINDOW);
}

async function loadImages() {
  $('#hand').style.variable(
    'bg-img',
    `url('${localizePath('images/hand2.png')}')`
  );
  $('#tablet').style.variable(
    'bg-img',
    `url('${localizePath('images/tablet.png')}')`
  );
}

function adjustWindow() {
  const [w, h] = Window.this.screenBox('frame', 'dimension');
  const x = w / 2 - 500;
  const y = h / 2 - 300;
  Window.this.move(x, y, 1000, 600, true);
  return { width: w, height: h };
}

function trackCursor(WINDOW) {
  setInterval(() => {
    adjustHand(WINDOW);
  });
}

function adjustHand(WINDOW) {
  const CURSOR = getCursorPosition();

  const top = scale(CURSOR.y, 0, WINDOW.height, 350, 600);
  $('#hand').style.top = top;

  let left = WINDOW.width - CURSOR.x;
  left = scale(left, 0, WINDOW.width, 160, 860);

  let adjustment = 0;

  adjustment = (40 * CURSOR.y) / WINDOW.height;

  const distanceFromCenter = Math.abs(WINDOW.width / 2 - CURSOR.x);
  const fractionFromCenter = (distanceFromCenter / WINDOW.width) * 2;

  adjustment *= fractionFromCenter;

  if (CURSOR.x < WINDOW.width / 2) {
    adjustment = -adjustment;
  }

  left += adjustment;

  $('#hand').style.left = left;

  let rotation = 15 * (1 - CURSOR.x / WINDOW.width);

  $(
    '#hand'
  ).style.transform = `translate(-150px, -300px) rotate(${rotation}deg)`;
}

function getCursorPosition() {
  const [cursorX, cursorY] = Window.this.box('position', 'cursor', 'desktop');
  const CURSOR = { x: cursorX, y: cursorY };
  return CURSOR;
}

function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
