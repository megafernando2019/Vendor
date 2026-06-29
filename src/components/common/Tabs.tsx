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
    `p-3 border border-top-0 rounded-bottom position-relative overflow-x-hidden ${
      panelUsesInnerScroll
        ? "overflow-y-auto"
        : "overflow-y-auto"
    }`;

  // Los estilos que Bootstrap no cubre nativamente
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
    <div className="mw-100 w-100">
      <div className="d-flex flex-wrap border-bottom border-secondary-subtle">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={
                isActive
                  ? { borderColor: "#7f10d3", borderBottomColor: "white", color: "#7f10d3", marginBottom: "-1px" }
                  : undefined
              }
              className={`px-3 py-2 rounded-top border ${
                isActive
                  ? "bg-white fw-medium position-relative z-2"
                  : "bg-purple-100 border-transparent text-secondary"
              }`}
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