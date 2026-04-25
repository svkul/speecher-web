"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { AudioControls } from "./components/AudioControls";
import { AudioSlider } from "./components/AudioSlider";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import type { AudioPlayerV2Props } from "./types";

export const AudioPlayerV2 = ({ audioUrls }: AudioPlayerV2Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayNextRef = useRef(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0] ?? "");
  const activeAudioUrl = audioUrls.includes(currentAudioUrl) ? currentAudioUrl : (audioUrls[0] ?? "");

  const { play, togglePlayPause, setSrc, setSpeed } = useAudioElement(audioRef);
  const currentTrackIndex = audioUrls.indexOf(activeAudioUrl);
  const previousAudioUrl = currentTrackIndex > 0 ? audioUrls[currentTrackIndex - 1] : null;
  const nextAudioUrl = currentTrackIndex >= 0 ? (audioUrls[currentTrackIndex + 1] ?? null) : null;

  const handleAudioEnded = useCallback(() => {
    const currentIndex = audioUrls.indexOf(activeAudioUrl);
    const upcomingAudioUrl = audioUrls[currentIndex + 1];
    if (!upcomingAudioUrl) return;

    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(upcomingAudioUrl);
  }, [activeAudioUrl, audioUrls]);

  const { isReady, duration, progress, error, isPlaying, speed } = useAudioState(audioRef, handleAudioEnded);

  const handlePreviousTrack = useCallback(() => {
    if (!previousAudioUrl) return;
    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(previousAudioUrl);
  }, [previousAudioUrl]);

  const handleNextTrack = useCallback(() => {
    if (!nextAudioUrl) return;
    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(nextAudioUrl);
  }, [nextAudioUrl]);

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
          <AudioSlider
            progress={progress}
            duration={duration}
            onSeekCommit={(value) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value;
              }
            }}
          />

          <AudioControls
            currentSpeed={speed}
            isPlaying={isPlaying}
            onTogglePlayPause={togglePlayPause}
            onPrevious={handlePreviousTrack}
            onNext={handleNextTrack}
            onSpeedChange={setSpeed}
            isPreviousDisabled={!previousAudioUrl}
            isNextDisabled={!nextAudioUrl}
          />
        </section>
      )}
    </>
  )
};