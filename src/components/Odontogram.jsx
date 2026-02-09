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
  selectedTreatment,
  onApplyTreatment,
}) {
  const appliedFacesByTooth = useMemo(
    () => buildAppliedFacesByTooth(appliedTreatments),
    [appliedTreatments],
  );

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
        {selectedTreatment
          ? `Tratamiento activo: ${selectedTreatment.id}`
          : "Seleccione un tratamiento para comenzar."}
      </div>

      <svg
        className="odontogram-svg"
        viewBox="0 0 620 250"
        role="img"
        aria-label="Odontograma interactivo"
      >
        <defs>
          <linearGradient id="tooth-shell-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8f1f7" />
          </linearGradient>
          <linearGradient id="tooth-face-idle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfefe" />
            <stop offset="100%" stopColor="#edf5fb" />
          </linearGradient>
          <linearGradient id="tooth-face-hover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff5dd" />
            <stop offset="100%" stopColor="#ffe3b5" />
          </linearGradient>
          <linearGradient id="tooth-face-applied" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea6a74" />
            <stop offset="100%" stopColor="#ca3e4c" />
          </linearGradient>
          <filter id="tooth-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0.2"
              dy="0.45"
              stdDeviation="0.45"
              floodOpacity="0.28"
              floodColor="#19506f"
            />
          </filter>
        </defs>
        <g transform="scale(1.5)">
          {teeth.map((tooth) => (
            <Tooth
              key={tooth.id}
              tooth={tooth}
              appliedFaces={appliedFacesByTooth.get(tooth.id) ?? new Set()}
              onApplyTreatment={onApplyTreatment}
              isTreatmentSelected={Boolean(selectedTreatment)}
            />
          ))}
        </g>
      </svg>
    </section>
  );
}
