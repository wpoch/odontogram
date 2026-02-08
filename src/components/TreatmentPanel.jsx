export default function TreatmentPanel({
  treatments,
  selectedTreatmentId,
  onSelectTreatment,
  appliedTreatments,
  onRemoveTreatment,
}) {
  return (
    <section className="panel">
      <h2>Tratamiento</h2>
      <select
        className="treatment-select"
        value={selectedTreatmentId}
        onChange={(event) => onSelectTreatment(event.target.value)}
      >
        <option value="">Seleccione un tratamiento...</option>
        {treatments.map((treatment) => (
          <option key={treatment.id} value={treatment.id}>
            {treatment.nombre}
          </option>
        ))}
      </select>

      <ul className="applied-list">
        {appliedTreatments.map((item) => (
          <li key={item.entryId} className="applied-item">
            <span>
              P{item.toothId}
              {item.face} - {item.treatment.nombre}
            </span>
            <button
              type="button"
              className="remove-button"
              onClick={() => onRemoveTreatment(item.entryId)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
