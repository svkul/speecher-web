import { memo, useEffect, useRef } from "react";

import type { AudioTextProps } from "../types";

import { cn } from "@/lib/utils";

export const AudioText = memo(
  ({
    block,
    isActiveBlock,
    activeLineNumber,
    onLineClick,
  }: AudioTextProps) => {
    const activeLineRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      if (!isActiveBlock || activeLineNumber == null) return;
      activeLineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, [activeLineNumber, isActiveBlock]);

    if (block.lines.length === 0) {
      return (
        <section
          className={cn(
            "space-y-1 rounded-md px-1 py-1",
            isActiveBlock && "bg-zinc-50 dark:bg-zinc-900/40",
          )}
        >
          <h2 className="text-sm text-gray-600 whitespace-pre-wrap">
            {block.title}
          </h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{block.text}</p>
        </section>
      );
    }

    return (
      <section
        className={cn(
          "space-y-1 rounded-md px-1 py-1",
          isActiveBlock && "bg-zinc-50 dark:bg-zinc-900/40",
        )}
      >
        <h2 className="text-sm text-gray-600 whitespace-pre-wrap">
          {block.title}
        </h2>

        {block.lines.map((line) => {
          const isActiveLine = isActiveBlock && activeLineNumber === line.line;
          const canSeek =
            Boolean(block.audioUrl) && line.text.trim().length > 0;

          return (
            <button
              type="button"
              key={line.line}
              ref={isActiveLine ? activeLineRef : undefined}
              disabled={!canSeek}
              onClick={() => {
                if (!canSeek) return;
                onLineClick?.(block.id, line.line);
              }}
              className={cn(
                "block w-full rounded px-1 py-0.5 text-left text-sm whitespace-pre-wrap transition-colors",
                canSeek &&
                  "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900",
                !canSeek && "cursor-default opacity-80",
                isActiveLine
                  ? "bg-zinc-200 font-medium text-blue-700 dark:bg-zinc-700 dark:text-blue-300"
                  : "text-gray-600",
              )}
            >
              {line.text}
            </button>
          );
        })}
      </section>
    );
  },
);

AudioText.displayName = "AudioText";
