"use client";

import Select, { type StylesConfig } from "react-select";
import type {
  DisponibilidadFilters,
  RangeSliderProps,
  TourFiltersProps,
} from "@/interfaces/disponibilidad-components";
import { customStyles, FILTER_BORDER_RADIUS } from "@/styles/customSelectStyles";

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
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
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
  const updateFilters = (patch: Partial<DisponibilidadFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const durStep = limits.duracion.max - limits.duracion.min <= 1 ? 1 : 1;
  const prcStep =
    limits.precio.max - limits.precio.min <= 100 ? 1 : 100;

  return (
    <div className="tour-filters w-100 d-flex flex-column align-items-stretch gap-3">
      <div className="w-100" suppressHydrationWarning>
        <div className="salida-select-wrap w-100">
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
        label="Duración"
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
        label="Precio"
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

      <div className="d-flex justify-content-end w-100">
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
    <fieldset className="d-flex flex-column gap-2 range-slider-wrap w-100 mt-10 border-0 p-0 m-0 min-w-0">
      <legend className="range-slider-header d-flex align-items-center justify-content-between gap-2 w-100 fw-bold text-morado-custom text-secondary small mb-0 range-slider-label float-none w-auto p-0">
        {label}
      </legend>

      <div className="position-relative d-flex align-items-center track-wrap w-100">
        <div className="position-absolute start-0 end-0 track-base rounded-pill w-100" />
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
          className="thumb-purple w-100"
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
          className="thumb-purple w-100"
          style={{ zIndex: 4 }}
        />
      </div>
<div className="d-flex align-items-center justify-content-start gap-2 w-100">
  <span className="text-secondary small mb-0 range-slider-values text-start d-block w-100">
    <span className="fw-semibold">{format(valueMin)}</span> a{" "}
    <span className="fw-semibold">{format(valueMax)}</span>{" "}
    <span className="text-muted">{suffix}</span>
  </span>
</div>
    </fieldset>
  );
}
