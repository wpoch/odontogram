import { useMemo, useState } from "react";
import Tooth from "./Tooth";
import { FACE_LABELS } from "../lib/odontogramLayout";

function buildAppliedFacesByTooth(appliedTreatments) {
  const facesByTooth = new Map();

  for (const item of appliedTreatments) {
    if (!facesByTooth.has(item.toothId)) {
      facesByTooth.set(item.toothId, new Set());
    }

    facesByTooth.get(item.toothId).add(item.face);
  }

  return facesByTooth;
}

export default function Odontogram({
  teeth,
  appliedTreatments,
  selectedTreatment,
  onApplyTreatment,
}) {
  const appliedFacesByTooth = useMemo(
    () => buildAppliedFacesByTooth(appliedTreatments),
    [appliedTreatments],
  );
  const [hoveredArea, setHoveredArea] = useState(null);

  return (
    <section className="odontogram-shell">
      <div className="odontogram-head">
        <h2>Odontograma</h2>
        <p>
          Haga clic en una cara o en el n&uacute;mero de pieza para aplicar el
          tratamiento activo.
        </p>
      </div>

      <div className="legend-row" aria-label="Leyenda de estados">
        <span className="legend-item">
          <i className="legend-dot legend-dot--idle" />
          Sin tratamiento
        </span>
        <span className="legend-item">
          <i className="legend-dot legend-dot--hover" />
          Zona en foco
        </span>
        <span className="legend-item">
          <i className="legend-dot legend-dot--applied" />
          Tratamiento aplicado
        </span>
      </div>

      <div className="odontogram-hint" role="status" aria-live="polite">
        {hoveredArea
          ? `P${hoveredArea.toothId} · ${
              FACE_LABELS[hoveredArea.face] ?? hoveredArea.face
            }`
          : selectedTreatment
          ? `Tratamiento activo: ${selectedTreatment.id}`
          : "Seleccione un tratamiento para comenzar."}
      </div>

      <svg
        className="odontogram-svg"
        viewBox="0 0 620 250"
        role="img"
        aria-label="Odontograma interactivo"
      >
        <g transform="scale(1.5)">
          {teeth.map((tooth) => (
            <Tooth
              key={tooth.id}
              tooth={tooth}
              appliedFaces={appliedFacesByTooth.get(tooth.id) ?? new Set()}
              onApplyTreatment={onApplyTreatment}
              onHoverChange={setHoveredArea}
              isTreatmentSelected={Boolean(selectedTreatment)}
            />
          ))}
        </g>
      </svg>
    </section>
  );
}
