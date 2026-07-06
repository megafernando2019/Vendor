"use client";

import { useEffect, useMemo, useState } from "react";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import type { QuoteWizardSearchParams } from "@/utils/quoteWizardSearchParams";
import {
  QUOTE_WIZARD_WEEKDAYS,
  buildCalendarCells,
  formatDeparturePrice,
  type DayPrice,
  type WizardCalendarData,
} from "@/utils/quoteWizardCalendar";

import type { WizardStep } from "../types";

export type QuoteWizardCalendarProps = {
  tour: QuoteWizardTour;
  similarClv?: string;
  itemSearch: QuoteWizardSearchParams;
  calendar: WizardCalendarData;
  selectedDeparture: DayPrice | null;
  onSelectDeparture: (departure: DayPrice | null) => void;
  onStepChange?: (step: WizardStep) => void;
  rulesReady?: boolean;
};

const QuoteWizardCalendar = ({
  tour,
  similarClv,
  itemSearch,
  calendar,
  selectedDeparture,
  onSelectDeparture,
  onStepChange,
  rulesReady,
}: QuoteWizardCalendarProps) => {
  const { months, dayPrices } = calendar;
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  useEffect(() => {
    setSelectedMonthKey("");
  }, [tour.clv]);

  const effectiveMonthKey = selectedMonthKey || months[0]?.key || "";

  const selectedMonth = useMemo(
    () => months.find((month) => month.key === effectiveMonthKey) ?? months[0],
    [months, effectiveMonthKey],
  );

  const calendarCells = useMemo(() => {
    if (!selectedMonth) return [];
    return buildCalendarCells(selectedMonth.monthIndex, selectedMonth.year);
  }, [selectedMonth]);

  const priceByDay = useMemo(() => {
    const map = new Map<number, DayPrice>();
    const entries = dayPrices[effectiveMonthKey] ?? [];
    for (const entry of entries) {
      map.set(entry.day, entry);
    }
    return map;
  }, [dayPrices, effectiveMonthKey]);

  const handleMonthSelect = (key: string) => {
    setSelectedMonthKey(key);
    onSelectDeparture(null);
  };

  const handleDaySelect = (day: number | null) => {
    if (!day) return;
    const priceInfo = priceByDay.get(day);
    if (!priceInfo) return;
    onSelectDeparture(priceInfo);
  };

  const handleReloadDates = () => {
    onSelectDeparture(null);
  };

  if (months.length === 0) {
    return (
      <p className="text-muted small mb-0">
        No hay fechas disponibles para este tour en el rango de búsqueda
        {itemSearch.startRange && itemSearch.endRange
          ? ` (${itemSearch.startRange} — ${itemSearch.endRange})`
          : ""}
        .
      </p>
    );
  }

  return (
    <div className="row g-3 g-md-4">
      <div className="col-12 col-md-3">
        <h2 className="h6 fw-semibold mb-2">Mes disponible</h2>
        <ul className="list-unstyled mb-4">
          {months.map((month) => (
            <li key={month.key} className="mb-1">
              <button
                type="button"
                onClick={() => handleMonthSelect(month.key)}
                className={`btn btn-link btn-sm p-0 text-decoration-none tg-quote-wizard-month-btn ${
                  effectiveMonthKey === month.key ? "active" : ""
                }`}
              >
                {month.label} ({month.count})
              </button>
            </li>
          ))}
        </ul>

        <h2 className="h6 fw-semibold mb-2">Programas</h2>
        <ul className="list-unstyled small mb-0">
          <li className="mb-2 d-flex align-items-center gap-2">
            <span className="tg-quote-wizard-legend tg-quote-wizard-legend--selected" />
            Seleccionado: {tour.clv}
          </li>
          {similarClv ? (
            <li className="d-flex align-items-center gap-2">
              <span className="tg-quote-wizard-legend tg-quote-wizard-legend--similar" />
              Similar: {similarClv}
            </li>
          ) : null}
        </ul>
      </div>

      <div className="col-12 col-md-9">
        {selectedMonth ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0 text-uppercase">
                {selectedMonth.label} {selectedMonth.year}
              </h2>
              <button
                type="button"
                onClick={handleReloadDates}
                className="btn btn-link btn-sm p-0 text-morado-custom text-decoration-none"
              >
                <i className="fas fa-sync-alt me-1" aria-hidden />
                Recargar fechas
              </button>
            </div>

            <div className="tg-quote-wizard-calendar-grid mb-2">
              {QUOTE_WIZARD_WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="tg-quote-wizard-calendar-weekday text-center small text-muted"
                >
                  {day}
                </div>
              ))}

              {calendarCells.map((day, index) => {
                const priceInfo = day ? priceByDay.get(day) : undefined;
                const isSelected =
                  priceInfo !== undefined &&
                  selectedDeparture?.departureUid === priceInfo.departureUid;

                return (
                  <button
                    key={`${selectedMonth.key}-${index}`}
                    type="button"
                    disabled={!priceInfo}
                    onClick={() => handleDaySelect(day)}
                    className={`tg-quote-wizard-calendar-day btn p-0 ${
                      priceInfo ? "has-price" : "is-empty"
                    } ${isSelected ? "selected" : ""}`}
                    aria-label={
                      day && priceInfo
                        ? `${day} de ${selectedMonth.label}, ${formatDeparturePrice(priceInfo.price, priceInfo.currency)}`
                        : undefined
                    }
                  >
                    {day !== null && (
                      <>
                        <span className="tg-quote-wizard-day-number">{day}</span>
                        {priceInfo ? (
                          <span
                            className={`tg-quote-wizard-price-tag tg-quote-wizard-price-tag--${priceInfo.program}`}
                          >
                            {formatDeparturePrice(
                              priceInfo.price,
                              priceInfo.currency,
                            )}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="small text-muted text-end mb-3">
              Precios mostrados por pasajero en habitación doble
            </p>

            {selectedDeparture && onStepChange ? (
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!rulesReady}
                  onClick={() => onStepChange("habitaciones")}
                >
                  Continuar
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default QuoteWizardCalendar;
