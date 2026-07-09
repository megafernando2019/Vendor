"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeView } from "@/redux/slices/viewSlice";

export default function DisponibilidadViewSwitcher({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.view.view);

  return (
    <div
      className={`disponibilidad-view-switcher d-flex align-items-center justify-content-end gap-2 gap-sm-3 flex-wrap${
        embedded ? " disponibilidad-view-switcher--embedded mb-0" : " mb-3"
      }`}
      role="group"
      aria-label="Cambiar vista de resultados"
    >
      <span className="text-purple fw-medium small">Vista</span>

      <button
        type="button"
        aria-label="Vista de tarjetas"
        aria-pressed={view === "cards"}
        onClick={() => dispatch(changeView("cards"))}
        className={`btn btn-icon-circle d-flex align-items-center justify-content-center rounded-circle ${
          view === "cards" ? "btn-purple-active" : "btn-purple-inactive"
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
        aria-pressed={view === "lista"}
        onClick={() => dispatch(changeView("lista"))}
        className={`btn btn-icon-circle d-flex align-items-center justify-content-center rounded-circle ${
          view === "lista" ? "btn-purple-active" : "btn-purple-inactive"
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
    </div>
  );
}
