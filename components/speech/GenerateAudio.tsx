"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface GenerateAudioResponse {
  successCount: number;
  failureCount: number;
}

interface GenerateAudioProps {
  speechId: string;
}

export function GenerateAudio({ speechId }: GenerateAudioProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleGenerate = async () => {
    setIsPending(true);

    try {
      const response = await fetch(`/api/speeches/${speechId}/generate-audio`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate audio");
      }

      const data = (await response.json()) as GenerateAudioResponse;
      toast.success(
        `Audio generated: ${data.successCount} success, ${data.failureCount} failures`,
      );
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate audio";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={isPending}>
      {isPending ? "Generating..." : "Generate Audio for All Blocks"}
    </Button>
  );
}
