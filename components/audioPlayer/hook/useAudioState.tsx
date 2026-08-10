import { useEffect, useRef, useState } from "react";

import type { AudioState } from "../types";
import { SPEED_STORAGE_KEY, SPEEDS } from "../types";

function readStoredSpeed(): number {
  if (typeof window === "undefined") return 1;

  try {
    const raw = window.localStorage.getItem(SPEED_STORAGE_KEY);
    if (!raw) return 1;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return 1;
    return SPEEDS.some((item) => item.value === parsed) ? parsed : 1;
  } catch {
    return 1;
  }
}

export const useAudioState = (
  ref: React.RefObject<HTMLAudioElement | null>,
  onEndedCallback?: () => void,
  onReadyCallback?: () => void,
): AudioState => {
  const [isReady, setIsReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  const onEndedRef = useRef(onEndedCallback);
  onEndedRef.current = onEndedCallback;

  const onReadyRef = useRef(onReadyCallback);
  onReadyRef.current = onReadyCallback;

  useEffect(() => {
    setSpeed(readStoredSpeed());
  }, []);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    let rafId = 0;
    let lastPosted = -1;

    const publishProgress = (value: number) => {
      const next = Number.isFinite(value) ? value : 0;
      if (Math.abs(next - lastPosted) < 0.03) return;
      lastPosted = next;
      setProgress(next);
    };

    const stopProgressLoop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const startProgressLoop = () => {
      stopProgressLoop();

      const tick = () => {
        publishProgress(audio.currentTime);
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    const syncPlayingLoop = () => {
      if (!audio.paused && !audio.ended) {
        setIsPlaying(true);
        startProgressLoop();
        return;
      }

      setIsPlaying(false);
      stopProgressLoop();
      publishProgress(audio.currentTime);
    };

    const onLoadStart = () => {
      stopProgressLoop();
      lastPosted = -1;
      setIsBuffering(true);
      setProgress(0);
      setDuration(0);
      setError(null);
    };

    const onLoadedMetadata = () => {
      const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(nextDuration);
      publishProgress(audio.currentTime || 0);
      setIsReady(true);
      setIsBuffering(false);
      syncPlayingLoop();
      onReadyRef.current?.();
    };

    const onCanPlay = () => {
      setIsBuffering(false);
    };

    const onWaiting = () => {
      setIsBuffering(true);
    };

    const onTimeUpdate = () => {
      publishProgress(audio.currentTime);
    };

    const onSeeked = () => {
      publishProgress(audio.currentTime || 0);
      syncPlayingLoop();
    };

    const onPlay = () => {
      setIsPlaying(true);
      startProgressLoop();
    };

    const onPause = () => {
      setIsPlaying(false);
      stopProgressLoop();
      publishProgress(audio.currentTime || 0);
    };

    const onRateChange = () => {
      setSpeed(audio.playbackRate);
    };

    const onEnded = () => {
      setIsPlaying(false);
      stopProgressLoop();
      publishProgress(audio.currentTime || 0);
      onEndedRef.current?.();
    };

    const onError = () => {
      stopProgressLoop();
      setIsPlaying(false);
      setIsBuffering(false);
      setError(new Error("Audio failed"));
    };

    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("seeked", onSeeked);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("playing", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("ratechange", onRateChange);

    syncPlayingLoop();

    return () => {
      stopProgressLoop();
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("seeked", onSeeked);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("playing", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ratechange", onRateChange);
    };
  }, [ref]);

  return {
    isReady,
    isBuffering,
    duration,
    progress,
    isPlaying,
    speed,
    error,
  };
};
