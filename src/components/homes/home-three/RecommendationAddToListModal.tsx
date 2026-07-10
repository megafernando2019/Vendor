"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import type { RecommendationCard } from "@/utils/recommendations";
import {
  addProgramToList,
  formatProgramCount,
  readProgramLists,
  type ProgramList,
} from "@/utils/programLists";
import { BookmarkIcon, FavoriteIcon } from "./recommendationCardMediaShared";

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

const RecommendationAddToListModal = ({
  item,
  onClose,
  onAddToFavorites,
  onCreateList,
}: RecommendationAddToListModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [lists, setLists] = useState<ProgramList[]>(() => readProgramLists());
  const programId = useMemo(() => item.id ?? item.clv, [item.clv, item.id]);

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

  const handleAddToList = (listId: string) => {
    const list = lists.find((entry) => entry.id === listId);
    if (!list) return;

    if (list.programIds.includes(programId)) {
      toast.info(`"${item.title}" ya está en ${list.name}.`, {
        position: "top-right",
      });
      onClose();
      return;
    }

    const nextLists = addProgramToList(listId, programId);
    setLists(nextLists);

    const updatedList = nextLists.find((entry) => entry.id === listId);
    toast.success(
      `"${item.title}" se agregó a ${updatedList?.name ?? "la lista"}.`,
      { position: "top-right" },
    );
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
            <button
              type="button"
              className="recommendation-add-to-list-modal__favorites"
              onClick={onAddToFavorites}
            >
              <span>Agregar a Favoritos</span>
              <span className="recommendation-add-to-list-modal__favorites-icon">
                <FavoriteIcon />
              </span>
            </button>

            <p className="recommendation-add-to-list-modal__section-label">
              Agregar a Lista
            </p>

            <ul className="recommendation-add-to-list-modal__lists">
              {lists.map((list) => (
                <li key={list.id}>
                  <button
                    type="button"
                    className="recommendation-add-to-list-modal__list-item"
                    onClick={() => handleAddToList(list.id)}
                  >
                    <span className="recommendation-add-to-list-modal__list-copy">
                      <span className="recommendation-add-to-list-modal__list-name">
                        {list.name}
                      </span>
                      <span className="recommendation-add-to-list-modal__list-count">
                        {formatProgramCount(list.programIds.length)}
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
