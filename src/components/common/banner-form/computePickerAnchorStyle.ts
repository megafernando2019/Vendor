export type PickerAnchorStyle = {
  top?: number;
  bottom?: number;
};

type ComputePickerAnchorOptions = {
  preferAbove?: boolean;
};

export const computePickerAnchorStyle = (
  anchorEl: HTMLElement,
  options: ComputePickerAnchorOptions = {},
): PickerAnchorStyle => {
  const rect = anchorEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openDown =
    !options.preferAbove &&
    (spaceBelow >= 180 || spaceBelow >= spaceAbove);

  if (openDown) {
    return {
      top: rect.bottom + 6,
    };
  }

  return {
    bottom: viewportHeight - rect.top + 6,
  };
};

export const pickerAnchorStyleToCssVars = (
  style: PickerAnchorStyle,
): Record<string, string> => ({
  "--picker-top": style.top != null ? `${style.top}px` : "auto",
  "--picker-bottom": style.bottom != null ? `${style.bottom}px` : "auto",
});
