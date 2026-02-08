import { useEffect, useMemo, useRef, useState } from "react";
import { FACE_LABELS } from "../lib/odontogramLayout";

const MAX_AUTOCOMPLETE_RESULTS = 10;

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatTreatment(treatment) {
  return `${treatment.id} - ${treatment.nombre}`;
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
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isEditingRef = useRef(false);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedTreatment) {
      setInputValue(formatTreatment(selectedTreatment));
      isEditingRef.current = false;
      return;
    }

    if (!isEditingRef.current) {
      setInputValue("");
    }
  }, [selectedTreatment]);

  useEffect(
    () => () => {
      if (blurTimeoutRef.current) {
        window.clearTimeout(blurTimeoutRef.current);
      }
    },
    [],
  );

  const autocompleteData = useMemo(() => {
    const trimmedQuery = inputValue.trim();
    const normalizedQuery = normalizeText(trimmedQuery);

    const fullMatches = normalizedQuery
      ? treatments.filter((treatment) => {
          const normalizedName = normalizeText(treatment.nombre);
          const normalizedCode = normalizeText(treatment.id);
          return (
            normalizedName.includes(normalizedQuery) ||
            normalizedCode.includes(normalizedQuery)
          );
        })
      : treatments;

    return {
      total: fullMatches.length,
      visible: fullMatches.slice(0, MAX_AUTOCOMPLETE_RESULTS),
    };
  }, [inputValue, treatments]);

  const selectTreatment = (treatment) => {
    isEditingRef.current = false;
    onSelectTreatment(treatment.id);
    setInputValue(formatTreatment(treatment));
    setIsOpen(false);
    setActiveIndex(0);
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    isEditingRef.current = true;
    setInputValue(nextValue);
    setIsOpen(true);
    setActiveIndex(0);

    if (selectedTreatmentId && selectedTreatment) {
      const currentDisplay = formatTreatment(selectedTreatment);
      if (nextValue !== currentDisplay) {
        onSelectTreatment("");
      }
    }

    const exactByCode = treatments.find(
      (treatment) => normalizeText(treatment.id) === normalizeText(nextValue.trim()),
    );
    if (exactByCode) {
      selectTreatment(exactByCode);
    }
  };

  const handleKeyDown = (event) => {
    const { visible } = autocompleteData;
    if (!visible.length) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current >= visible.length - 1 ? 0 : current + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current <= 0 ? visible.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Enter" && isOpen) {
      event.preventDefault();
      selectTreatment(visible[activeIndex] ?? visible[0]);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setActiveIndex(0);
      isEditingRef.current = false;
    }, 120);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleClear = () => {
    isEditingRef.current = false;
    setInputValue("");
    setIsOpen(false);
    setActiveIndex(0);
    onSelectTreatment("");
  };

  return (
    <section className="panel panel--treatments">
      <div className="panel-head">
        <h2>Tratamientos</h2>
        <p>Escriba para autocompletar y aplicar de forma m&aacute;s r&aacute;pida.</p>
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

      <label className="field-label" htmlFor="treatment-autocomplete">
        Tratamiento (autocompletar)
      </label>
      <div className="autocomplete-wrap">
        <input
          id="treatment-autocomplete"
          className="autocomplete-input"
          type="text"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="treatment-suggestions"
          aria-activedescendant={
            isOpen && autocompleteData.visible[activeIndex]
              ? `treatment-option-${autocompleteData.visible[activeIndex].id}`
              : undefined
          }
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Ej: 02.01, obturacion, corona..."
        />
        {inputValue && (
          <button
            type="button"
            className="autocomplete-clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            aria-label="Limpiar búsqueda de tratamiento"
          >
            ×
          </button>
        )}
      </div>

      <p className="autocomplete-help">
        {autocompleteData.total} coincidencias
        {autocompleteData.total > MAX_AUTOCOMPLETE_RESULTS
          ? ` (mostrando ${MAX_AUTOCOMPLETE_RESULTS})`
          : ""}
      </p>

      {isOpen && autocompleteData.visible.length > 0 && (
        <ul
          id="treatment-suggestions"
          className="autocomplete-list"
          role="listbox"
        >
          {autocompleteData.visible.map((treatment, index) => (
            <li
              key={treatment.id}
              id={`treatment-option-${treatment.id}`}
              className={`autocomplete-item ${
                index === activeIndex ? "autocomplete-item--active" : ""
              }`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectTreatment(treatment)}
            >
              <span className="autocomplete-code">{treatment.id}</span>
              <span className="autocomplete-name">{treatment.nombre}</span>
            </li>
          ))}
        </ul>
      )}

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
