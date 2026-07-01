type WowInstance = {
  init: () => void;
  sync: (element?: Element) => void;
};

declare global {
  interface Window {
    WOW?: new (options?: Record<string, unknown>) => WowInstance;
  }
}

let wowInstance: WowInstance | null = null;
let wowInitPromise: Promise<WowInstance | null> | null = null;

const WOW_OPTIONS = {
  boxClass: "wow",
  animateClass: "animated",
  offset: 80,
  mobile: true,
  live: false,
};

function createWowInstance(): WowInstance | null {
  if (typeof window === "undefined" || !window.WOW) {
    return null;
  }

  const instance = new window.WOW(WOW_OPTIONS);
  instance.init();
  return instance;
}

function loadWowScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.WOW) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-wow-loader="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "/assets/js/wow.min.js";
    script.async = true;
    script.dataset.wowLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load WOW.js"));
    document.body.appendChild(script);
  });
}

export function getWowInstance(): Promise<WowInstance | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (wowInstance) {
    return Promise.resolve(wowInstance);
  }

  if (!wowInitPromise) {
    wowInitPromise = loadWowScript()
      .then(() => {
        wowInstance = createWowInstance();
        return wowInstance;
      })
      .catch(() => null);
  }

  return wowInitPromise;
}

export function syncWow(element?: Element) {
  if (wowInstance) {
    wowInstance.sync(element);
    return;
  }

  getWowInstance().then((instance) => {
    instance?.sync(element);
  });
}
