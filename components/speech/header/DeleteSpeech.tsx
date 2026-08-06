"use client";

import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteSpeechClient } from "@/lib/api/client";

import { Button } from "@/components/ui/button";

interface DeleteSpeechProps {
  speechId: string;
}

export const DeleteSpeech = ({ speechId }: DeleteSpeechProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteSpeechMutation = useMutation({
    mutationFn: () => deleteSpeechClient(speechId),
    onSuccess: async () => {
      toast.success("Speech deleted");
      queryClient.removeQueries({ queryKey: ["speech", speechId] });
      await queryClient.invalidateQueries({ queryKey: ["speeches"] });
      router.push("/speeches");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete speech";
      toast.error(message);
    },
  });

  return (
    <Button
      variant="outline"
      className="ml-auto"
      onClick={() => deleteSpeechMutation.mutate()}
      disabled={deleteSpeechMutation.isPending}
    >
      <Trash2 />
      Delete
    </Button>
  );
};