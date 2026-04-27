import { memo } from "react";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteSpeechBlockAudioClient } from "@/lib/api/client";
import type { AudioTextProps } from "../types";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

export const AudioText = memo(({ speechId, block, isActiveBlock, activeLineNumber }: AudioTextProps) => {
  const queryClient = useQueryClient();

  const deleteAudioMutation = useMutation({
    mutationFn: () => deleteSpeechBlockAudioClient(block.id),
    onSuccess: async () => {
      toast.success("Audio file deleted");
      await queryClient.invalidateQueries({ queryKey: ["speech", speechId] });
      await queryClient.invalidateQueries({ queryKey: ["speeches"] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete audio";
      toast.error(message);
    },
  });

  if (block.lines.length === 0) {
    return <p className="text-sm text-gray-600 whitespace-pre-wrap">{block.text}</p>;
  }

  return (
    <section className="space-y-1">
      <header className="flex items-center justify-between">
        <h2 className="text-sm text-gray-600 whitespace-pre-wrap">{block.title}</h2>

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

        return (
          <p
            key={line.line}
            className={cn(
              "text-sm text-gray-600 whitespace-pre-wrap transition-colors",
              isActiveLine && "text-blue-600 font-medium",
            )}
          >
            {line.text}
          </p>
        );
      })}
    </section>
  );
});

AudioText.displayName = "AudioText";