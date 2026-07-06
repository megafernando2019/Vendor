import {
  getRoomTabDisplay,
  ruleKey,
  type HabitacionCosts,
  type RoomRule,
  type RoomTabLabel,
} from "@/interfaces/cotizacion-components";
import {
  PassengerIcons,
  RulePassengerDescriptions,
} from "./QuoteWizardHabitacionPassengers";

type BedLayout = "matrimonial" | "twin";

type QuoteWizardHabitacionRoomPanelProps = {
  activeTab: RoomTabLabel;
  bedLayout: BedLayout;
  roomTitle: string;
  roomDescription: string;
  roomRules: RoomRule[];
  selectedRuleIndex: number;
  editingRoomId?: string | null;
  roomCostsLoading: boolean;
  roomCostsPreview: HabitacionCosts | null;
  onBedLayoutChange: (layout: BedLayout) => void;
  onSelectRule: (index: number) => void;
  onAddRoom: () => void;
};

const QuoteWizardHabitacionRoomPanel = ({
  activeTab,
  bedLayout,
  roomTitle,
  roomDescription,
  roomRules,
  selectedRuleIndex,
  editingRoomId,
  roomCostsLoading,
  roomCostsPreview,
  onBedLayoutChange,
  onSelectRule,
  onAddRoom,
}: QuoteWizardHabitacionRoomPanelProps) => (
  <div className="tg-quote-wizard-room-panel border rounded-bottom p-3 p-md-4 mb-4">
    <div className="row g-3 align-items-center mb-4">
      <div className="col-md-4">
        <div className="d-flex gap-3 align-items-start">
          <div className="tg-quote-wizard-room-thumb" aria-hidden>
            <i className="fas fa-bed" />
          </div>
          <div>
            <h3 className="h6 fw-semibold mb-1">{roomTitle}</h3>
            <p className="small text-muted mb-0">{roomDescription}</p>
          </div>
        </div>
      </div>

      {activeTab === "doble" ? (
        <div className="col-md-5">
          <p className="small fw-semibold mb-2">Seleccione el tipo de cama</p>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onBedLayoutChange("matrimonial")}
              className={`btn btn-sm tg-quote-wizard-bed-btn ${
                bedLayout === "matrimonial" ? "active" : ""
              }`}
            >
              <i className="fas fa-bed me-1" aria-hidden />
              Habitación doble
            </button>
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="bed-layout-toggle"
                checked={bedLayout === "twin"}
                onChange={(e) =>
                  onBedLayoutChange(e.target.checked ? "twin" : "matrimonial")
                }
              />
            </div>
            <button
              type="button"
              onClick={() => onBedLayoutChange("twin")}
              className={`btn btn-sm tg-quote-wizard-bed-btn ${
                bedLayout === "twin" ? "active" : ""
              }`}
            >
              <i className="fas fa-bed me-1" aria-hidden />
              <i className="fas fa-bed me-1" aria-hidden />
              Habitación Twin
            </button>
          </div>
        </div>
      ) : (
        <div className="col-md-5" />
      )}

      <div className="col-md-3 text-md-end">
        <button
          type="button"
          className="btn tg-quote-wizard-add-room-btn"
          onClick={onAddRoom}
          disabled={!roomCostsPreview || roomCostsLoading}
        >
          {editingRoomId ? "Guardar cambios" : "Agregar a cotización"}
        </button>
      </div>
    </div>

    <div className="row g-3">
      {roomRules.length === 0 ? (
        <div className="col-12">
          <p className="text-muted small mb-0">
            No hay combinaciones de pasajeros para esta habitación.
          </p>
        </div>
      ) : (
        roomRules.map((rule, index) => {
          const isSelected = selectedRuleIndex === index;
          return (
            <div key={ruleKey(rule, index)} className="col-12 col-md-4">
              <button
                type="button"
                onClick={() => onSelectRule(index)}
                className={`tg-quote-wizard-rule-card w-100 text-start ${
                  isSelected ? "selected" : ""
                }`}
              >
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div className="flex-grow-1">
                    <PassengerIcons rule={rule} />
                    <RulePassengerDescriptions rule={rule} />
                  </div>
                  <span
                    className={`tg-quote-wizard-rule-radio ${
                      isSelected ? "selected" : ""
                    }`}
                    aria-hidden
                  />
                </div>
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default QuoteWizardHabitacionRoomPanel;
