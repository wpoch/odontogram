import { useState } from "react";
import {
  FACE_LABELS,
  FACE_ORDER,
  FACE_PATHS,
  TOOTH_SHELL_PATH,
} from "../lib/odontogramLayout";

const FACE_STROKE = "#1e5b7f";
const FACE_FILL = {
  idle: "url(#tooth-face-idle)",
  hover: "url(#tooth-face-hover)",
  applied: "url(#tooth-face-applied)",
};

const LABEL_THEME = {
  idle: {
    fill: "rgba(249, 253, 255, 0.95)",
    stroke: "rgba(30, 91, 127, 0.55)",
    text: "#1e5b7f",
  },
  hover: {
    fill: "rgba(255, 239, 201, 0.95)",
    stroke: "rgba(188, 126, 32, 0.62)",
    text: "#a06400",
  },
  applied: {
    fill: "rgba(222, 71, 83, 0.9)",
    stroke: "rgba(140, 29, 36, 0.7)",
    text: "#fff9fb",
  },
};

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
      return FACE_FILL.hover;
    }

    return appliedFaces.has(face) ? FACE_FILL.applied : FACE_FILL.idle;
  };

  const resolveLabelTheme = () => {
    if (hoveredFace === "X") {
      return LABEL_THEME.hover;
    }

    if (appliedFaces.has("X")) {
      return LABEL_THEME.applied;
    }

    return LABEL_THEME.idle;
  };

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

  const labelTheme = resolveLabelTheme();

  return (
    <g className="tooth-unit" transform={`translate(${tooth.x},${tooth.y})`}>
      <path
        className="tooth-shell"
        d={TOOTH_SHELL_PATH}
        fill="url(#tooth-shell-gradient)"
        filter="url(#tooth-drop-shadow)"
      />
      {FACE_ORDER.map((face) => (
        <path
          key={`${tooth.id}-${face}`}
          className={`tooth-face ${
            isTreatmentSelected ? "tooth-face--ready" : "tooth-face--idle"
          }`}
          d={FACE_PATHS[face]}
          fill={resolveFill(face)}
          stroke={FACE_STROKE}
          strokeWidth={0.42}
          strokeLinejoin="round"
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
        </path>
      ))}
      <path
        className="tooth-groove"
        d="M6.2 7.2 Q10 9 13.8 7.2 M6.2 12.8 Q10 11 13.8 12.8"
      />

      <g
        className={`tooth-label-hitbox ${
          isTreatmentSelected ? "tooth-label-hitbox--ready" : "tooth-label-hitbox--idle"
        }`}
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
        <rect
          x={2.8}
          y={22.2}
          width={14.4}
          height={5.2}
          rx={2.6}
          fill={labelTheme.fill}
          stroke={labelTheme.stroke}
          strokeWidth={0.4}
        />
        <text
          className="tooth-label-text"
          x={10}
          y={25.8}
          fill={labelTheme.text}
          textAnchor="middle"
        >
          {tooth.id}
        </text>
      </g>
    </g>
  );
}
