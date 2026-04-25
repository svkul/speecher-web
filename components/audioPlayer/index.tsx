"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatDurationSeconds } from "@/lib/date";
import { cn } from "@/lib/utils";
import { AudioSlider } from "./components/AudioSlider";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import type { AudioPlayerV2Props } from "./types";

export const AudioPlayerV2 = ({ audioUrls }: AudioPlayerV2Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayNextRef = useRef(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0] ?? "");
  const activeAudioUrl = audioUrls.includes(currentAudioUrl) ? currentAudioUrl : (audioUrls[0] ?? "");

  const { play, togglePlayPause, setSrc } = useAudioElement(audioRef);

  const handleAudioEnded = useCallback(() => {
    const currentIndex = audioUrls.indexOf(activeAudioUrl);
    const nextAudioUrl = audioUrls[currentIndex + 1];
    if (!nextAudioUrl) return;

    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(nextAudioUrl);
  }, [activeAudioUrl, audioUrls]);

  const { isReady, duration, progress, error, isPlaying } = useAudioState(audioRef, handleAudioEnded);

  useEffect(() => {
    if (!activeAudioUrl) return;

    setSrc(activeAudioUrl);

    if (shouldAutoPlayNextRef.current) {
      void play();
      shouldAutoPlayNextRef.current = false;
    }
  }, [activeAudioUrl, play, setSrc]);

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
              className={cn("text-sm text-gray-500", activeAudioUrl === url && "text-blue-500")}
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
            <span>{formatDurationSeconds(progress)}</span>
            <span>{formatDurationSeconds(duration)}</span>
          </div>

          <AudioSlider
            progress={progress}
            duration={duration}
            onSeekCommit={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value;
              }
            }}
          />

          <div className="flex gap-2">
            <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
          </div>
        </section>
      )}
    </>
  )
};