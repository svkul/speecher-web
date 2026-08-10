"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getActivePlayingLine,
  getAudioTimeForLine,
} from "@/feature/speech/lib/getCurrentPlayingLine";

import type { AudioPlayerProps, PlaybackIntent } from "./types";
import { SKIP_SECONDS } from "./types";
import { AudioControls } from "./components/AudioControls";
import { AudioSlider } from "./components/AudioSlider";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import { useNextTrackPreload } from "./hook/useNextTrackPreload";
import { AudioText } from "./components/AudioText";

export const AudioPlayer = ({ blocks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intentRef = useRef<PlaybackIntent | null>(null);
  const activeBlockIdRef = useRef<string | null>(null);
  const lastBlockIdRef = useRef<string | null>(null);
  const lastSrcRef = useRef<string | null>(null);

  const playlist = useMemo(
    () => blocks.filter((block) => Boolean(block.audioUrl)),
    [blocks],
  );

  const [currentBlockId, setCurrentBlockId] = useState<string | null>(
    () => playlist[0]?.id ?? null,
  );

  const activeBlockId = useMemo(() => {
    if (currentBlockId && playlist.some((block) => block.id === currentBlockId)) {
      return currentBlockId;
    }
    return playlist[0]?.id ?? null;
  }, [currentBlockId, playlist]);

  activeBlockIdRef.current = activeBlockId;

  const activeBlock =
    playlist.find((block) => block.id === activeBlockId) ?? null;
  const activeSrc = activeBlock?.audioUrl ?? null;

  const currentTrackIndex = activeBlockId
    ? playlist.findIndex((block) => block.id === activeBlockId)
    : -1;
  const previousBlockId =
    currentTrackIndex > 0 ? playlist[currentTrackIndex - 1]?.id ?? null : null;
  const nextBlock =
    currentTrackIndex >= 0 ? (playlist[currentTrackIndex + 1] ?? null) : null;
  const nextBlockId = nextBlock?.id ?? null;
  const nextSrc = nextBlock?.audioUrl ?? null;

  useNextTrackPreload(nextSrc);

  const {
    play,
    togglePlayPause,
    setSrc,
    setSpeed,
    seekTo,
    skipBy,
    applyPlaybackRate,
  } = useAudioElement(audioRef);

  const fulfillIntent = useCallback(() => {
    const audio = audioRef.current;
    const intent = intentRef.current;
    if (!audio || !intent) return;

    applyPlaybackRate();

    if (intent.kind === "play-from-start") {
      intentRef.current = null;
      seekTo(0);
      void play();
      return;
    }

    if (intent.kind === "preserve-position") {
      intentRef.current = null;
      seekTo(intent.position);
      if (intent.wasPlaying) {
        void play();
      }
      return;
    }

    if (intent.kind === "seek-line") {
      const block =
        blocks.find((item) => item.id === intent.blockId) ?? activeBlock;
      if (!block || block.id !== activeBlockIdRef.current) {
        return;
      }

      const seekTime = getAudioTimeForLine(
        block.lines,
        intent.lineNumber,
        Number.isFinite(audio.duration) ? audio.duration : undefined,
      );
      intentRef.current = null;
      if (seekTime == null) {
        void play();
        return;
      }

      seekTo(seekTime);
      void play();
    }
  }, [activeBlock, applyPlaybackRate, blocks, play, seekTo]);

  const handleMediaReady = useCallback(() => {
    applyPlaybackRate();
    fulfillIntent();
  }, [applyPlaybackRate, fulfillIntent]);

  const selectBlock = useCallback(
    (blockId: string, intent: PlaybackIntent) => {
      intentRef.current = intent;
      setCurrentBlockId(blockId);
    },
    [],
  );

  const handleAudioEnded = useCallback(() => {
    const index = playlist.findIndex(
      (block) => block.id === activeBlockIdRef.current,
    );
    const upcoming = playlist[index + 1];
    if (!upcoming) return;

    selectBlock(upcoming.id, { kind: "play-from-start" });
  }, [playlist, selectBlock]);

  const {
    isReady,
    isBuffering,
    duration,
    progress,
    error,
    isPlaying,
    speed,
  } = useAudioState(audioRef, handleAudioEnded, handleMediaReady);

  const handleLineClick = useCallback(
    (blockId: string, lineNumber: number) => {
      const block = blocks.find((item) => item.id === blockId);
      if (!block?.audioUrl) return;

      if (block.id !== activeBlockId) {
        selectBlock(blockId, { kind: "seek-line", blockId, lineNumber });
        return;
      }

      const seekTime = getAudioTimeForLine(
        block.lines,
        lineNumber,
        duration > 0 ? duration : undefined,
      );
      if (seekTime == null) return;

      seekTo(seekTime);
      void play();
    },
    [activeBlockId, blocks, duration, play, seekTo, selectBlock],
  );

  const handlePreviousTrack = useCallback(() => {
    if (!previousBlockId) return;
    selectBlock(previousBlockId, { kind: "play-from-start" });
  }, [previousBlockId, selectBlock]);

  const handleNextTrack = useCallback(() => {
    if (!nextBlockId) return;
    selectBlock(nextBlockId, { kind: "play-from-start" });
  }, [nextBlockId, selectBlock]);

  const handleSkipBackward = useCallback(() => {
    skipBy(-SKIP_SECONDS);
  }, [skipBy]);

  const handleSkipForward = useCallback(() => {
    skipBy(SKIP_SECONDS);
  }, [skipBy]);

  // Load / refresh media when the active block or its signed URL changes
  useEffect(() => {
    if (!activeBlockId || !activeSrc) return;

    const previousBlockIdLoaded = lastBlockIdRef.current;
    const previousSrc = lastSrcRef.current;
    if (previousSrc === activeSrc && previousBlockIdLoaded === activeBlockId) {
      return;
    }

    const audio = audioRef.current;
    const isSameBlockUrlRefresh =
      previousBlockIdLoaded === activeBlockId &&
      previousSrc !== null &&
      previousSrc !== activeSrc &&
      intentRef.current === null;

    if (isSameBlockUrlRefresh && audio) {
      intentRef.current = {
        kind: "preserve-position",
        position: audio.currentTime,
        wasPlaying: !audio.paused && !audio.ended,
      };
    }

    lastBlockIdRef.current = activeBlockId;
    lastSrcRef.current = activeSrc;
    setSrc(activeSrc);

    // Cached media may already expose metadata before the event listener runs
    if (
      audio &&
      audio.readyState >= HTMLMediaElement.HAVE_METADATA &&
      intentRef.current
    ) {
      fulfillIntent();
    }
  }, [activeBlockId, activeSrc, fulfillIntent, setSrc]);

  // Keep currentBlockId aligned when playlist shrinks / regenerates
  useEffect(() => {
    if (playlist.length === 0) {
      setCurrentBlockId(null);
      return;
    }

    if (
      currentBlockId &&
      playlist.some((block) => block.id === currentBlockId)
    ) {
      return;
    }

    setCurrentBlockId(playlist[0].id);
  }, [currentBlockId, playlist]);

  const lineTimingDuration =
    duration > 0
      ? duration
      : activeBlock?.duration && activeBlock.duration > 0
        ? activeBlock.duration
        : undefined;

  const activeLineNumber = useMemo(() => {
    if (!activeBlock) {
      return null;
    }

    // Avoid using a previous track's progress against a new track before metadata lands
    if (duration <= 0 && isBuffering) {
      return null;
    }

    const safeProgress =
      Number.isFinite(progress) &&
      !(duration > 0 && progress > duration + 0.5)
        ? progress
        : 0;

    return getActivePlayingLine(
      activeBlock.lines,
      safeProgress,
      lineTimingDuration,
    );
  }, [activeBlock, duration, isBuffering, lineTimingDuration, progress]);

  const hasPlaylist = playlist.length > 0;

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <AudioText
          key={block.id}
          block={block}
          isActiveBlock={block.id === activeBlock?.id}
          activeLineNumber={
            block.id === activeBlock?.id ? activeLineNumber : null
          }
          onLineClick={handleLineClick}
        />
      ))}

      <audio ref={audioRef} preload="auto" />

      {error && hasPlaylist && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error.message}
        </div>
      )}

      {hasPlaylist && !isReady && (
        <div className="text-sm text-zinc-500">Loading audio…</div>
      )}

      {hasPlaylist && isReady && (
        <section className="space-y-2">
          {isBuffering && (
            <p className="text-xs text-zinc-500">Buffering…</p>
          )}

          <AudioSlider
            progress={progress}
            duration={duration}
            onSeekCommit={(value) => {
              seekTo(value);
            }}
          />

          <AudioControls
            currentSpeed={speed}
            isPlaying={isPlaying}
            onTogglePlayPause={togglePlayPause}
            onPrevious={handlePreviousTrack}
            onNext={handleNextTrack}
            onSkipBackward={handleSkipBackward}
            onSkipForward={handleSkipForward}
            onSpeedChange={setSpeed}
            isPreviousDisabled={!previousBlockId}
            isNextDisabled={!nextBlockId}
          />
        </section>
      )}
    </div>
  );
};
