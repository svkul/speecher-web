export interface AudioPlayerV2Props {
  audioUrls: string[];
}

export type AudioElementHook = {
  play: () => Promise<void>;
  pause: () => void;
  togglePlayPause: () => Promise<void>;
  setSrc: (url: string) => void;
};

export type AudioState = {
  isReady: boolean;
  duration: number;
  progress: number;
  isPlaying: boolean;
  error: Error | null;
};
