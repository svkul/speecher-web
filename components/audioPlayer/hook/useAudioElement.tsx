import { useEffect } from "react";

import type { AudioElementHook } from "../types";

export const useAudioElement = (
  ref: React.RefObject<HTMLAudioElement | null>
): AudioElementHook => {
  const play = async () => {
    const audio = ref.current;
    if (!audio) return;

    try {
      await audio.play();
    } catch (e) {
      console.error("Play error:", e);
    }
  };

  const pause = () => {
    ref.current?.pause();
  };

  const togglePlayPause = async () => {
    const audio = ref.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const setSrc = (url: string) => {
    const audio = ref.current;
    if (!audio) return;

    audio.src = url;
    audio.load();
  };

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