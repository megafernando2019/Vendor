"use client";

import Select, { type StylesConfig } from "react-select";
import type {
  DisponibilidadFilters,
  RangeSliderProps,
  TourFiltersProps,
} from "@/interfaces/disponibilidad-components";
import { customStyles, FILTER_BORDER_RADIUS } from "@/styles/customSelectStyles";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeView } from "@/redux/slices/viewSlice";

const pct = (val: number, min: number, max: number) =>
  max === min ? 0 : ((val - min) / (max - min)) * 100;

const formatDuracion = (v: number) => String(v);
const formatPrecio = (v: number) => `$${v.toLocaleString("es-MX")}`;

const salidasOptions = [
  { value: "CDMX", label: "Ciudad de México" },
  { value: "GDL", label: "Guadalajara" },
  { value: "MTY", label: "Monterrey" },
];

const destinoStyles: StylesConfig<{ value: string; label: string }, false> = {
  ...customStyles,
  control: (provided, state) => {
    const base = customStyles.control?.(provided, state) ?? provided;
    return {
      ...base,
      borderWidth: 0,
      borderBottomWidth: "2px",
      borderBottomColor: "#7f10d3",
      borderRadius: FILTER_BORDER_RADIUS,
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(127, 16, 211, 0.25)"
        : "none",
      "&:hover": {
        borderBottomColor: "#7f10d3",
      },
    };
  },
};

export default function TourFilters({
  limits,
  filters,
  onFiltersChange,
  onReset,
}: TourFiltersProps) {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.view);

  const updateFilters = (patch: Partial<DisponibilidadFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const durStep = limits.duracion.max - limits.duracion.min <= 1 ? 1 : 1;
  const prcStep =
    limits.precio.max - limits.precio.min <= 100 ? 1 : 100;

  return (
    <div className="w-100 bg-white px-4 py-3 d-flex flex-wrap align-items-center gap-3 tour-filters mb-4">
      <div className="flex-shrink-0 align-self-center" suppressHydrationWarning>
        <div className="d-flex align-items-center gap-1 salida-select-wrap">
          <Select<{ value: string; label: string }>
            instanceId="salida-select"
            placeholder="Salida desde"
            aria-label="Salida desde"
            inputId="salida"
            name="salida"
            isClearable
            menuPosition="fixed"
            options={salidasOptions}
            value={salidasOptions.find((o) => o.value === filters.salida) ?? null}
            styles={destinoStyles}
            onChange={(option) => updateFilters({ salida: option?.value ?? "" })}
          />
        </div>
      </div>

      <RangeSlider
        label="Duración de"
        suffix="días"
        aria-label="Duración en días"
        min={limits.duracion.min}
        max={limits.duracion.max}
        step={durStep}
        valueMin={filters.duracionMin}
        valueMax={filters.duracionMax}
        onChangeMin={(v) =>
          updateFilters({
            duracionMin: Math.min(v, filters.duracionMax - durStep),
          })
        }
        onChangeMax={(v) =>
          updateFilters({
            duracionMax: Math.max(v, filters.duracionMin + durStep),
          })
        }
        format={formatDuracion}
        pct={pct}
      />

      <RangeSlider
        label="Precio de"
        suffix="USD"
        min={limits.precio.min}
        max={limits.precio.max}
        step={prcStep}
        aria-label="Rango de precio"
        valueMin={filters.precioMin}
        valueMax={filters.precioMax}
        onChangeMin={(v) =>
          updateFilters({
            precioMin: Math.min(v, filters.precioMax - prcStep),
          })
        }
        onChangeMax={(v) =>
          updateFilters({
            precioMax: Math.max(v, filters.precioMin + prcStep),
          })
        }
        format={formatPrecio}
        pct={pct}
      />

      <div className="d-flex align-items-center justify-content-center gap-3 flex-shrink-0 w-100 w-md-auto vista-actions">
        <span className="text-purple fw-medium small text-center">
          Cambiar Vista
        </span>

        <button
          type="button"
          aria-label="Vista de tarjetas"
          aria-pressed={view.view === "cards"}
          onClick={() => dispatch(changeView("cards"))}
          className={`btn btn-icon-circle d-flex align-items-center justify-content-center rounded-circle ${
            view.view === "cards" ? "btn-purple-active" : "btn-purple-inactive"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <rect x="3" y="3" width="5" height="5" rx="1" />
            <rect x="9.5" y="3" width="5" height="5" rx="1" />
            <rect x="16" y="3" width="5" height="5" rx="1" />
            <rect x="3" y="9.5" width="5" height="5" rx="1" />
            <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
            <rect x="16" y="9.5" width="5" height="5" rx="1" />
            <rect x="3" y="16" width="5" height="5" rx="1" />
            <rect x="9.5" y="16" width="5" height="5" rx="1" />
            <rect x="16" y="16" width="5" height="5" rx="1" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Vista de lista"
          aria-pressed={view.view === "lista"}
          onClick={() => dispatch(changeView("lista"))}
          className={`btn btn-icon-circle d-flex align-items-center justify-content-center rounded-circle ${
            view.view === "lista" ? "btn-purple-active" : "btn-purple-inactive"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className="flex-shrink-0 ms-auto">
          <button
            type="button"
            onClick={onReset}
            className="btn btn-icon-circle rounded-circle d-flex align-items-center justify-content-center btn-purple-subtle"
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function RangeSlider({
  label,
  suffix,
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  format,
  pct,
  "aria-label": ariaLabel,
}: RangeSliderProps) {
  const pMin = pct(valueMin, min, max);
  const pMax = pct(valueMax, min, max);
  const disabled = max <= min;

  return (
    <div className="d-flex flex-grow-1 align-items-center gap-3 align-self-center range-slider-wrap">
      <p className="text-secondary small text-nowrap flex-shrink-0 mb-0">
        {label}{" "}
        <span className="text-purple fw-semibold">{format(valueMin)}</span> a{" "}
        <span className="text-purple fw-semibold">{format(valueMax)}</span>{" "}
        <span className="text-muted">{suffix}</span>
      </p>

      <div className="position-relative flex-grow-1 d-flex align-items-center track-wrap">
        <div className="position-absolute start-0 end-0 track-base rounded-pill" />
        <div
          className="position-absolute track-fill rounded-pill"
          style={{ left: `${pMin}%`, right: `${100 - pMax}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel}, mínimo` : `${label} mínimo`}
          onChange={(e) => onChangeMin(Number(e.target.value))}
          className="thumb-purple"
          style={{ zIndex: valueMin > max - (max - min) * 0.1 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel}, máximo` : `${label} máximo`}
          onChange={(e) => onChangeMax(Number(e.target.value))}
          className="thumb-purple"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}
