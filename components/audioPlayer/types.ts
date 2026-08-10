import type { SpeechBlockResponse } from "@/feature/speech/api/get-speech";

export interface AudioPlayerProps {
  blocks: SpeechBlockResponse[];
}

export type AudioTextProps = {
  block: SpeechBlockResponse;
  isActiveBlock: boolean;
  activeLineNumber: number | null;
  onLineClick?: (blockId: string, lineNumber: number) => void;
};

export type AudioElementHook = {
  play: () => Promise<void>;
  pause: () => void;
  setSpeed: (speed: number) => void;
  getSpeed: () => number;
  togglePlayPause: () => Promise<void>;
  setSrc: (url: string) => boolean;
  seekTo: (timeSeconds: number) => void;
  skipBy: (deltaSeconds: number) => void;
  applyPlaybackRate: () => void;
};

export type AudioState = {
  /** True after the first track has loaded metadata; stays true across track switches. */
  isReady: boolean;
  /** True while a new source is loading (including between playlist tracks). */
  isBuffering: boolean;
  duration: number;
  progress: number;
  isPlaying: boolean;
  speed: number;
  error: Error | null;
};

export type PlaybackIntent =
  | { kind: "play-from-start" }
  | { kind: "seek-line"; blockId: string; lineNumber: number }
  | {
      kind: "preserve-position";
      position: number;
      wasPlaying: boolean;
    };

export const SPEED_STORAGE_KEY = "speecher.audio.playbackRate";

export const SKIP_SECONDS = 5;

export const SPEEDS = [
  {
    label: "0.5x",
    value: 0.5,
  },
  {
    label: "0.7x",
    value: 0.7,
  },
  {
    label: "0.8x",
    value: 0.8,
  },
  {
    label: "0.9x",
    value: 0.9,
  },
  {
    label: "1x",
    value: 1,
  },
  {
    label: "1.1x",
    value: 1.1,
  },
  {
    label: "1.2x",
    value: 1.2,
  },
  {
    label: "1.3x",
    value: 1.3,
  },
  {
    label: "1.4x",
    value: 1.4,
  },
  {
    label: "1.5x",
    value: 1.5,
  },
  {
    label: "2x",
    value: 2,
  },
];
