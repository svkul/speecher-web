import { memo } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSpeechBlockAudioAction } from "@/feature/speech/actions/delete-speech-block-audio-action";
import type { AudioTextProps } from "../types";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export const AudioText = memo(
  ({
    speechId,
    block,
    isActiveBlock,
    activeLineNumber,
    onLineClick,
  }: AudioTextProps) => {
    const queryClient = useQueryClient();

    const deleteAudioMutation = useMutation({
      mutationFn: async () => {
        const result = await deleteSpeechBlockAudioAction(speechId, block.id);

        if (result.error) {
          throw new Error(result.error);
        }
      },
      onSuccess: async () => {
        toast.success("Audio file deleted");
        await queryClient.invalidateQueries({ queryKey: ["speech", speechId] });
        await queryClient.invalidateQueries({ queryKey: ["speeches"] });
      },
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Failed to delete audio";
        toast.error(message);
      },
    });

    if (block.lines.length === 0) {
      return (
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{block.text}</p>
      );
    }

    return (
      <section className="space-y-1">
        <header className="flex items-center justify-between">
          <h2 className="text-sm text-gray-600 whitespace-pre-wrap">
            {block.title}
          </h2>

          {block.audioUrl && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => deleteAudioMutation.mutate()}
              disabled={deleteAudioMutation.isPending}
            >
              <Trash2 size={20} />
            </Button>
          )}
        </header>

        {block.lines.map((line) => {
          const isActiveLine = isActiveBlock && activeLineNumber === line.line;
          const canSeek = line.timeSeconds != null && Boolean(block.audioUrl);

          return (
            <button
              type="button"
              key={line.line}
              disabled={!canSeek}
              onClick={() => {
                if (!canSeek) return;
                onLineClick?.(block.id, line.line);
              }}
              className={cn(
                "block w-full rounded px-1 py-0.5 text-left text-sm whitespace-pre-wrap transition-colors",
                canSeek && "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900",
                !canSeek && "cursor-default opacity-80",
                isActiveLine
                  ? "text-blue-600 font-medium"
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
