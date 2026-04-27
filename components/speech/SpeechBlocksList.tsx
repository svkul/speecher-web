"use client";

import type { ServerSpeechDetailResponse } from "@/lib/api/server";

import { getCurrentPlayingLine } from "@/components/speech/getCurrentPlayingLine";

interface SpeechBlocksListProps {
  blocks: ServerSpeechDetailResponse["blocks"];
  currentPlayingBlockId: string | null;
  position: number;
  seekTarget: { blockId: string; timeSeconds: number } | null;
  onSeekToLineAndPlay: (blockId: string, timeSeconds: number) => void | Promise<void>;
}

export function SpeechBlocksList({
  blocks,
  currentPlayingBlockId,
  position,
  seekTarget,
  onSeekToLineAndPlay,
}: SpeechBlocksListProps) {
  const hasAudio = blocks.some((block) => Boolean(block.audioUrl));
  const hasBlocksWithoutAudio = blocks.some((block) => !block.audioUrl);
  const scrollTargetBlockId = seekTarget?.blockId ?? currentPlayingBlockId;
  const scrollTargetTime = seekTarget ? seekTarget.timeSeconds : position;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Blocks: {blocks.length}
        </p>

        {hasAudio && (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            Audio generated
          </span>
        )}

        {hasBlocksWithoutAudio && (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Needs audio
          </span>
        )}
      </div>

      <ul className="space-y-3">
        {blocks.map((block) => (
          <li
            key={block.id}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-medium text-black dark:text-zinc-100">
                {block.title || `Block ${block.order + 1}`}
              </h2>

              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {block.audioUrl ? "Audio ready" : "No audio"}
              </span>
            </div>

            {block.lines?.length ? (
              <div className="mt-2 space-y-1">
                {block.lines.map((line) => (
                  <button
                    type="button"
                    key={`${block.id}-${line.line}`}
                    onClick={() => {
                      if (line.timeSeconds != null) {
                        void onSeekToLineAndPlay(block.id, line.timeSeconds);
                      }
                    }}
                    disabled={line.timeSeconds == null}
                    className={`block w-full rounded px-2 py-1 text-left text-sm ${block.id === scrollTargetBlockId &&
                      line.line ===
                      getCurrentPlayingLine(
                        block.lines
                          .filter(
                            (item): item is typeof item & { timeSeconds: number } =>
                              item.timeSeconds != null,
                          )
                          .map((item) => ({
                            line: item.line,
                            timeSeconds: item.timeSeconds,
                          })),
                        scrollTargetTime,
                      )
                      ? "bg-zinc-200 font-medium text-black dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300"
                      }`}
                  >
                    {line.text}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {block.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
