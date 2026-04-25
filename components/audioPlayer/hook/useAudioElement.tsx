import { useCallback, useEffect } from "react";

import type { AudioElementHook } from "../types";

export const useAudioElement = (
  ref: React.RefObject<HTMLAudioElement | null>
): AudioElementHook => {
  const play = useCallback(async () => {
    const audio = ref.current;
    if (!audio) return;

    try {
      await audio.play();
    } catch (e) {
      console.error("Play error:", e);
    }
  }, [ref]);

  const pause = useCallback(() => {
    ref.current?.pause();
  }, [ref]);

  const togglePlayPause = useCallback(async () => {
    const audio = ref.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  }, [ref]);

  const setSrc = useCallback((url: string) => {
    const audio = ref.current;
    if (!audio) return;

    audio.src = url;
    audio.load();
  }, [ref]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [ref]);

  return {
    play,
    pause,
    togglePlayPause,
    setSrc,
  };
};