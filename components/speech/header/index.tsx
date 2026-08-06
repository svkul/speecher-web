import { Pencil } from "lucide-react";

import { ServerSpeechDetailResponse } from "@/lib/api/server";

import { Button } from "@/components/ui/button";
import { DeleteSpeech } from "./DeleteSpeech";

interface SpeechHeaderProps {
  speech: ServerSpeechDetailResponse;
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