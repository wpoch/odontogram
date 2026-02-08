import { useEffect, useMemo, useRef, useState } from "react";
import Odontogram from "./components/Odontogram";
import TreatmentPanel from "./components/TreatmentPanel";
import treatments from "./data/treatments";
import { buildTeethLayout } from "./lib/odontogramLayout";

const STORAGE_KEY = "odontogram.appliedTreatments.v1";

function createTreatmentMap() {
  return new Map(treatments.map((treatment) => [treatment.id, treatment]));
}

function hydrateStoredTreatments(rawList, treatmentMap) {
  if (!Array.isArray(rawList)) {
    return [];
  }

  const hydrated = [];

  for (let index = 0; index < rawList.length; index += 1) {
    const entry = rawList[index];
    const treatmentId = entry?.treatmentId ?? entry?.treatment?.id;

    if (!treatmentMap.has(treatmentId)) {
      continue;
    }

    const toothId = Number(entry?.toothId);
    const face = entry?.face;

    if (!Number.isFinite(toothId) || typeof face !== "string") {
      continue;
    }

    hydrated.push({
      entryId: Number(entry?.entryId) || index + 1,
      toothId,
      face,
      treatmentId,
    });
  }

  return hydrated;
}

function buildNotice(message, tone = "info") {
  return {
    id: Date.now(),
    message,
    tone,
  };
}

export default function App() {
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [appliedTreatments, setAppliedTreatments] = useState([]);
  const [notice, setNotice] = useState(null);
  const sequence = useRef(1);

  const teeth = useMemo(() => buildTeethLayout(), []);
  const treatmentMap = useMemo(() => createTreatmentMap(), []);
  const selectedTreatment = useMemo(
    () =>
      treatments.find((treatment) => treatment.id === selectedTreatmentId) ?? null,
    [selectedTreatmentId],
  );
  const appliedTreatmentsEnriched = useMemo(
    () =>
      appliedTreatments
        .map((entry) => ({
          ...entry,
          treatment: treatmentMap.get(entry.treatmentId),
        }))
        .filter((entry) => Boolean(entry.treatment))
        .sort((a, b) => b.entryId - a.entryId),
    [appliedTreatments, treatmentMap],
  );
  const stats = useMemo(() => {
    const treatedTeeth = new Set(appliedTreatments.map((entry) => entry.toothId));
    const treatmentFamilies = new Set(
      appliedTreatmentsEnriched.map((entry) => entry.treatment.id.split(".")[0]),
    );

    return {
      totalApplications: appliedTreatments.length,
      treatedTeeth: treatedTeeth.size,
      treatmentFamilies: treatmentFamilies.size,
    };
  }, [appliedTreatments, appliedTreatmentsEnriched]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);
      const hydrated = hydrateStoredTreatments(parsed, treatmentMap);
      setAppliedTreatments(hydrated);

      const maxEntryId = hydrated.reduce(
        (max, entry) => (entry.entryId > max ? entry.entryId : max),
        0,
      );
      sequence.current = maxEntryId + 1;
    } catch {
      // Ignore invalid localStorage payloads and start with an empty state.
    }
  }, [treatmentMap]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appliedTreatments));
  }, [appliedTreatments]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const handleApplyTreatment = (toothId, face) => {
    if (!selectedTreatment) {
      setNotice(
        buildNotice(
          "Seleccione un tratamiento antes de hacer clic en una cara o pieza.",
          "warning",
        ),
      );
      return;
    }

    if (face === "X" && !selectedTreatment.aplicaDiente) {
      setNotice(
        buildNotice(
          "El tratamiento seleccionado no se puede aplicar a toda la pieza.",
          "warning",
        ),
      );
      return;
    }

    if (face !== "X" && !selectedTreatment.aplicaCara) {
      setNotice(
        buildNotice(
          "El tratamiento seleccionado no se puede aplicar a una cara.",
          "warning",
        ),
      );
      return;
    }

    setAppliedTreatments((current) => [
      ...current,
      {
        entryId: sequence.current,
        toothId,
        face,
        treatmentId: selectedTreatment.id,
      },
    ]);
    sequence.current += 1;
    setNotice(
      buildNotice(
        `Tratamiento ${selectedTreatment.id} aplicado en pieza ${toothId}${face}.`,
        "success",
      ),
    );
    setSelectedTreatmentId("");
  };

  const handleRemoveTreatment = (entryId) => {
    const toRemove = appliedTreatments.find((item) => item.entryId === entryId);
    if (!toRemove) {
      return;
    }

    setAppliedTreatments((current) =>
      current.filter((item) => item.entryId !== entryId),
    );
    setNotice(
      buildNotice(
        `Se quitó el tratamiento de la pieza ${toRemove.toothId}${toRemove.face}.`,
        "info",
      ),
    );
  };

  const handleUndoLast = () => {
    if (appliedTreatments.length === 0) {
      setNotice(buildNotice("No hay acciones para deshacer.", "info"));
      return;
    }

    const sorted = [...appliedTreatments].sort((a, b) => b.entryId - a.entryId);
    const lastEntry = sorted[0];
    setAppliedTreatments((current) =>
      current.filter((entry) => entry.entryId !== lastEntry.entryId),
    );
    setNotice(
      buildNotice(
        `Se deshizo la última aplicación en pieza ${lastEntry.toothId}${lastEntry.face}.`,
        "info",
      ),
    );
  };

  const handleClearAll = () => {
    if (appliedTreatments.length === 0) {
      setNotice(buildNotice("No hay tratamientos cargados para limpiar.", "info"));
      return;
    }

    const confirmed = window.confirm(
      "Se eliminarán todos los tratamientos aplicados. ¿Desea continuar?",
    );

    if (!confirmed) {
      return;
    }

    setAppliedTreatments([]);
    setNotice(buildNotice("Se limpió todo el odontograma.", "success"));
  };

  return (
    <main className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            OD
          </span>
          <div>
            <p className="eyebrow">Interfaz clínica 2026</p>
            <h1>Clip Soluciones Dental</h1>
            <p className="header-note">
              Flujo sugerido: busque un tratamiento, selecciónelo y aplíquelo en
              la pieza correspondiente.
            </p>
          </div>
        </div>
      </header>

      {notice && (
        <div
          className={`feedback-banner feedback-banner--${notice.tone}`}
          role="status"
          aria-live="polite"
        >
          {notice.message}
        </div>
      )}

      <div className="workspace">
        <TreatmentPanel
          treatments={treatments}
          selectedTreatment={selectedTreatment}
          selectedTreatmentId={selectedTreatmentId}
          onSelectTreatment={setSelectedTreatmentId}
          appliedTreatments={appliedTreatmentsEnriched}
          onRemoveTreatment={handleRemoveTreatment}
          onUndoLast={handleUndoLast}
          onClearAll={handleClearAll}
          stats={stats}
        />

        <Odontogram
          teeth={teeth}
          appliedTreatments={appliedTreatments}
          selectedTreatment={selectedTreatment}
          onApplyTreatment={handleApplyTreatment}
        />
      </div>
    </main>
  );
}
