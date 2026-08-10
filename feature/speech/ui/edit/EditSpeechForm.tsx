"use client";

import { useEffect, useState, useTransition } from "react";
import { Download, RefreshCw, Trash2, Volume2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { addSpeechBlockAction } from "@/feature/speech/actions/add-speech-block-action";
import { deleteSpeechBlockAction } from "@/feature/speech/actions/delete-speech-block-action";
import { generateSpeechBlockAudioAction } from "@/feature/speech/actions/generate-speech-block-audio-action";
import { getSpeechBlockAudioDownloadUrlAction } from "@/feature/speech/actions/get-speech-block-audio-download-url-action";
import { getTtsVoicesAction } from "@/feature/speech/actions/get-tts-voices-action";
import { updateSpeechAction } from "@/feature/speech/actions/update-speech-action";
import { updateSpeechBlockAction } from "@/feature/speech/actions/update-speech-block-action";
import type { TtsLanguage } from "@/feature/speech/api/get-tts-languages";
import type { TtsModelInfo } from "@/feature/speech/api/get-tts-models";
import type { TtsVoice } from "@/feature/speech/api/get-tts-voices";
import type {
  SpeechBlockResponse,
  SpeechDetailResponse,
} from "@/feature/speech/api/get-speech";
import {
  editSpeechTtsSchema,
  type EditSpeechTtsFormValues,
} from "@/feature/speech/schemas/edit-speech.schema";
import { DeleteSpeech } from "@/feature/speech/ui/header/DeleteSpeech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tab = "text" | "tts";

type Props = {
  speech: SpeechDetailResponse;
  languages: TtsLanguage[];
  models: TtsModelInfo[];
  recommendedModel: string;
  onDone: () => void;
};

const blockDraftSchema = z.object({
  title: z.string().min(1, "Block title is required"),
  text: z.string().min(1, "Block text is required"),
});

type BlockDraftValues = z.infer<typeof blockDraftSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function getAudioFileName(url: string) {
  try {
    const name = url.split("?")[0]?.split("/").pop();
    return name ? decodeURIComponent(name) : "audio";
  } catch {
    return "audio";
  }
}

function textareaClassName(invalid?: boolean) {
  return cn(
    "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
    invalid &&
      "border-destructive ring-3 ring-destructive/20 aria-invalid:border-destructive",
  );
}

export function EditSpeechForm({
  speech,
  languages,
  models,
  recommendedModel,
  onDone,
}: Props) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("tts");
  const [title, setTitle] = useState(speech.title);
  const [isSavingTitle, startSaveTitle] = useTransition();
  const [showNewBlock, setShowNewBlock] = useState(false);
  const [voices, setVoices] = useState<TtsVoice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [isSavingTts, startSaveTts] = useTransition();

  useEffect(() => {
    setTitle(speech.title);
  }, [speech.title]);

  const ttsForm = useForm<EditSpeechTtsFormValues>({
    resolver: zodResolver(editSpeechTtsSchema),
    defaultValues: {
      ttsLanguage: speech.ttsLanguage || languages[0]?.code || "en-US",
      ttsVoice: speech.ttsVoice || "",
      ttsModel:
        speech.ttsModel || recommendedModel || models[0]?.name || "Standard",
      ttsStyle: speech.ttsStyle || "",
    },
    mode: "onTouched",
  });

  const watchedLanguage = ttsForm.watch("ttsLanguage");

  useEffect(() => {
    ttsForm.reset({
      ttsLanguage: speech.ttsLanguage || languages[0]?.code || "en-US",
      ttsVoice: speech.ttsVoice || "",
      ttsModel:
        speech.ttsModel || recommendedModel || models[0]?.name || "Standard",
      ttsStyle: speech.ttsStyle || "",
    });
  }, [
    speech.id,
    speech.ttsLanguage,
    speech.ttsVoice,
    speech.ttsModel,
    speech.ttsStyle,
    languages,
    models,
    recommendedModel,
    ttsForm,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadVoices() {
      if (!watchedLanguage) return;

      setVoicesLoading(true);
      const result = await getTtsVoicesAction(watchedLanguage);

      if (cancelled) return;

      if ("error" in result) {
        toast.error(result.error);
        setVoices([]);
        setVoicesLoading(false);
        return;
      }

      setVoices(result.data.voices);
      const currentVoice = ttsForm.getValues("ttsVoice");
      const stillValid = result.data.voices.some((v) => v.name === currentVoice);
      if (!stillValid) {
        ttsForm.setValue("ttsVoice", result.data.voices[0]?.name ?? "");
      }
      setVoicesLoading(false);
    }

    void loadVoices();

    return () => {
      cancelled = true;
    };
  }, [watchedLanguage, ttsForm]);

  async function invalidateSpeech() {
    await queryClient.invalidateQueries({ queryKey: ["speech", speech.id] });
    await queryClient.invalidateQueries({
      queryKey: ["speech-play-urls", speech.id],
    });
    await queryClient.invalidateQueries({ queryKey: ["speeches"] });
  }

  const titleDirty = title.trim() !== speech.title;
  const canRemoveBlock = speech.blocks.length > 1;

  function onSaveTitle() {
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast.error("Speech title is required");
      return;
    }

    startSaveTitle(async () => {
      const result = await updateSpeechAction(speech.id, { title: nextTitle });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Title saved");
      await invalidateSpeech();
    });
  }

  function onSaveTts(values: EditSpeechTtsFormValues) {
    setTtsError(null);

    startSaveTts(async () => {
      const result = await updateSpeechAction(speech.id, {
        ttsLanguage: values.ttsLanguage,
        ttsVoice: values.ttsVoice,
        ttsModel: values.ttsModel,
        ttsStyle: values.ttsStyle?.trim() ? values.ttsStyle.trim() : "",
      });

      if ("error" in result) {
        setTtsError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("TTS settings saved");
      await invalidateSpeech();
    });
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Edit speech sections"
          className="flex gap-1 rounded-md border border-zinc-200 p-1 dark:border-zinc-800"
        >
          {(
            [
              { id: "tts", label: "TTS" },
              { id: "text", label: "Text" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded px-3 py-1.5 text-sm transition-colors",
                tab === item.id
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DeleteSpeech speechId={speech.id} />
          <Button type="button" variant="outline" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>

      {tab === "tts" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void ttsForm.handleSubmit(onSaveTts)();
          }}
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            These settings apply to all blocks. After changing them, regenerate
            audio per block on the Text tab.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-ttsLanguage">Language</Label>
            <select
              id="edit-ttsLanguage"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              aria-invalid={!!ttsForm.formState.errors.ttsLanguage}
              {...ttsForm.register("ttsLanguage")}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name} ({language.code})
                </option>
              ))}
            </select>
            <FieldError message={ttsForm.formState.errors.ttsLanguage?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-ttsVoice">Voice</Label>
            <select
              id="edit-ttsVoice"
              disabled={voicesLoading || voices.length === 0}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
              aria-invalid={!!ttsForm.formState.errors.ttsVoice}
              {...ttsForm.register("ttsVoice")}
            >
              {voicesLoading && <option value="">Loading voices...</option>}
              {!voicesLoading && voices.length === 0 && (
                <option value="">No voices available</option>
              )}
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.ssmlGender.toLowerCase()})
                </option>
              ))}
            </select>
            <FieldError message={ttsForm.formState.errors.ttsVoice?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-ttsModel">Model</Label>
            <select
              id="edit-ttsModel"
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              aria-invalid={!!ttsForm.formState.errors.ttsModel}
              {...ttsForm.register("ttsModel")}
            >
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                  {model.name === recommendedModel ? " (recommended)" : ""}
                </option>
              ))}
            </select>
            <FieldError message={ttsForm.formState.errors.ttsModel?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-ttsStyle">Style (optional)</Label>
            <textarea
              id="edit-ttsStyle"
              rows={3}
              placeholder="Speaking style for Gemini voices (e.g. Speak calmly and clearly)"
              className={textareaClassName()}
              {...ttsForm.register("ttsStyle")}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Applied as a Gemini style prompt. Ignored for classic SSML voices
              so line timestamps stay accurate.
            </p>
          </div>

          {ttsError && <FieldError message={ttsError} />}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSavingTts || voicesLoading}>
              {isSavingTts ? "Saving..." : "Save TTS"}
            </Button>
          </div>
        </form>
      )}

      {tab === "text" && (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            <Label htmlFor="edit-title">Speech title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {titleDirty && (
              <div>
                <Button
                  type="button"
                  onClick={onSaveTitle}
                  disabled={isSavingTitle}
                >
                  {isSavingTitle ? "Saving..." : "Save title"}
                </Button>
              </div>
            )}
          </section>

          {speech.blocks.map((block, index) => (
            <EditSpeechBlockCard
              key={block.id}
              speechId={speech.id}
              block={block}
              index={index}
              canRemove={canRemoveBlock}
              onInvalidate={invalidateSpeech}
            />
          ))}

          {showNewBlock ? (
            <NewSpeechBlockCard
              speechId={speech.id}
              index={speech.blocks.length}
              onCancel={() => setShowNewBlock(false)}
              onSaved={async () => {
                setShowNewBlock(false);
                await invalidateSpeech();
              }}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewBlock(true)}
            >
              Add block
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function EditSpeechBlockCard({
  speechId,
  block,
  index,
  canRemove,
  onInvalidate,
}: {
  speechId: string;
  block: SpeechBlockResponse;
  index: number;
  canRemove: boolean;
  onInvalidate: () => Promise<void>;
}) {
  const [title, setTitle] = useState(block.title);
  const [text, setText] = useState(block.text);
  const [isSaving, startSave] = useTransition();
  const [isGenerating, startGenerate] = useTransition();
  const [isRemoving, startRemove] = useTransition();
  const [isDownloading, startDownload] = useTransition();

  useEffect(() => {
    setTitle(block.title);
    setText(block.text);
  }, [block.id, block.title, block.text]);

  const dirty = title !== block.title || text !== block.text;
  const hasAudio = Boolean(block.audioUrl);
  const fileName = block.audioUrl ? getAudioFileName(block.audioUrl) : null;

  function onSaveChanges() {
    const parsed = blockDraftSchema.safeParse({ title, text });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid block");
      return;
    }

    startSave(async () => {
      const result = await updateSpeechBlockAction(speechId, block.id, {
        title: parsed.data.title,
        text: parsed.data.text,
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Block saved");
      await onInvalidate();
    });
  }

  function onGenerate() {
    startGenerate(async () => {
      const result = await generateSpeechBlockAudioAction(speechId, block.id);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(hasAudio ? "Audio regenerated" : "Audio generated");
      await onInvalidate();
    });
  }

  function onDownload() {
    if (!block.audioUrl) return;

    startDownload(async () => {
      const result = await getSpeechBlockAudioDownloadUrlAction(block.id);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      // Open signed URL with Content-Disposition=attachment (no GCS CORS / fetch).
      const anchor = document.createElement("a");
      anchor.href = result.data.url;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    });
  }

  function onRemove() {
    if (!canRemove) {
      toast.error("Speech must have at least one block");
      return;
    }

    startRemove(async () => {
      const result = await deleteSpeechBlockAction(speechId, block.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Block removed");
      await onInvalidate();
    });
  }

  const busy = isSaving || isGenerating || isRemoving || isDownloading;

  return (
    <section className="flex flex-col gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-black dark:text-zinc-50">
          Block {index + 1}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {!hasAudio && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGenerate}
              disabled={busy}
            >
              <Volume2 size={16} />
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={busy || !canRemove}
          >
            <Trash2 size={16} />
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`block-${block.id}-title`}>Title</Label>
        <Input
          id={`block-${block.id}-title`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={busy}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`block-${block.id}-text`}>Text</Label>
        <textarea
          id={`block-${block.id}-text`}
          rows={5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={busy}
          className={textareaClassName()}
        />
      </div>

      {hasAudio && fileName && (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {fileName}
          </p>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGenerate}
              disabled={busy}
            >
              <RefreshCw size={16} />
              {isGenerating ? "Generating..." : "Regenerate"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={busy}
            >
              <Download size={16} />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
        </div>
      )}

      {dirty && (
        <div>
          <Button type="button" onClick={onSaveChanges} disabled={busy}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      )}
    </section>
  );
}

function NewSpeechBlockCard({
  speechId,
  index,
  onCancel,
  onSaved,
}: {
  speechId: string;
  index: number;
  onCancel: () => void;
  onSaved: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSaving, startSave] = useTransition();

  function onSaveNewBlock() {
    const parsed = blockDraftSchema.safeParse({ title, text });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid block");
      return;
    }

    startSave(async () => {
      const result = await addSpeechBlockAction(speechId, {
        title: parsed.data.title,
        text: parsed.data.text,
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Block added");
      await onSaved();
    });
  }

  return (
    <section className="flex flex-col gap-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-black dark:text-zinc-50">
          Block {index + 1} (new)
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new-block-title">Title</Label>
        <Input
          id="new-block-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="new-block-text">Text</Label>
        <textarea
          id="new-block-text"
          rows={5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={isSaving}
          className={textareaClassName()}
        />
      </div>

      <div>
        <Button type="button" onClick={onSaveNewBlock} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save new block"}
        </Button>
      </div>
    </section>
  );
}
