import { useEffect, useState } from "react";

import type { AudioState } from "../types";

export const useAudioState = (
  ref: React.RefObject<HTMLAudioElement | null>,
  onEndedCallback?: () => void
): AudioState => {
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsReady(true);
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      onEndedCallback?.();
    };

    const onError = () => {
      setError(new Error("Audio failed"));
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [onEndedCallback, ref]);

  return {
    isReady,
    duration,
    progress,
    isPlaying,
    error,
  };
};