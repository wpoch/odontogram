import { useState } from "react";
import { FACE_LABELS, FACE_ORDER, FACE_POLYGONS } from "../lib/odontogramLayout";

const FACE_STROKE = "#215374";

const polygonPointMap = Object.fromEntries(
  Object.entries(FACE_POLYGONS).map(([face, points]) => [
    face,
    points.map(([x, y]) => `${x},${y}`).join(" "),
  ]),
);

function makeHoverPayload(toothId, face) {
  return {
    toothId,
    face,
  };
}

export default function Tooth({
  tooth,
  appliedFaces,
  onApplyTreatment,
  onHoverChange,
  isTreatmentSelected,
}) {
  const [hoveredFace, setHoveredFace] = useState(null);

  const resolveFill = (face) => {
    if (hoveredFace === face) {
      return "#ffe4ae";
    }

    return appliedFaces.has(face) ? "#d64545" : "#fdfefe";
  };

  const textColor =
    hoveredFace === "X"
      ? "#cb7b00"
      : appliedFaces.has("X")
      ? "#d64545"
      : FACE_STROKE;

  const handleMouseEnter = (face) => {
    setHoveredFace(face);
    onHoverChange?.(makeHoverPayload(tooth.id, face));
  };

  const handleMouseLeave = () => {
    setHoveredFace(null);
    onHoverChange?.(null);
  };

  const handleKeyDown = (event, face) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onApplyTreatment(tooth.id, face);
  };

  return (
    <g transform={`translate(${tooth.x},${tooth.y})`}>
      {FACE_ORDER.map((face) => (
        <polygon
          key={`${tooth.id}-${face}`}
          className={`tooth-face ${
            isTreatmentSelected ? "tooth-face--ready" : "tooth-face--idle"
          }`}
          points={polygonPointMap[face]}
          fill={resolveFill(face)}
          stroke={FACE_STROKE}
          strokeWidth={0.5}
          tabIndex={0}
          role="button"
          aria-label={`Pieza ${tooth.id}, ${FACE_LABELS[face]}`}
          onClick={() => onApplyTreatment(tooth.id, face)}
          onKeyDown={(event) => handleKeyDown(event, face)}
          onMouseEnter={() => handleMouseEnter(face)}
          onMouseLeave={handleMouseLeave}
          onFocus={() => handleMouseEnter(face)}
          onBlur={handleMouseLeave}
        >
          <title>
            P{tooth.id} - {FACE_LABELS[face]}
          </title>
        </polygon>
      ))}
      <text
        className={`tooth-label ${
          isTreatmentSelected ? "tooth-label--ready" : "tooth-label--idle"
        }`}
        x={6}
        y={30}
        fill={textColor}
        stroke={textColor}
        strokeWidth={0.1}
        role="button"
        tabIndex={0}
        aria-label={`Pieza ${tooth.id}, ${FACE_LABELS.X}`}
        onClick={() => onApplyTreatment(tooth.id, "X")}
        onKeyDown={(event) => handleKeyDown(event, "X")}
        onMouseEnter={() => handleMouseEnter("X")}
        onMouseLeave={handleMouseLeave}
        onFocus={() => handleMouseEnter("X")}
        onBlur={handleMouseLeave}
      >
        {tooth.id}
      </text>
    </g>
  );
}
