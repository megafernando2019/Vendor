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
      <div className="d-flex flex-wrap border-secondary-subtle">
        {items.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              style={
                isActive
                  ? { borderColor: "white", borderBottomColor: "#7f10d3", color: "#7f10d3", marginBottom: "-1px" }
                  : undefined
              }
              className={`px-3 py-2${
                isActive
                  ? "bg-white border-purple fw-medium position-relative z-2"
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