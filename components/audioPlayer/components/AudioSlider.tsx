"use client";

import { useEffect, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";

type AudioSliderProps = {
  progress: number;
  duration: number;
  onSeekCommit: (value: number) => void;
};

const SEEK_SYNC_DELAY_MS = 150;

export const AudioSlider = ({ progress, duration, onSeekCommit }: AudioSliderProps) => {
  const releaseSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [seekValue, setSeekValue] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (releaseSyncTimeoutRef.current) {
        clearTimeout(releaseSyncTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Slider
      value={[seekValue ?? progress]}
      max={duration}
      step={0.1}
      onValueChange={(value) => {
        setSeekValue(value[0]);
      }}
      onValueCommit={(value) => {
        onSeekCommit(value[0]);
        setSeekValue(value[0]);

        if (releaseSyncTimeoutRef.current) {
          clearTimeout(releaseSyncTimeoutRef.current);
        }

        releaseSyncTimeoutRef.current = setTimeout(() => {
          setSeekValue(null);
          releaseSyncTimeoutRef.current = null;
        }, SEEK_SYNC_DELAY_MS);
      }}
      className="mx-auto w-full"
    />
  );
};
