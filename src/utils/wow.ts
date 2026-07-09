type WowInstance = {
  init: () => void;
  sync: (element?: Element) => void;
};

type RawWowInstance = WowInstance & {
  stop?: () => void;
  doSync?: (element?: Element) => void;
  scrollCallback?: () => void;
  scrolled?: boolean;
};

declare global {
  interface Window {
    WOW?: new (options?: Record<string, unknown>) => RawWowInstance;
  }
}

let wowInstance: WowInstance | null = null;
let wowInitPromise: Promise<WowInstance | null> | null = null;

const WOW_OPTIONS = {
  boxClass: "wow",
  animateClass: "animated",
  offset: 80,
  mobile: true,
  live: true,
};

function wrapWowInstance(raw: RawWowInstance): WowInstance {
  return {
    init: () => raw.init(),
    sync: (element?: Element) => {
      // WOW's public sync() is a no-op when MutationObserver is supported.
      raw.doSync?.(element ?? document.documentElement);
      raw.scrolled = true;
      raw.scrollCallback?.();
    },
  };
}

function createWowInstance(): WowInstance | null {
  if (typeof window === "undefined" || !window.WOW) {
    return null;
  }

  const raw = new window.WOW(WOW_OPTIONS);
  raw.init();
  return wrapWowInstance(raw);
}

function loadWowScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.WOW) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-wow-loader="true"]',
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

export function destroyWowInstance() {
  const raw = wowInstance as RawWowInstance | null;
  raw?.stop?.();
  wowInstance = null;
  wowInitPromise = null;
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

export async function refreshWow(options?: {
  recreate?: boolean;
  element?: Element;
}) {
  if (options?.recreate) {
    destroyWowInstance();
  }

  const instance = await getWowInstance();
  instance?.sync(options?.element);
}
