"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { AudioPlayerProps } from "./types";
import { AudioControls } from "./components/AudioControls";
import { AudioSlider } from "./components/AudioSlider";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import { AudioText } from "./components/AudioText";

const getActiveLineNumber = (
  lines: { line: number; timeSeconds: number | null }[],
  progress: number,
): number | null => {
  if (lines.length === 0) {
    return null;
  }

  let low = 0;
  let high = lines.length - 1;
  let activeIndex = -1;

  while (low <= high) {
    const middle = (low + high) >> 1;
    const lineTime = lines[middle]?.timeSeconds;

    if (lineTime == null || lineTime > progress) {
      high = middle - 1;
      continue;
    }

    activeIndex = middle;
    low = middle + 1;
  }

  return activeIndex >= 0 ? lines[activeIndex]?.line ?? null : null;
};

export const AudioPlayer = ({ speechId, audioUrls, blocks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayNextRef = useRef(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0] ?? "");
  const activeAudioUrl = audioUrls.includes(currentAudioUrl) ? currentAudioUrl : (audioUrls[0] ?? "");
  const activeBlock = blocks.find((block) => block.audioUrl === activeAudioUrl) ?? null;

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

  const activeLineNumber = useMemo(() => {
    if (!activeBlock) {
      return null;
    }

    return getActiveLineNumber(activeBlock.lines, progress);
  }, [activeBlock, progress]);

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

      {blocks.map((block) => (
        <AudioText
          key={block.id}
          speechId={speechId}
          block={block}
          isActiveBlock={block.id === activeBlock?.id}
          activeLineNumber={block.id === activeBlock?.id ? activeLineNumber : null}
        />
      ))}

      <audio ref={audioRef} />

      {error && audioUrls.length > 0 && <div>{error.message}</div>}

      {!isReady && audioUrls.length > 0 && (
        <div>Loading...</div>
      )}

      {isReady && audioUrls.length > 0 && (
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