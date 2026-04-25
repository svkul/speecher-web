"use client";

import { Pause, Play, StepBack, StepForward } from "lucide-react";

import { Button } from "@/components/ui/button";

type AudioControlsProps = {
  isPlaying: boolean;
  onTogglePlayPause: () => Promise<void>;
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
};

export const AudioControls = ({
  isPlaying,
  onTogglePlayPause,
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled
}: AudioControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button size="icon-sm" disabled={isPreviousDisabled} onClick={onPrevious}>
        <StepBack />
      </Button>

      <Button onClick={onTogglePlayPause} size="icon-lg">
        {isPlaying ? <Pause /> : <Play />}
      </Button>

      <Button size="icon-sm" disabled={isNextDisabled} onClick={onNext}>
        <StepForward />
      </Button>
    </div>
  );
};
