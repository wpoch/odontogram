export const FACE_ORDER = ["S", "I", "D", "Z", "C"];

export const FACE_LABELS = {
  S: "Cara superior",
  I: "Cara inferior",
  D: "Cara distal",
  Z: "Cara mesial",
  C: "Cara central",
  X: "Pieza completa",
};

export const TOOTH_SHELL_PATH =
  "M3.2 3.2 Q10 -0.6 16.8 3.2 Q20.6 10 16.8 16.8 Q10 20.6 3.2 16.8 Q-0.6 10 3.2 3.2 Z";

export const FACE_PATHS = {
  S: "M3.2 3.2 Q10 0.8 16.8 3.2 L13.8 7.2 Q10 6.1 6.2 7.2 Z",
  D: "M16.8 3.2 Q19.4 10 16.8 16.8 L13.8 12.8 Q14.9 10 13.8 7.2 Z",
  I: "M6.2 12.8 Q10 13.9 13.8 12.8 L16.8 16.8 Q10 19.2 3.2 16.8 Z",
  Z: "M3.2 3.2 L6.2 7.2 Q5.1 10 6.2 12.8 L3.2 16.8 Q0.6 10 3.2 3.2 Z",
  C: "M6.2 7.2 Q10 6.1 13.8 7.2 Q14.9 10 13.8 12.8 Q10 13.9 6.2 12.8 Q5.1 10 6.2 7.2 Z",
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
