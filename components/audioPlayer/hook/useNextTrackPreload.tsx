import { useEffect } from "react";

/**
 * Warm the browser cache for the next playlist item to reduce gap on auto-advance.
 */
export function useNextTrackPreload(nextSrc: string | null) {
  useEffect(() => {
    if (!nextSrc) return;

    const preload = new Audio();
    preload.preload = "auto";
    preload.src = nextSrc;

    return () => {
      preload.removeAttribute("src");
      preload.load();
    };
  }, [nextSrc]);
}
