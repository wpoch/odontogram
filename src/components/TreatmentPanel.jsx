import { useMemo, useState } from "react";
import { FACE_LABELS } from "../lib/odontogramLayout";

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function badgeText(enabled) {
  return enabled ? "Disponible" : "No disponible";
}

export default function TreatmentPanel({
  treatments,
  selectedTreatment,
  selectedTreatmentId,
  onSelectTreatment,
  appliedTreatments,
  onRemoveTreatment,
  onUndoLast,
  onClearAll,
  stats,
}) {
  const [query, setQuery] = useState("");

  const filteredTreatments = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return treatments;
    }

    const normalizedQuery = normalizeText(trimmed);
    return treatments.filter((treatment) => {
      const normalizedName = normalizeText(treatment.nombre);
      const normalizedCode = normalizeText(treatment.id);
      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedCode.includes(normalizedQuery)
      );
    });
  }, [query, treatments]);
  const visibleTreatments = useMemo(() => {
    if (!selectedTreatment) {
      return filteredTreatments;
    }

    const hasSelected = filteredTreatments.some(
      (treatment) => treatment.id === selectedTreatment.id,
    );
    return hasSelected
      ? filteredTreatments
      : [selectedTreatment, ...filteredTreatments];
  }, [filteredTreatments, selectedTreatment]);

  return (
    <section className="panel panel--treatments">
      <div className="panel-head">
        <h2>Tratamientos</h2>
        <p>Busque por c&oacute;digo o descripci&oacute;n y aplique con un clic.</p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Aplicaciones</span>
          <strong>{stats.totalApplications}</strong>
        </article>
        <article className="stat-card">
          <span>Piezas tratadas</span>
          <strong>{stats.treatedTeeth}</strong>
        </article>
        <article className="stat-card">
          <span>Familias usadas</span>
          <strong>{stats.treatmentFamilies}</strong>
        </article>
      </div>

      <label className="field-label" htmlFor="treatment-search">
        Buscar tratamiento
      </label>
      <input
        id="treatment-search"
        className="search-input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ej: 02.01, obturacion, corona..."
      />

      <div className="select-header">
        <label className="field-label" htmlFor="treatment-select">
          Tratamiento seleccionado
        </label>
        <span>{filteredTreatments.length} resultados</span>
      </div>
      <select
        id="treatment-select"
        className="treatment-select"
        value={selectedTreatmentId}
        onChange={(event) => onSelectTreatment(event.target.value)}
      >
        <option value="">Seleccione un tratamiento...</option>
        {visibleTreatments.map((treatment) => (
          <option key={treatment.id} value={treatment.id}>
            {treatment.id} - {treatment.nombre}
          </option>
        ))}
      </select>

      <div className="selected-treatment-card">
        {selectedTreatment ? (
          <>
            <p className="selected-code">{selectedTreatment.id}</p>
            <p className="selected-name">{selectedTreatment.nombre}</p>
            <div className="capability-row">
              <span
                className={`capability-badge ${
                  selectedTreatment.aplicaCara
                    ? "capability-badge--ok"
                    : "capability-badge--off"
                }`}
              >
                Cara: {badgeText(selectedTreatment.aplicaCara)}
              </span>
              <span
                className={`capability-badge ${
                  selectedTreatment.aplicaDiente
                    ? "capability-badge--ok"
                    : "capability-badge--off"
                }`}
              >
                Pieza: {badgeText(selectedTreatment.aplicaDiente)}
              </span>
            </div>
          </>
        ) : (
          <p className="empty-copy">
            Seleccione un tratamiento para ver sus reglas y aplicarlo en el
            odontograma.
          </p>
        )}
      </div>

      <div className="action-row">
        <button type="button" className="ghost-button" onClick={onUndoLast}>
          Deshacer &uacute;ltimo
        </button>
        <button type="button" className="danger-button" onClick={onClearAll}>
          Limpiar todo
        </button>
      </div>

      <div className="history-head">
        <h3>Historial aplicado</h3>
        <p>Las &uacute;ltimas acciones se muestran primero.</p>
      </div>

      {appliedTreatments.length === 0 ? (
        <div className="history-empty">
          <p>A&uacute;n no hay tratamientos aplicados.</p>
        </div>
      ) : (
        <ul className="applied-list">
          {appliedTreatments.map((item) => (
            <li key={item.entryId} className="applied-item">
              <div className="applied-meta">
                <span className="applied-location">
                  P{item.toothId} · {FACE_LABELS[item.face] ?? item.face}
                </span>
                <strong>{item.treatment.id}</strong>
                <span>{item.treatment.nombre}</span>
              </div>
              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveTreatment(item.entryId)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
