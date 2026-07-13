"use client";

import type { ReactNode } from "react";
import BookingFormsSticky from "@/components/common/banner-form/BookingFormsSticky";
import CatalogPageToolbar from "@/components/common/catalog/CatalogPageToolbar";
import FooterThree from "@/components/common/FooterThree";

type CatalogPageLayoutProps = {
  subtitle: string;
  title: string;
  toolbarLabel: string;
  showViewSwitcher?: boolean;
  sidebarTitle: string;
  sidebar: ReactNode;
  children: ReactNode;
  resultsAreaClassName?: string;
  sidebarSticky?: boolean;
};

const CatalogPageLayout = ({
  subtitle,
  title,
  toolbarLabel,
  showViewSwitcher = true,
  sidebarTitle,
  sidebar,
  children,
  resultsAreaClassName,
  sidebarSticky = true,
}: CatalogPageLayoutProps) => {
  return (
    <>
      <main>
        <div className="tg-booking-sticky-scope catalog-layout-sticky-scope">
          <BookingFormsSticky />

          <div className="container py-4 py-md-5">
            <div className="row g-3 align-items-center catalog-layout__header">
              <div className="col-md-3">
                <div className="catalog-layout__page-header">
                  <p className="catalog-layout__subtitle text-hortencia text-morado-custom mb-1">
                    {subtitle}
                  </p>
                  <h1 className="catalog-layout__title mb-0">{title}</h1>
                </div>
              </div>

              <div className="col-md-9">
                <CatalogPageToolbar
                  activeSectionLabel={toolbarLabel}
                  showViewSwitcher={showViewSwitcher}
                />
              </div>
            </div>

            <div className="row g-4 catalog-layout">
              <div className="col-md-3">
                <div
                  className={`card border-0 shadow catalog-layout__sidebar${
                    sidebarSticky ? " catalog-layout__sidebar--sticky" : ""
                  } h-auto`}
                >
                  <div className="card-body p-4 p-md-4">
                    <h2 className="catalog-layout__sidebar-title mb-0">
                      {sidebarTitle}
                    </h2>
                    {sidebar}
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card border-0 shadow h-100 catalog-layout__results">
                  <div className="card-body p-3 p-md-4">
                    {resultsAreaClassName ? (
                      <section className={resultsAreaClassName}>
                        {children}
                      </section>
                    ) : (
                      children
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterThree />
    </>
  );
};

export default CatalogPageLayout;
