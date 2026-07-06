import { useEffect, useState } from "react";
import { persistor } from "@/src/redux/store";

export function usePersistBootstrapped() {
  const [bootstrapped, setBootstrapped] = useState(
    () => persistor.getState().bootstrapped,
  );

  useEffect(() => {
    if (bootstrapped) return;

    return persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setBootstrapped(true);
      }
    });
  }, [bootstrapped]);

  return bootstrapped;
}
