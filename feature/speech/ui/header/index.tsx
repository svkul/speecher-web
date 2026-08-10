import { Pencil } from "lucide-react";

import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";

import { Button } from "@/components/ui/button";

interface SpeechHeaderProps {
  speech: SpeechDetailResponse;
  isEditing?: boolean;
  onEdit?: () => void;
}

export const SpeechHeader = ({
  speech,
  isEditing = false,
  onEdit,
}: SpeechHeaderProps) => {
  return (
    <header className="flex flex-1 items-center justify-between gap-6 w-full">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {speech.title}
      </h1>

      {!isEditing && (
        <div className="flex items-center gap-3">
          <Button variant="outline" className="ml-auto" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
        </div>
      )}
    </header>
  );
};
