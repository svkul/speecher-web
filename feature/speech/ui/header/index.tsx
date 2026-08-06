import { Pencil } from "lucide-react";

import type { SpeechDetailResponse } from "@/feature/speech/api/get-speech";

import { Button } from "@/components/ui/button";
import { DeleteSpeech } from "./DeleteSpeech";

interface SpeechHeaderProps {
  speech: SpeechDetailResponse;
}

export const SpeechHeader = ({ speech }: SpeechHeaderProps) => {
  return (
    <header className="flex flex-1 items-center justify-between gap-6 w-full">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {speech.title}
      </h1>

      <div className="flex  items-center gap-3">
        <DeleteSpeech speechId={speech.id} />

        <Button variant="outline" className="ml-auto">
          <Pencil />
          Edit
        </Button>
      </div>
    </header>
  );
};