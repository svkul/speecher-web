"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  generateSpeechAudioAction,
} from "@/feature/speech/actions/generate-speech-audio-action";
import type { GenerateSpeechAudioResponse } from "@/feature/speech/api/generate-speech-audio";

import { Button } from "@/components/ui/button";

interface GenerateAudioProps {
  speechId: string;
}

export function GenerateAudio({ speechId }: GenerateAudioProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (): Promise<GenerateSpeechAudioResponse> => {
      const result = await generateSpeechAudioAction(speechId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: async (data) => {
      toast.success(
        `Audio generated: ${data.successCount} success, ${data.failureCount} failures`,
      );
      await queryClient.invalidateQueries({ queryKey: ["speech", speechId] });
      await queryClient.invalidateQueries({ queryKey: ["speeches"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to generate audio";
      toast.error(message);
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? "Generating..." : "Generate Audio for All Blocks"}
    </Button>
  );
}
