"use client";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useAudioElement } from "./hook/useAudioElement";
import { useAudioState } from "./hook/useAudioState";
import type { AudioPlayerV2Props } from "./types";

import { Slider } from "@/components/ui/slider";


export const AudioPlayerV2 = ({ audioUrls }: AudioPlayerV2Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>(audioUrls[0]);

  const { togglePlayPause, setSrc } = useAudioElement(audioRef);
  const { isReady, duration, progress, error, isPlaying } = useAudioState(audioRef);

  useEffect(() => {
    setSrc(currentAudioUrl);
  }, [currentAudioUrl]);

  return (
    <>
      <div>
        <ul>
          {audioUrls.map((url) => (
            <li
              key={url}
              className={cn("text-sm text-gray-500", currentAudioUrl === url && "text-blue-500")}
              onClick={() => setCurrentAudioUrl(url)}
            >{url.split('/').pop()}</li>
          ))}
        </ul>
      </div>

      <audio ref={audioRef} />

      {error && <div>{error.message}</div>}

      {!isReady ? (
        <div>Loading...</div>
      ) : (
        <section>
          <div>{duration}</div>

          <div>{progress}</div>

          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={(value) => {
              const newTime = (value[0] / 100) * duration;
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            }}
            className="mx-auto w-full max-w-xs"
          />

          <div className="flex gap-2">
            <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
          </div>
        </section>
      )}
    </>
  )
};