export function calcHandAngle(x, y) {
  return 45 + x * 0.0292826 - y * 0.078125;
}

export function calcArmAngle(x, y) {
  return 90 - 0.0336842 * x;
}

export function calcShift(angle, distance) {
  return {
    x: distance * Math.sin(toRadians(angle)),
    y: distance * Math.cos(toRadians(angle)),
  };
}

export function toRadians(deg) {
  return deg * (Math.PI / 180);
}
