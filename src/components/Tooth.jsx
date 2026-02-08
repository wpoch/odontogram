import { useMemo, useState } from "react";
import { FACE_ORDER, FACE_POLYGONS } from "../lib/odontogramLayout";

const FACE_STROKE = "#1f3f7a";

function pointsToString(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function Tooth({ tooth, appliedFaces, onApplyTreatment }) {
  const [hoveredFace, setHoveredFace] = useState(null);

  const polygonPointMap = useMemo(() => {
    const map = {};
    for (const [face, points] of Object.entries(FACE_POLYGONS)) {
      map[face] = pointsToString(points);
    }
    return map;
  }, []);

  const resolveFill = (face) => {
    if (hoveredFace === face) {
      return "#ffe38b";
    }

    return appliedFaces.has(face) ? "#cc2020" : "#ffffff";
  };

  const textColor =
    hoveredFace === "X"
      ? "#d97706"
      : appliedFaces.has("X")
      ? "#cc2020"
      : FACE_STROKE;

  return (
    <g transform={`translate(${tooth.x},${tooth.y})`}>
      {FACE_ORDER.map((face) => (
        <polygon
          key={`${tooth.id}-${face}`}
          className="tooth-face"
          points={polygonPointMap[face]}
          fill={resolveFill(face)}
          stroke={FACE_STROKE}
          strokeWidth={0.5}
          onClick={() => onApplyTreatment(tooth.id, face)}
          onMouseEnter={() => setHoveredFace(face)}
          onMouseLeave={() => setHoveredFace(null)}
        />
      ))}
      <text
        className="tooth-label"
        x={6}
        y={30}
        fill={textColor}
        stroke={textColor}
        strokeWidth={0.1}
        onClick={() => onApplyTreatment(tooth.id, "X")}
        onMouseEnter={() => setHoveredFace("X")}
        onMouseLeave={() => setHoveredFace(null)}
      >
        {tooth.id}
      </text>
    </g>
  );
}
