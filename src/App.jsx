import { useMemo, useRef, useState } from "react";
import Odontogram from "./components/Odontogram";
import TreatmentPanel from "./components/TreatmentPanel";
import treatments from "./data/treatments";
import { buildTeethLayout } from "./lib/odontogramLayout";

export default function App() {
  const [selectedTreatmentId, setSelectedTreatmentId] = useState("");
  const [appliedTreatments, setAppliedTreatments] = useState([]);
  const sequence = useRef(1);

  const teeth = useMemo(() => buildTeethLayout(), []);
  const selectedTreatment = useMemo(
    () =>
      treatments.find((treatment) => treatment.id === selectedTreatmentId) ?? null,
    [selectedTreatmentId],
  );

  const handleApplyTreatment = (toothId, face) => {
    if (!selectedTreatment) {
      window.alert("Debe seleccionar un tratamiento previamente.");
      return;
    }

    if (face === "X" && !selectedTreatment.aplicaDiente) {
      window.alert(
        "El tratamiento seleccionado no se puede aplicar a toda la pieza.",
      );
      return;
    }

    if (face !== "X" && !selectedTreatment.aplicaCara) {
      window.alert(
        "El tratamiento seleccionado no se puede aplicar a una cara.",
      );
      return;
    }

    setAppliedTreatments((current) => [
      ...current,
      {
        entryId: sequence.current,
        toothId,
        face,
        treatment: selectedTreatment,
      },
    ]);
    sequence.current += 1;
    setSelectedTreatmentId("");
  };

  const handleRemoveTreatment = (entryId) => {
    setAppliedTreatments((current) =>
      current.filter((item) => item.entryId !== entryId),
    );
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Clip Soluciones</h1>
        <p>Odontograma React</p>
      </header>

      <div className="workspace">
        <TreatmentPanel
          treatments={treatments}
          selectedTreatmentId={selectedTreatmentId}
          onSelectTreatment={setSelectedTreatmentId}
          appliedTreatments={appliedTreatments}
          onRemoveTreatment={handleRemoveTreatment}
        />

        <Odontogram
          teeth={teeth}
          appliedTreatments={appliedTreatments}
          onApplyTreatment={handleApplyTreatment}
        />
      </div>
    </main>
  );
}
