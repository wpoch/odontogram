import { useMemo } from "react";
import Tooth from "./Tooth";

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
  onApplyTreatment,
}) {
  const appliedFacesByTooth = useMemo(
    () => buildAppliedFacesByTooth(appliedTreatments),
    [appliedTreatments],
  );

  return (
    <section className="odontogram-shell">
      <h2>Odontograma</h2>
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
            />
          ))}
        </g>
      </svg>
    </section>
  );
}
