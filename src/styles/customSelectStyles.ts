import type { StylesConfig } from "react-select";

export const FILTER_BORDER_RADIUS = "0.375rem";

export const customStyles: StylesConfig<{ value: string; label: string }, false> =
  {
    control: (provided, state) => ({
      ...provided,
      minHeight: "38px",
      borderColor: state.isFocused ? "#7f10d3" : "#dee2e6",
      boxShadow: state.isFocused
        ? "0 0 0 0.25rem rgba(127, 16, 211, 0.25)"
        : "none",
      "&:hover": {
        borderColor: "#7f10d3",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6c757d",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "#212529",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "#7f10d3"
        : state.isFocused
          ? "#f5f3ff"
          : "#fff",
      color: state.isSelected ? "#fff" : "#212529",
    }),
  };
