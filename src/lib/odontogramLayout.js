export const FACE_ORDER = ["S", "I", "D", "Z", "C"];

export const FACE_POLYGONS = {
  S: [
    [0, 0],
    [20, 0],
    [15, 5],
    [5, 5],
  ],
  I: [
    [5, 15],
    [15, 15],
    [20, 20],
    [0, 20],
  ],
  D: [
    [15, 5],
    [20, 0],
    [20, 20],
    [15, 15],
  ],
  Z: [
    [0, 0],
    [5, 5],
    [5, 15],
    [0, 20],
  ],
  C: [
    [5, 5],
    [15, 5],
    [15, 15],
    [5, 15],
  ],
};

function pushTeeth(target, count, idFactory, xFactory, y) {
  for (let i = 0; i < count; i += 1) {
    target.push({
      id: idFactory(i),
      x: xFactory(i),
      y,
    });
  }
}

export function buildTeethLayout() {
  const teeth = [];

  // Left side
  pushTeeth(teeth, 8, (i) => 18 - i, (i) => i * 25, 0);
  pushTeeth(teeth, 5, (i) => 52 - i, (i) => (i + 3) * 25, 40);
  pushTeeth(teeth, 5, (i) => 82 - i, (i) => (i + 3) * 25, 80);
  pushTeeth(teeth, 8, (i) => 48 - i, (i) => i * 25, 120);

  // Right side
  pushTeeth(teeth, 8, (i) => 21 + i, (i) => 210 + i * 25, 0);
  pushTeeth(teeth, 5, (i) => 61 + i, (i) => 210 + i * 25, 40);
  pushTeeth(teeth, 5, (i) => 71 + i, (i) => 210 + i * 25, 80);
  pushTeeth(teeth, 8, (i) => 31 + i, (i) => 210 + i * 25, 120);

  return teeth;
}
