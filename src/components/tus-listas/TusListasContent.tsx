"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToWishlist } from "@/redux/features/wishlistSlice";
import { useAppSelector } from "@/redux/hooks";
import CatalogPageLayout from "@/components/common/catalog/CatalogPageLayout";
import PromotionFilters from "@/components/disponibilidad/PromotionFilters";
import RecommendationTourCardSkeleton from "@/components/disponibilidad/RecommendationTourCardSkeleton";
import RecommendationTourCard from "@/components/homes/home-three/RecommendationTourCard";
import RecommendationSectionNav from "@/components/recomendaciones/RecommendationSectionNav";
import { useSearchDisponibilidad } from "@/hooks/useSearchDisponibilidad";
import useWow from "@/hooks/useWow";
import {
  filterResultsByPromotions,
  mapPromotionsSummaryToOptions,
} from "@/interfaces/disponibilidad-components";
import {
  normalizeAgencyListsCatalog,
  type AgencyListsCatalog,
} from "@/utils/agencyLists";
import {
  mapResultDataToCards,
  type RecommendationCard,
} from "@/utils/recommendations";

const SKELETON_COUNT = 6;
const EMPTY_CATALOG: AgencyListsCatalog = {
  lists: {},
  promotionsSummary: [],
  sections: [],
};

const TusListasContent = () => {
  useWow();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchByKeyword, searching } = useSearchDisponibilidad();
  const viewMode = useAppSelector((state) => state.view.view);
  const isListView = viewMode === "lista";

  const sectionFromUrl = searchParams.get("lista") ?? "";

  const [catalog, setCatalog] = useState<AgencyListsCatalog>(EMPTY_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(sectionFromUrl);
  const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadLists = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/list/showLists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name_list: "",
            type_view: 2,
          }),
        });

        let payload: {
          success?: boolean;
          message?: string;
          data?: unknown;
        } | null = null;

        try {
          payload = (await res.json()) as {
            success?: boolean;
            message?: string;
            data?: unknown;
          };
        } catch {
          payload = null;
        }

        if (cancelled) return;

        if (!res.ok || !payload?.success) {
          setCatalog(EMPTY_CATALOG);
          setError(payload?.message || "No se pudieron cargar tus listas.");
          return;
        }

        setCatalog(normalizeAgencyListsCatalog(payload.data));
      } catch {
        if (!cancelled) {
          setCatalog(EMPTY_CATALOG);
          setError("No se pudieron cargar tus listas.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadLists();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (catalog.sections.length === 0) return;

    setActiveSection((current) => {
      const preferred =
        sectionFromUrl &&
        catalog.sections.some((section) => section.key === sectionFromUrl)
          ? sectionFromUrl
          : current;

      if (
        preferred &&
        catalog.sections.some((section) => section.key === preferred)
      ) {
        return preferred;
      }

      return catalog.sections[0]?.key ?? "";
    });
  }, [catalog.sections, sectionFromUrl]);

  const handleSectionChange = useCallback(
    (sectionKey: string) => {
      setActiveSection(sectionKey);
      setSelectedPromotions([]);

      const params = new URLSearchParams(searchParams.toString());
      params.set("lista", sectionKey);
      router.replace(`/tus-listas?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const activeSectionMeta = useMemo(
    () => catalog.sections.find((section) => section.key === activeSection),
    [catalog.sections, activeSection],
  );

  const promotionOptions = useMemo(
    () => mapPromotionsSummaryToOptions(catalog.promotionsSummary),
    [catalog.promotionsSummary],
  );

  const activePrograms = useMemo(() => {
    if (!activeSection) return [];
    return catalog.lists[activeSection] ?? [];
  }, [catalog.lists, activeSection]);

  const filteredPrograms = useMemo(
    () => filterResultsByPromotions(activePrograms, selectedPromotions),
    [activePrograms, selectedPromotions],
  );

  const cards = useMemo(
    () => mapResultDataToCards(filteredPrograms),
    [filteredPrograms],
  );

  const handleAddToWishlist = useCallback(
    (item: RecommendationCard) => {
      dispatch(addToWishlist(item as never));
    },
    [dispatch],
  );

  const gridColumnClass = isListView ? "col-12" : "col-12 col-sm-6 col-xl-4";
  const showViewSwitcher = !loading && cards.length > 0;

  return (
    <CatalogPageLayout
      subtitle="Gestion a tu manera"
      title="Tus listas"
      toolbarLabel={activeSectionMeta?.label ?? "Tus listas"}
      showViewSwitcher={showViewSwitcher}
      sidebarTitle="Mis listas"
      resultsAreaClassName="tg-tus-listas-area"
      sidebar={
        loading ? (
          <div
            className="recommendation-section-nav-skeleton mt-4"
            aria-hidden="true"
          />
        ) : (
          <div className="mt-4">
            <RecommendationSectionNav
              sections={catalog.sections}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              emptyMessage="No tienes listas creadas todavía."
              ariaLabel="Tus listas"
            />

            {promotionOptions.length > 0 ? (
              <PromotionFilters
                options={promotionOptions}
                selected={selectedPromotions}
                onChange={setSelectedPromotions}
              />
            ) : null}
          </div>
        )
      }
    >
      {error ? (
        <div className="alert alert-danger mb-20" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <>
          <p className="mb-30 text-muted" aria-live="polite">
            Cargando tus listas...
          </p>
          <div
            className={`row g-4 disponibilidad-gallery${
              isListView ? " disponibilidad-gallery--list" : ""
            }`}
            aria-busy="true"
          >
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <div key={`skeleton-${index}`} className={gridColumnClass}>
                <RecommendationTourCardSkeleton
                  layout={isListView ? "list" : "grid"}
                />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {!loading && !error && catalog.sections.length === 0 ? (
        <p className="text-muted mb-0">
          Aún no tienes listas. Crea una desde una tarjeta de programa.
        </p>
      ) : null}

      {!loading &&
      !error &&
      catalog.sections.length > 0 &&
      cards.length === 0 ? (
        <p className="text-muted mb-0">
          {selectedPromotions.length > 0
            ? "Ningún programa coincide con las promociones seleccionadas."
            : "Esta lista no tiene programas por el momento."}
        </p>
      ) : null}

      {!loading && !error && cards.length > 0 ? (
        <div
          className={`row g-4 disponibilidad-gallery${
            isListView ? " disponibilidad-gallery--list" : ""
          }`}
        >
          {cards.map((item) => (
            <div
              key={item.id}
              className={`${gridColumnClass} disponibilidad-gallery__item--loaded`}
            >
              <RecommendationTourCard
                item={item}
                compareOptions={cards}
                onAddToWishlist={handleAddToWishlist}
                linkMode="quote-wizard"
                layout={isListView ? "list" : "grid"}
                onSearchNavigate={searchByKeyword}
                searchNavigateDisabled={searching}
              />
            </div>
          ))}
        </div>
      ) : null}
    </CatalogPageLayout>
  );
};

export default TusListasContent;
