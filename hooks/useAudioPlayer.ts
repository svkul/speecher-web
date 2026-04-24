"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ServerSpeechDetailResponse } from "@/lib/server-api";

export const PLAYBACK_SPEEDS = [0.7, 0.8, 0.9, 1, 1.2, 1.3, 1.5] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

interface Track {
  id: string;
  url: string;
  title: string;
  order: number;
}

interface AudioPlayerState {
  isInitialized: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTrackIndex: number | null;
  playbackSpeed: PlaybackSpeed;
  progress: {
    position: number;
    duration: number;
    buffered: number;
  };
}

interface AudioPlayerActions {
  initializePlayer: (
    blocks: ServerSpeechDetailResponse["blocks"],
  ) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipForward: (seconds: number) => Promise<void>;
  skipBackward: (seconds: number) => Promise<void>;
  setSpeed: (speed: PlaybackSpeed) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  playTrack: (index: number) => Promise<void>;
  cleanup: () => Promise<void>;
}

export interface UseAudioPlayerReturn
  extends AudioPlayerState, AudioPlayerActions {
  tracks: Track[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

function convertBlocksToTracks(
  blocks: ServerSpeechDetailResponse["blocks"],
): Track[] {
  return blocks
    .filter((block) => Boolean(block.audioUrl))
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      id: block.id,
      url: block.audioUrl as string,
      title: block.title || `Block ${block.order + 1}`,
      order: block.order,
    }));
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const autoPlayOnTrackLoadRef = useRef(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null,
  );
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [progress, setProgress] = useState({
    position: 0,
    duration: 0,
    buffered: 0,
  });

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const loadTrack = useCallback(
    async (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      setCurrentTrackIndex(index);
      setProgress((prev) => ({ ...prev, position: 0 }));
    },
    [tracks.length],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrackIndex === null || !tracks[currentTrackIndex])
      return;

    const shouldAutoPlay =
      autoPlayOnTrackLoadRef.current || isPlayingRef.current;
    autoPlayOnTrackLoadRef.current = false;
    audio.pause();
    audio.src = tracks[currentTrackIndex].url;
    audio.load();

    if (shouldAutoPlay) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const initializePlayer = useCallback(
    async (blocks: ServerSpeechDetailResponse["blocks"]) => {
      const nextTracks = convertBlocksToTracks(blocks);
      setTracks(nextTracks);
      setIsInitialized(nextTracks.length > 0);
      setCurrentTrackIndex(nextTracks.length > 0 ? 0 : null);
      setIsPlaying(false);
      setProgress({ position: 0, duration: 0, buffered: 0 });
    },
    [],
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsLoading(true);
    try {
      await audio.play();
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const seekTo = useCallback(async (position: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, position);
    setProgress((prev) => ({ ...prev, position: audio.currentTime }));
  }, []);

  const skipForward = useCallback(
    async (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const maxDuration = Number.isFinite(audio.duration)
        ? audio.duration
        : progress.duration;
      const next = Math.min(
        audio.currentTime + seconds,
        maxDuration || audio.currentTime + seconds,
      );
      audio.currentTime = next;
      setProgress((prev) => ({ ...prev, position: next }));
    },
    [progress.duration],
  );

  const skipBackward = useCallback(async (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.max(0, audio.currentTime - seconds);
    audio.currentTime = next;
    setProgress((prev) => ({ ...prev, position: next }));
  }, []);

  const setSpeed = useCallback(async (speed: PlaybackSpeed) => {
    const audio = audioRef.current;
    setPlaybackSpeed(speed);
    if (audio) {
      audio.playbackRate = speed;
    }
  }, []);

  const nextTrack = useCallback(async () => {
    if (currentTrackIndex === null || currentTrackIndex >= tracks.length - 1)
      return;
    await loadTrack(currentTrackIndex + 1);
  }, [currentTrackIndex, tracks.length, loadTrack]);

  const previousTrack = useCallback(async () => {
    if (currentTrackIndex === null || currentTrackIndex <= 0) return;
    await loadTrack(currentTrackIndex - 1);
  }, [currentTrackIndex, loadTrack]);

  const playTrack = useCallback(
    async (index: number) => {
      await loadTrack(index);
      await play();
    },
    [loadTrack, play],
  );

  const cleanup = useCallback(async () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setIsInitialized(false);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTrackIndex(null);
    setTracks([]);
    setProgress({ position: 0, duration: 0, buffered: 0 });
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress((prev) => ({
        ...prev,
        position: audio.currentTime || 0,
        buffered:
          audio.buffered.length > 0
            ? audio.buffered.end(audio.buffered.length - 1)
            : prev.buffered,
      }));
    };
    const onLoadedMetadata = () => {
      setProgress((prev) => ({ ...prev, duration: audio.duration || 0 }));
      audio.playbackRate = playbackSpeed;
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
        autoPlayOnTrackLoadRef.current = true;
        void loadTrack(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrackIndex, tracks.length, loadTrack, play, playbackSpeed]);

  return {
    isInitialized,
    isPlaying,
    isLoading,
    currentTrackIndex,
    playbackSpeed,
    progress: {
      ...progress,
    },
    tracks,
    audioRef,
    initializePlayer,
    play,
    pause,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    setSpeed,
    nextTrack,
    previousTrack,
    playTrack,
    cleanup,
  };
}
