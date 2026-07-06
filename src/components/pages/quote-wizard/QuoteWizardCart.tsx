"use client";

import type { HabitacionCotizacion } from "@/interfaces/cotizacion-components";
import {
  getHabitacionLineTotal,
  getHabitacionQuantity,
  getRoomTabDisplay,
} from "@/interfaces/cotizacion-components";
import type { AsistenciaSeleccionada } from "@/interfaces/seguros-cotizacion";
import { getAsistenciaCartSubtitle } from "@/interfaces/seguros-cotizacion";
import type { OpcionalSeleccionado } from "@/interfaces/opcionales-cotizacion";
import { getOpcionalCartLineSummaries } from "@/interfaces/opcionales-cotizacion";
import {
  formatMxnAmount,
  formatUsdAmount,
  convertUsdToMxn,
  DEFAULT_EXCHANGE_RATE_MXN,
} from "@/utils/cotizacionRules";
import { formatDeparturePrice, formatDisplayDate } from "@/utils/quoteWizardCalendar";
import type { DayPrice } from "@/utils/quoteWizardCalendar";

export type QuoteWizardCartProps = {
  tourName: string;
  selectedDeparture: DayPrice | null;
  rulesLoading: boolean;
  habitaciones: HabitacionCotizacion[];
  asistencias: AsistenciaSeleccionada[];
  opcionales: OpcionalSeleccionado[];
  onEditRoom: (roomId: string) => void;
  onRemoveRoom: (roomId: string) => void;
  onEditAsistencia: (asistenciaId: string) => void;
  onRemoveAsistencia: (asistenciaId: string) => void;
  onEditOpcional: (opcionalId: string) => void;
  onRemoveOpcional: (opcionalId: string) => void;
};

const QuoteWizardCart = ({
  tourName,
  selectedDeparture,
  rulesLoading,
  habitaciones,
  asistencias,
  opcionales,
  onEditRoom,
  onRemoveRoom,
  onEditAsistencia,
  onRemoveAsistencia,
  onEditOpcional,
  onRemoveOpcional,
}: QuoteWizardCartProps) => {
  const currency = selectedDeparture?.currency ?? "USD";

  const habitacionesTotalUsd = habitaciones.reduce(
    (sum, room) => sum + getHabitacionLineTotal(room),
    0,
  );

  const asistenciasTotalUsd = asistencias.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const opcionalesTotalUsd = opcionales.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const totalUsd = habitacionesTotalUsd + asistenciasTotalUsd + opcionalesTotalUsd;
  const totalMxn = convertUsdToMxn(totalUsd, DEFAULT_EXCHANGE_RATE_MXN);
  const hasCartItems =
    habitaciones.length > 0 || asistencias.length > 0 || opcionales.length > 0;

  return (
    <div className="card border-0 shadow-sm tg-quote-wizard-cart sticky-lg-top">
      <div className="card-body p-3 p-md-4">
        <h2 className="h5 fw-bold mb-3">
          <i className="fas fa-shopping-cart me-2 text-morado-custom" aria-hidden />
          Cotización
        </h2>

        {selectedDeparture ? (
          <div className="small mb-3">
            <p className="mb-1 fw-semibold">{tourName}</p>
            <p className="mb-1 text-muted">
              Salida: {formatDisplayDate(selectedDeparture.departuredAt)}
            </p>
            <p className="mb-0 fw-semibold text-morado-custom">
              {formatDeparturePrice(selectedDeparture.price, selectedDeparture.currency)}
            </p>
            {rulesLoading ? (
              <p className="mb-0 mt-2 text-muted">Cargando reglas...</p>
            ) : null}
          </div>
        ) : (
          <p className="text-muted small mb-3">Selecciona fecha para comenzar</p>
        )}

        {habitaciones.length > 0 ? (
          <div className="tg-quote-wizard-cart-section mb-3">
            <div className="tg-quote-wizard-cart-section-header d-flex align-items-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <i className="fas fa-bed" aria-hidden />
                <span className="fw-semibold">Habitaciones</span>
              </div>
              <div className="text-end">
                <span className="d-block text-muted" style={{ fontSize: "0.65rem" }}>
                  Total
                </span>
                <span className="fw-bold small">
                  {formatUsdAmount(habitacionesTotalUsd, currency)}
                </span>
              </div>
            </div>

            <ul className="list-unstyled mb-0">
              {habitaciones.map((room) => {
                const quantity = getHabitacionQuantity(room);
                const lineTotal = getHabitacionLineTotal(room);

                return (
                <li key={room.id} className="tg-quote-wizard-cart-room py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="min-w-0">
                      <p className="mb-1 fw-semibold small d-flex align-items-center gap-2">
                        <span>{getRoomTabDisplay(room.roomLabel)}</span>
                        {quantity > 1 ? (
                          <span className="tg-quote-wizard-cart-qty badge rounded-pill">
                            x{quantity}
                          </span>
                        ) : null}
                      </p>
                      <p className="mb-0 text-muted tg-quote-wizard-cart-pax">
                        ADT: {room.adt} MNRA: {room.mnrA} INF: {room.inf}
                      </p>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action"
                          aria-label={`Editar habitación ${getRoomTabDisplay(room.roomLabel)}`}
                          onClick={() => onEditRoom(room.id)}
                        >
                          <i className="far fa-edit" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action tg-quote-wizard-cart-action--danger"
                          aria-label={`Eliminar habitación ${getRoomTabDisplay(room.roomLabel)}`}
                          onClick={() => onRemoveRoom(room.id)}
                        >
                          <i className="far fa-trash-alt" aria-hidden />
                        </button>
                      </div>
                      <span className="fw-bold small text-nowrap">
                        {formatUsdAmount(lineTotal, currency)}
                      </span>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {asistencias.length > 0 ? (
          <div className="tg-quote-wizard-cart-section mb-3">
            <div className="tg-quote-wizard-cart-section-header d-flex align-items-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <i className="fas fa-shield-alt" aria-hidden />
                <span className="fw-semibold">Asistencias</span>
              </div>
              <div className="text-end">
                <span className="d-block text-muted" style={{ fontSize: "0.65rem" }}>
                  Total
                </span>
                <span className="fw-bold small">
                  {formatUsdAmount(asistenciasTotalUsd, currency)}
                </span>
              </div>
            </div>

            <ul className="list-unstyled mb-0">
              {asistencias.map((item) => (
                <li key={item.id} className="tg-quote-wizard-cart-room py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="min-w-0">
                      <p className="mb-1 fw-semibold small">{item.name}</p>
                      <p className="mb-0 text-muted tg-quote-wizard-cart-pax">
                        {getAsistenciaCartSubtitle(item)}
                      </p>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action"
                          aria-label={`Editar asistencia ${item.name}`}
                          onClick={() => onEditAsistencia(item.id)}
                        >
                          <i className="far fa-edit" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action tg-quote-wizard-cart-action--danger"
                          aria-label={`Eliminar asistencia ${item.name}`}
                          onClick={() => onRemoveAsistencia(item.id)}
                        >
                          <i className="far fa-trash-alt" aria-hidden />
                        </button>
                      </div>
                      <span className="fw-bold small text-nowrap">
                        {formatUsdAmount(item.price, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {opcionales.length > 0 ? (
          <div className="tg-quote-wizard-cart-section mb-3">
            <div className="tg-quote-wizard-cart-section-header d-flex align-items-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 text-muted small">
                <i className="fas fa-suitcase" aria-hidden />
                <span className="fw-semibold">Opcionales</span>
              </div>
              <div className="text-end">
                <span className="d-block text-muted" style={{ fontSize: "0.65rem" }}>
                  Total
                </span>
                <span className="fw-bold small">
                  {formatUsdAmount(opcionalesTotalUsd, currency)}
                </span>
              </div>
            </div>

            <ul className="list-unstyled mb-0">
              {opcionales.map((item) => (
                <li key={item.id} className="tg-quote-wizard-cart-room py-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="min-w-0">
                      <p className="mb-1 fw-semibold small">{item.name}</p>
                      {getOpcionalCartLineSummaries(item).map((line) => (
                        <p key={line} className="mb-0 text-muted tg-quote-wizard-cart-pax">
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1">
                      <div className="d-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action"
                          aria-label={`Editar opcional ${item.name}`}
                          onClick={() => onEditOpcional(item.id)}
                        >
                          <i className="far fa-edit" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 tg-quote-wizard-cart-action tg-quote-wizard-cart-action--danger"
                          aria-label={`Eliminar opcional ${item.name}`}
                          onClick={() => onRemoveOpcional(item.id)}
                        >
                          <i className="far fa-trash-alt" aria-hidden />
                        </button>
                      </div>
                      <span className="fw-bold small text-nowrap">
                        {formatUsdAmount(item.total, item.currency || currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {hasCartItems ? (
          <div className="border-top pt-3 mb-3">
            <div className="d-flex justify-content-between small fw-semibold">
              <span>Total cotización</span>
              <span className="text-morado-custom">{formatMxnAmount(totalMxn)}</span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="btn tg-quote-wizard-quote-btn w-100 fw-semibold"
          disabled={!selectedDeparture}
        >
          COTIZAR
        </button>
      </div>
    </div>
  );
};

export default QuoteWizardCart;
