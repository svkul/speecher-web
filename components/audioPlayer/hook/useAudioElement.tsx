import { useCallback, useEffect, useRef } from "react";

import type { AudioElementHook } from "../types";
import { SPEED_STORAGE_KEY, SPEEDS } from "../types";

function readStoredSpeed(): number {
  if (typeof window === "undefined") return 1;

  try {
    const raw = window.localStorage.getItem(SPEED_STORAGE_KEY);
    if (!raw) return 1;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return 1;
    const allowed = SPEEDS.some((item) => item.value === parsed);
    return allowed ? parsed : 1;
  } catch {
    return 1;
  }
}

function persistSpeed(speed: number) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SPEED_STORAGE_KEY, String(speed));
  } catch {
    // Ignore quota / private mode failures
  }
}

export const useAudioElement = (
  ref: React.RefObject<HTMLAudioElement | null>,
): AudioElementHook => {
  const playbackRateRef = useRef(1);
  const hasHydratedSpeedRef = useRef(false);

  useEffect(() => {
    if (hasHydratedSpeedRef.current) return;
    hasHydratedSpeedRef.current = true;

    const stored = readStoredSpeed();
    playbackRateRef.current = stored;

    const audio = ref.current;
    if (audio) {
      audio.playbackRate = stored;
    }
  }, [ref]);

  const applyPlaybackRate = useCallback(() => {
    const audio = ref.current;
    if (!audio) return;
    audio.playbackRate = playbackRateRef.current;
  }, [ref]);

  const play = useCallback(async () => {
    const audio = ref.current;
    if (!audio) return;

    applyPlaybackRate();

    try {
      await audio.play();
      applyPlaybackRate();
    } catch (e) {
      console.error("Play error:", e);
    }
  }, [applyPlaybackRate, ref]);

  const pause = useCallback(() => {
    ref.current?.pause();
  }, [ref]);

  const togglePlayPause = useCallback(async () => {
    const audio = ref.current;
    if (!audio) return;

    if (audio.paused) {
      await play();
    } else {
      audio.pause();
    }
  }, [play, ref]);

  const setSpeed = useCallback(
    (speed: number) => {
      playbackRateRef.current = speed;
      persistSpeed(speed);
      applyPlaybackRate();
    },
    [applyPlaybackRate],
  );

  const getSpeed = useCallback(() => playbackRateRef.current, []);

  const seekTo = useCallback((timeSeconds: number) => {
    const audio = ref.current;
    if (!audio) return;

    const maxTime = Number.isFinite(audio.duration)
      ? audio.duration
      : timeSeconds;
    audio.currentTime = Math.min(
      Math.max(timeSeconds, 0),
      Math.max(maxTime, 0),
    );
  }, [ref]);

  const skipBy = useCallback(
    (deltaSeconds: number) => {
      const audio = ref.current;
      if (!audio) return;

      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const next = audio.currentTime + deltaSeconds;
      audio.currentTime = Math.min(Math.max(next, 0), Math.max(duration, 0));
    },
    [ref],
  );

  const setSrc = useCallback(
    (url: string) => {
      const audio = ref.current;
      if (!audio) return false;

      const currentSrc = audio.currentSrc || audio.src;
      if (currentSrc === url || audio.getAttribute("src") === url) {
        applyPlaybackRate();
        return false;
      }

      audio.src = url;
      audio.load();
      applyPlaybackRate();
      return true;
    },
    [applyPlaybackRate, ref],
  );

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [ref]);

  return {
    play,
    pause,
    setSpeed,
    getSpeed,
    togglePlayPause,
    setSrc,
    seekTo,
    skipBy,
    applyPlaybackRate,
  };
};
