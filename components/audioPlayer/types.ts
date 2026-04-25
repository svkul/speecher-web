export interface AudioPlayerV2Props {
  audioUrls: string[];
}

export type AudioElementHook = {
  play: () => Promise<void>;
  pause: () => void;
  setSpeed: (speed: number) => void;
  togglePlayPause: () => Promise<void>;
  setSrc: (url: string) => void;
};

export type AudioState = {
  isReady: boolean;
  duration: number;
  progress: number;
  isPlaying: boolean;
  speed: number;
  error: Error | null;
};

export const SPEEDS = [
  {
    label: "0.5x",
    value: 0.5,
  },
  {
    label: "1x",
    value: 1,
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
