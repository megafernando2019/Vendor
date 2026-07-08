declare module "bootstrap" {
  export class Tooltip {
    constructor(element: Element, options?: Record<string, unknown>);
    dispose(): void;
  }

  export class Modal {
    constructor(element: Element, options?: Record<string, unknown>);
    static getOrCreateInstance(
      element: Element,
      options?: Record<string, unknown>,
    ): Modal;
    show(): void;
    hide(): void;
    dispose(): void;
  }
}
