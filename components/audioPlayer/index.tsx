"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  getActivePlayingLine,
  getAudioTimeForLine,
} from "@/feature/speech/lib/getCurrentPlayingLine";

import type { AudioPlayerProps } from "./types";
import { AudioControls } from "./components/AudioControls";
import { AudioSlider } from "./components/AudioSlider";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import { AudioText } from "./components/AudioText";

export const AudioPlayer = ({ speechId, audioUrls, blocks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const shouldAutoPlayNextRef = useRef(false);
  const pendingSeekRef = useRef<{ blockId: string; lineNumber: number } | null>(
    null,
  );
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0] ?? "");
  const activeAudioUrl = audioUrls.includes(currentAudioUrl)
    ? currentAudioUrl
    : (audioUrls[0] ?? "");
  const activeBlock =
    blocks.find((block) => block.audioUrl === activeAudioUrl) ?? null;

  const { play, togglePlayPause, setSrc, setSpeed } = useAudioElement(audioRef);
  const currentTrackIndex = audioUrls.indexOf(activeAudioUrl);
  const previousAudioUrl =
    currentTrackIndex > 0 ? audioUrls[currentTrackIndex - 1] : null;
  const nextAudioUrl =
    currentTrackIndex >= 0 ? (audioUrls[currentTrackIndex + 1] ?? null) : null;

  const handleAudioEnded = useCallback(() => {
    const currentIndex = audioUrls.indexOf(activeAudioUrl);
    const upcomingAudioUrl = audioUrls[currentIndex + 1];
    if (!upcomingAudioUrl) return;

    shouldAutoPlayNextRef.current = true;
    setCurrentAudioUrl(upcomingAudioUrl);
  }, [activeAudioUrl, audioUrls]);

  const { isReady, duration, progress, error, isPlaying, speed } = useAudioState(
    audioRef,
    handleAudioEnded,
  );

  // Keep highlight in sync with the active track; reset immediately on URL change
  // (before loadstart) so we don't flash the previous track's end progress.
  const [highlightTrackUrl, setHighlightTrackUrl] = useState(activeAudioUrl);
  if (highlightTrackUrl !== activeAudioUrl) {
    setHighlightTrackUrl(activeAudioUrl);
  }
  const progressForHighlight =
    highlightTrackUrl !== activeAudioUrl ? 0 : progress;

  const seekAndPlay = useCallback(
    (timeSeconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const maxTime = Number.isFinite(audio.duration)
        ? audio.duration
        : timeSeconds;
      audio.currentTime = Math.min(
        Math.max(timeSeconds, 0),
        Math.max(maxTime, 0),
      );
      void play();
    },
    [play],
  );

  const handleLineClick = useCallback(
    (blockId: string, lineNumber: number) => {
      const block = blocks.find((item) => item.id === blockId);
      if (!block?.audioUrl) return;

      if (block.audioUrl !== activeAudioUrl) {
        pendingSeekRef.current = { blockId, lineNumber };
        shouldAutoPlayNextRef.current = true;
        setCurrentAudioUrl(block.audioUrl);
        return;
      }

      const seekTime = getAudioTimeForLine(block.lines, lineNumber, duration);
      if (seekTime == null) return;

      seekAndPlay(seekTime);
    },
    [activeAudioUrl, blocks, duration, seekAndPlay],
  );

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
      shouldAutoPlayNextRef.current = false;
      // Line-click seek waits for loadedmetadata before playing
      if (!pendingSeekRef.current) {
        void play();
      }
    }
  }, [activeAudioUrl, play, setSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      const pendingSeek = pendingSeekRef.current;
      if (!pendingSeek) return;

      pendingSeekRef.current = null;
      const block = blocks.find((item) => item.id === pendingSeek.blockId);
      if (!block) return;

      const seekTime = getAudioTimeForLine(
        block.lines,
        pendingSeek.lineNumber,
        audio.duration,
      );
      if (seekTime == null) return;

      const maxTime = Number.isFinite(audio.duration)
        ? audio.duration
        : seekTime;
      audio.currentTime = Math.min(
        Math.max(seekTime, 0),
        Math.max(maxTime, 0),
      );
      void play();
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [play, activeAudioUrl, blocks]);

  const activeLineNumber = useMemo(() => {
    if (!activeBlock) {
      return null;
    }

    const safeProgress =
      !isReady || (duration > 0 && progressForHighlight > duration + 0.25)
        ? 0
        : progressForHighlight;

    return getActivePlayingLine(
      activeBlock.lines,
      safeProgress,
      duration || undefined,
    );
  }, [activeBlock, progressForHighlight, duration, isReady]);

  return (
    <>
      <div>
        <ul>
          {audioUrls.map((url) => (
            <li
              key={url}
              className={cn(
                "text-sm text-gray-500",
                activeAudioUrl === url && "text-blue-500",
              )}
              onClick={() => setCurrentAudioUrl(url)}
            >
              {url.split("/").pop()}
            </li>
          ))}
        </ul>
      </div>

      {blocks.map((block) => (
        <AudioText
          key={block.id}
          speechId={speechId}
          block={block}
          isActiveBlock={block.id === activeBlock?.id}
          activeLineNumber={
            block.id === activeBlock?.id ? activeLineNumber : null
          }
          onLineClick={handleLineClick}
        />
      ))}

      <audio ref={audioRef} />

      {error && audioUrls.length > 0 && <div>{error.message}</div>}

      {!isReady && audioUrls.length > 0 && <div>Loading...</div>}

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
  );
};
