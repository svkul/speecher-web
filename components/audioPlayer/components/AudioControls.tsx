"use client";

import { Pause, Play, StepBack, StepForward, Gauge } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SPEEDS } from "../types";

type AudioControlsProps = {
  currentSpeed: number;
  isPlaying: boolean;
  onTogglePlayPause: () => Promise<void>;
  onPrevious: () => void;
  onNext: () => void;
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
  onSpeedChange,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm" className="relative"><Gauge /> <span className="absolute top-[-2px] right-[-2px] text-[8px]">{currentSpeed}x</span></Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Speed</DropdownMenuLabel>

            {SPEEDS.map((speed) => (
              <DropdownMenuItem key={speed.value} onClick={() => onSpeedChange(speed.value)}>{speed.label}</DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
