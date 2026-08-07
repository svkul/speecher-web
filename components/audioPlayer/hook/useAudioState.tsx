import { useEffect, useState } from "react";

import type { AudioState } from "../types";

export const useAudioState = (
  ref: React.RefObject<HTMLAudioElement | null>,
  onEndedCallback?: () => void,
): AudioState => {
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const onLoadStart = () => {
      // Reset immediately so highlight doesn't keep the previous track's progress
      setIsReady(false);
      setProgress(0);
      setDuration(0);
      setError(null);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setProgress(audio.currentTime || 0);
      setIsReady(true);
    };

    const onSeeked = () => {
      setProgress(audio.currentTime || 0);
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    const onRateChange = () => {
      setSpeed(audio.playbackRate);
    };

    const onEnded = () => {
      onEndedCallback?.();
    };

    const onError = () => {
      setError(new Error("Audio failed"));
    };

    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("seeked", onSeeked);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("ratechange", onRateChange);

    return () => {
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("seeked", onSeeked);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ratechange", onRateChange);
    };
  }, [onEndedCallback, ref]);

  return {
    isReady,
    duration,
    progress,
    isPlaying,
    speed,
    error,
  };
};
