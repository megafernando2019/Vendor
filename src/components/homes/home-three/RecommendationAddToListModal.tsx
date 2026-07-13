"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import type { RecommendationCard } from "@/utils/recommendations";
import { formatProgramCount } from "@/utils/programLists";
import type { AgencyListItem } from "@/services/list";
import { BookmarkIcon } from "./recommendationCardMediaShared";

type RecommendationAddToListModalProps = {
  item: RecommendationCard;
  onClose: () => void;
  onAddToFavorites: () => void;
  onCreateList: () => void;
};

const CreateListGridIcon = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

function normalizeAgencyLists(data: unknown): AgencyListItem[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const record = entry as Record<string, unknown>;
      const name = typeof record.name === "string" ? record.name.trim() : "";
      if (!name) return null;

      const programs = Array.isArray(record.programs)
        ? record.programs
            .map((program) => {
              if (!program || typeof program !== "object") return null;
              const item = program as Record<string, unknown>;
              const mt = item.mt != null ? String(item.mt) : "";
              if (!mt) return null;
              return {
                mt,
                name: item.name != null ? String(item.name) : "",
                order: item.order != null ? String(item.order) : "",
              };
            })
            .filter(
              (program): program is AgencyListItem["programs"][number] =>
                program != null,
            )
        : [];

      const totalElements = Number(record.total_elements);
      return {
        name,
        total_elements: Number.isFinite(totalElements)
          ? totalElements
          : programs.length,
        programs,
      };
    })
    .filter((entry): entry is AgencyListItem => entry != null);
}

const RecommendationAddToListModal = ({
  item,
  onClose,
  onAddToFavorites,
  onCreateList,
}: RecommendationAddToListModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [lists, setLists] = useState<AgencyListItem[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [listsError, setListsError] = useState("");
  const programId = useMemo(
    () => String(item.id ?? item.clv ?? ""),
    [item.clv, item.id],
  );

  useEffect(() => {
    const element = modalRef.current;
    if (!element) return;

    let disposed = false;
    let modalInstance: import("bootstrap").Modal | null = null;

    const handleHidden = () => {
      onCloseRef.current();
    };

    void import("bootstrap").then(({ Modal }) => {
      if (disposed) return;

      modalInstance = Modal.getOrCreateInstance(element, {
        backdrop: true,
        keyboard: true,
        focus: true,
      });

      element.addEventListener("hidden.bs.modal", handleHidden);
      modalInstance.show();
    });

    return () => {
      disposed = true;
      element.removeEventListener("hidden.bs.modal", handleHidden);
      modalInstance?.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadLists = async () => {
      setLoadingLists(true);
      setListsError("");

      try {
        const res = await fetch("/api/list/showLists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_list: "",
            type_view: 1,
          }),
        });

        let data: {
          success?: boolean;
          message?: string;
          data?: unknown;
        } | null = null;

        try {
          data = (await res.json()) as {
            success?: boolean;
            message?: string;
            data?: unknown;
          };
        } catch {
          data = null;
        }

        if (cancelled) return;

        if (!res.ok || !data?.success) {
          setLists([]);
          setListsError(data?.message || "No se pudieron cargar las listas.");
          return;
        }

        setLists(normalizeAgencyLists(data.data));
      } catch {
        if (!cancelled) {
          setLists([]);
          setListsError("No se pudieron cargar las listas.");
        }
      } finally {
        if (!cancelled) {
          setLoadingLists(false);
        }
      }
    };

    void loadLists();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddToList = (listName: string) => {
    const list = lists.find((entry) => entry.name === listName);
    if (!list) return;

    const alreadyInList = list.programs.some(
      (program) => program.mt === programId,
    );

    if (alreadyInList) {
      toast.info(`"${item.title}" ya está en ${list.name}.`, {
        position: "top-right",
      });
      onClose();
      return;
    }

    setLists((current) =>
      current.map((entry) => {
        if (entry.name !== listName) return entry;
        return {
          ...entry,
          total_elements: entry.total_elements + 1,
          programs: [
            ...entry.programs,
            {
              mt: programId,
              name: item.title,
              order: String(entry.programs.length + 1),
            },
          ],
        };
      }),
    );

    toast.success(`"${item.title}" se agregó a ${list.name}.`, {
      position: "top-right",
    });
    onClose();
  };

  return createPortal(
    <div
      ref={modalRef}
      className="modal fade recommendation-add-to-list-modal"
      tabIndex={-1}
      aria-labelledby="recommendation-add-to-list-modal-title"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered recommendation-add-to-list-modal__dialog">
        <div className="modal-content recommendation-add-to-list-modal__content">
          <div className="modal-header recommendation-add-to-list-modal__header">
            <div className="recommendation-add-to-list-modal__heading">
              <div className="recommendation-add-to-list-modal__title-row">
                <span className="recommendation-add-to-list-modal__title-icon">
                  <BookmarkIcon />
                </span>
                <h2
                  className="recommendation-add-to-list-modal__title"
                  id="recommendation-add-to-list-modal-title"
                >
                  Agregar a lista
                </h2>
              </div>
              <p className="recommendation-add-to-list-modal__subtitle">
                Guarda este programa en favoritos o en una de tus listas
              </p>
            </div>
            <button
              type="button"
              className="btn-close recommendation-add-to-list-modal__close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body recommendation-add-to-list-modal__body">
            <p className="recommendation-add-to-list-modal__section-label">
              Agregar a Lista
            </p>

            {loadingLists ? (
              <p className="text-muted mb-3" aria-live="polite">
                Cargando listas...
              </p>
            ) : null}

            {listsError ? (
              <p className="text-danger mb-3" role="alert">
                {listsError}
              </p>
            ) : null}

            {!loadingLists && !listsError && lists.length === 0 ? (
              <p className="text-muted mb-3">
                Aún no tienes listas. Crea una nueva para empezar.
              </p>
            ) : null}

            <ul className="recommendation-add-to-list-modal__lists">
              {lists.map((list) => (
                <li key={list.name}>
                  <button
                    type="button"
                    className="recommendation-add-to-list-modal__list-item"
                    onClick={() => handleAddToList(list.name)}
                  >
                    <span className="recommendation-add-to-list-modal__list-copy">
                      <span className="recommendation-add-to-list-modal__list-name">
                        {list.name}
                      </span>
                      <span className="recommendation-add-to-list-modal__list-count">
                        {formatProgramCount(list.total_elements)}
                      </span>
                    </span>
                    <span className="recommendation-add-to-list-modal__list-icon">
                      <BookmarkIcon />
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="recommendation-add-to-list-modal__create"
              onClick={onCreateList}
            >
              <span className="recommendation-add-to-list-modal__create-icon">
                <CreateListGridIcon />
              </span>
              <span className="recommendation-add-to-list-modal__create-copy">
                <span className="recommendation-add-to-list-modal__create-title">
                  Crea una nueva lista
                </span>
                <span className="recommendation-add-to-list-modal__create-subtitle">
                  Organiza los programas para revisarlos rápidamente
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RecommendationAddToListModal;
