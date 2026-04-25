"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import type { AudioPlayerV2Props } from "./types";

import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number): string => {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const AudioPlayerV2 = ({ audioUrls }: AudioPlayerV2Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayNextRef = useRef(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0] ?? "");

  const { play, togglePlayPause, setSrc } = useAudioElement(audioRef);

  const handleAudioEnded = useCallback(() => {
    const currentIndex = audioUrls.indexOf(currentAudioUrl);
    const nextAudioUrl = audioUrls[currentIndex + 1];
    if (!nextAudioUrl) return;

    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(nextAudioUrl);
  }, [audioUrls, currentAudioUrl]);

  const { isReady, duration, progress, error, isPlaying } = useAudioState(audioRef, handleAudioEnded);

  useEffect(() => {
    if (!currentAudioUrl) return;
    setSrc(currentAudioUrl);
    if (shouldAutoPlayNextRef.current) {
      void play();
      shouldAutoPlayNextRef.current = false;
    }
  }, [currentAudioUrl, play, setSrc]);

  if (audioUrls.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <ul>
          {audioUrls.map((url) => (
            <li
              key={url}
              className={cn("text-sm text-gray-500", currentAudioUrl === url && "text-blue-500")}
              onClick={() => setCurrentAudioUrl(url)}
            >{url.split('/').pop()}</li>
          ))}
        </ul>
      </div>

      <audio ref={audioRef} />

      {error && <div>{error.message}</div>}

      {!isReady ? (
        <div>Loading...</div>
      ) : (
        <section>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <Slider
            value={[progress]}
            max={duration}
            step={.1}
            onValueChange={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value[0];
              }
            }}
            className="mx-auto w-full"
          />

          <div className="flex gap-2">
            <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
          </div>
        </section>
      )}
    </>
  )
};