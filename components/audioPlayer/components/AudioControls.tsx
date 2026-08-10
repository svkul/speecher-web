"use client";

import {
  Gauge,
  Pause,
  Play,
  Redo2,
  StepBack,
  StepForward,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SKIP_SECONDS, SPEEDS } from "../types";

type AudioControlsProps = {
  currentSpeed: number;
  isPlaying: boolean;
  onTogglePlayPause: () => Promise<void>;
  onPrevious: () => void;
  onNext: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onSpeedChange: (speed: number) => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
};

export const AudioControls = ({
  currentSpeed,
  isPlaying,
  onTogglePlayPause,
  onPrevious,
  onNext,
  onSkipBackward,
  onSkipForward,
  onSpeedChange,
  isPreviousDisabled,
  isNextDisabled,
}: AudioControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="icon-sm"
        variant="outline"
        disabled={isPreviousDisabled}
        onClick={onPrevious}
        aria-label="Previous block"
      >
        <StepBack />
      </Button>

      <Button
        size="icon-sm"
        variant="outline"
        onClick={onSkipBackward}
        aria-label={`Skip back ${SKIP_SECONDS} seconds`}
      >
        <Undo2 />
      </Button>

      <Button
        onClick={onTogglePlayPause}
        size="icon-lg"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>

      <Button
        size="icon-sm"
        variant="outline"
        onClick={onSkipForward}
        aria-label={`Skip forward ${SKIP_SECONDS} seconds`}
      >
        <Redo2 />
      </Button>

      <Button
        size="icon-sm"
        variant="outline"
        disabled={isNextDisabled}
        onClick={onNext}
        aria-label="Next block"
      >
        <StepForward />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="relative"
            aria-label="Playback speed"
          >
            <Gauge />
            <span className="absolute top-[-2px] right-[-2px] text-[8px]">
              {currentSpeed}x
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Speed</DropdownMenuLabel>

            {SPEEDS.map((speed) => (
              <DropdownMenuItem
                key={speed.value}
                onClick={() => onSpeedChange(speed.value)}
              >
                {speed.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
