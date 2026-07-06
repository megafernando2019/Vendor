"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addOpcional } from "@/redux/slices/cotizacionSlice";
import type { OpcionalTour } from "@/interfaces/opcionales-cotizacion";
import { getDeparturesToursAction } from "@/app/actions/departuresTours";
import {
  buildOpcionalSeleccionado,
  buildQuantityOptions,
  getMaxQtyForOpcionalRate,
  getOpcionalRateLabel,
  getPassengerTotalsFromHabitaciones,
  getVisibleOpcionalRates,
  hasOpcionalPassengers,
  opcionalQtyKey,
  syncOpcionalQuantities,
} from "@/interfaces/opcionales-cotizacion";
import TourThumbImage from "@/components/common/TourThumbImage";
import fallbackThumb from "@/assets/img/listing/listing-1.webp";
import { formatUsdAmount } from "@/utils/cotizacionRules";
import type { DayPrice } from "@/utils/quoteWizardCalendar";
import type { QuoteWizardTour } from "@/utils/quoteWizardCotizar";
import QuoteWizardStepPlaceholder from "./QuoteWizardStepPlaceholder";

export type QuoteWizardOpcionalesProps = {
  tour: QuoteWizardTour;
  selectedDeparture: DayPrice | null;
};

const OPCIONAL_PLACEHOLDER_IMAGES = [
  "/assets/img/destination/tu/des-1.webp",
  "/assets/img/destination/tu/des-2.webp",
  "/assets/img/destination/tu/des-3.webp",
  "/assets/img/destination/tu/des-4.webp",
  "/assets/img/location/location-2.webp",
  "/assets/img/location/location-3.webp",
];

type OpcionalTourCardProps = {
  tour: OpcionalTour;
  imageIndex: number;
  quantities: Record<string, number>;
  passengerTotals: { adt: number; mnrA: number; inf: number };
  onQuantityChange: (rateCode: string, quantity: number) => void;
  onAdd: () => void;
};

function OpcionalTourCard({
  tour,
  imageIndex,
  quantities,
  passengerTotals,
  onQuantityChange,
  onAdd,
}: OpcionalTourCardProps) {
  const rateCodes = tour.rates.map((rate) => rate.code);
  const visibleRates = getVisibleOpcionalRates(tour, passengerTotals);

  const placeholderSrc =
    OPCIONAL_PLACEHOLDER_IMAGES[imageIndex % OPCIONAL_PLACEHOLDER_IMAGES.length] ??
    fallbackThumb.src;
  const imageSrc = tour.imageUrl || placeholderSrc;

  const renderRateRow = (rate: OpcionalTour["rates"][number]) => {
    const maxQty = getMaxQtyForOpcionalRate(rate.code, passengerTotals, rateCodes);
    const qtyKey = opcionalQtyKey(tour.uid, rate.code);
    const currentQty = quantities[qtyKey] ?? 0;
    const options = buildQuantityOptions(maxQty);

    return (
      <div
        key={rate.code}
        className="tg-quote-wizard-opcional-rate d-flex align-items-center justify-content-end gap-2 flex-wrap"
      >
        <div className="text-end">
          <span className="small text-muted">{getOpcionalRateLabel(rate.code)}:</span>{" "}
          <strong className="text-morado-custom">
            {formatUsdAmount(rate.price, rate.currency).replace(` ${rate.currency}`, "")}
          </strong>{" "}
          <span className="small text-muted">{rate.currency}</span>
        </div>

        <select
          className="form-select form-select-sm tg-quote-wizard-opcional-qty"
          value={currentQty}
          aria-label={`Cantidad ${getOpcionalRateLabel(rate.code)} para ${tour.name}`}
          onChange={(event) => onQuantityChange(rate.code, Number(event.target.value))}
        >
          <option value={0}>0</option>
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <article className="tg-quote-wizard-opcional-card card border-0 shadow-sm">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <div className="tg-quote-wizard-opcional-thumb rounded-3 overflow-hidden">
              <TourThumbImage
                src={imageSrc}
                alt={tour.name}
                width={120}
                height={80}
                className="object-fit-cover w-100 h-100"
              />
            </div>
          </div>

          <div className="col min-w-0">
            <h3 className="h6 fw-semibold mb-2">{tour.name}</h3>
            {tour.description ? (
              <p className="mb-0 small text-muted tg-quote-wizard-opcional-desc">
                {tour.description}
              </p>
            ) : null}
          </div>

          <div className="col-12 col-lg-4">
            {visibleRates.length > 0 ? (
              <div className="d-flex flex-column align-items-lg-end gap-2">
                {visibleRates.map((rate) => renderRateRow(rate))}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm tg-quote-wizard-opcional-add rounded-circle"
                  aria-label={`Agregar ${tour.name} a la cotización`}
                  onClick={onAdd}
                >
                  <i className="fas fa-plus" aria-hidden />
                </button>
              </div>
            ) : (
              <p className="mb-0 small text-muted text-lg-end">
                Sin pasajeros compatibles en habitaciones.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

const QuoteWizardOpcionales = ({
  tour,
  selectedDeparture,
}: QuoteWizardOpcionalesProps) => {
  const dispatch = useAppDispatch();
  const habitacionesSeleccionadas = useAppSelector(
    (state) => state.cotizacion.habitacionesSeleccionadas,
  );

  const [tours, setTours] = useState<OpcionalTour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const passengerTotals = useMemo(
    () => getPassengerTotalsFromHabitaciones(habitacionesSeleccionadas),
    [habitacionesSeleccionadas],
  );

  const canSelectOpcionales = hasOpcionalPassengers(passengerTotals);

  useEffect(() => {
    setQuantities((prev) =>
      syncOpcionalQuantities(tours, passengerTotals, prev, opcionalQtyKey),
    );
  }, [tours, passengerTotals]);

  useEffect(() => {
    if (!selectedDeparture?.departureUid) return;

    let cancelled = false;

    const loadTours = async () => {
      setLoading(true);
      setError(null);
      setTours([]);
      setQuantities({});

      try {
        const data = await getDeparturesToursAction(
          selectedDeparture.departureUid,
        );

        if (cancelled) return;

        if (!data.success) {
          setError(data.message ?? "No se pudieron cargar los opcionales");
          return;
        }

        setTours(data.data);
      } catch {
        if (!cancelled) {
          setError("Error de conexión al consultar opcionales");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTours();

    return () => {
      cancelled = true;
    };
  }, [selectedDeparture?.departureUid]);

  const handleQuantityChange = useCallback(
    (tourUid: string, rateCode: string, quantity: number) => {
      const key = opcionalQtyKey(tourUid, rateCode);
      setQuantities((prev) => ({ ...prev, [key]: quantity }));
    },
    [],
  );

  const handleAddTour = useCallback(
    (opcionalTour: OpcionalTour) => {
      const payload = buildOpcionalSeleccionado(opcionalTour, quantities);
      if (!payload) {
        toast.warn("Selecciona al menos un pasajero para este opcional", {
          position: "top-center",
        });
        return;
      }

      dispatch(addOpcional(payload));
      toast.success(`${opcionalTour.name} agregado a la cotización`, {
        position: "top-center",
      });

      setQuantities((prev) => {
        const next = { ...prev };
        for (const rate of opcionalTour.rates) {
          delete next[opcionalQtyKey(opcionalTour.uid, rate.code)];
        }
        return syncOpcionalQuantities(
          [opcionalTour],
          passengerTotals,
          next,
          opcionalQtyKey,
        );
      });
    },
    [dispatch, passengerTotals, quantities],
  );

  if (!selectedDeparture) {
    return (
      <QuoteWizardStepPlaceholder
        icon="fa-bus"
        title="Opcionales"
        message="Selecciona una fecha para ver traslados, excursiones y otros opcionales."
      />
    );
  }

  if (loading) {
    return (
      <div className="tg-quote-wizard-opcionales text-center py-5 text-muted small">
        Cargando opcionales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-quote-wizard-opcionales">
        <div className="alert alert-warning small mb-0" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="tg-quote-wizard-opcionales">
        <p className="text-muted small mb-0">
          No hay opcionales disponibles para esta salida.
        </p>
      </div>
    );
  }

  return (
    <div className="tg-quote-wizard-opcionales d-flex flex-column gap-3">
      {!canSelectOpcionales ? (
        <div className="alert alert-info small mb-0" role="status">
          Agrega habitaciones con pasajeros para seleccionar adultos, menores o
          infantes en los opcionales.
        </div>
      ) : (
        <p className="small text-muted mb-0">
          Pasajeros en cotización: ADT {passengerTotals.adt}
          {passengerTotals.mnrA > 0 ? ` · MNRA ${passengerTotals.mnrA}` : ""}
          {passengerTotals.inf > 0 ? ` · INF ${passengerTotals.inf}` : ""}
        </p>
      )}

      {tours.map((opcionalTour, index) => (
        <OpcionalTourCard
          key={opcionalTour.uid}
          tour={opcionalTour}
          imageIndex={index}
          quantities={quantities}
          passengerTotals={passengerTotals}
          onQuantityChange={(rateCode, quantity) =>
            handleQuantityChange(opcionalTour.uid, rateCode, quantity)
          }
          onAdd={() => handleAddTour(opcionalTour)}
        />
      ))}
    </div>
  );
};

export default QuoteWizardOpcionales;
