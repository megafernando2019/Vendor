import { useState } from "react";
import type { TabsProps } from "@/src/interfaces/ui";

export const Tabs = ({
  items,
  defaultActiveKey,
  contentScrollId,
  panelClassName,
}: TabsProps) => {
  const [active, setActive] = useState(defaultActiveKey || items[0].key);
  const panelScrollId = contentScrollId ?? undefined;
  const panelUsesInnerScroll = Boolean(panelScrollId) && !panelClassName;

  const panelClasses =
    panelClassName ??
    `app-tabs__panel p-3 border border-top-0 rounded-bottom position-relative overflow-x-hidden ${
      panelUsesInnerScroll ? "overflow-y-auto" : "overflow-y-auto"
    }`;

  const panelStyle = panelClassName
    ? undefined
    : {
        borderColor: "#7f10d3",
        minHeight: "30rem",
        maxHeight: panelUsesInnerScroll ? "calc(100vh - 280px)" : "50rem",
        zIndex: 0,
        marginTop: "-1px",
      };

  return (
    <div className="app-tabs mw-100 w-100">
      <div className="app-tabs__list d-flex flex-wrap justify-content-center" role="tablist">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.key)}
              className={`app-tabs__trigger${isActive ? " app-tabs__trigger--active" : ""}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div id={panelScrollId} className={panelClasses} style={panelStyle}>
        {items.map(
          (item) =>
            active === item.key && (
              <div key={item.key} className="mw-100 w-100">
                {item.children}
              </div>
            )
        )}
      </div>
    </div>
  );
};
