"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createSpeechAction } from "@/feature/speech/actions/create-speech-action";
import { getTtsVoicesAction } from "@/feature/speech/actions/get-tts-voices-action";
import type { TtsLanguage } from "@/feature/speech/api/get-tts-languages";
import type { TtsModelInfo } from "@/feature/speech/api/get-tts-models";
import type { TtsVoice } from "@/feature/speech/api/get-tts-voices";
import {
  createSpeechSchema,
  type CreateSpeechFormValues,
} from "@/feature/speech/schemas/create-speech.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const STEPS = ["Title", "Blocks", "TTS"] as const;

type Props = {
  languages: TtsLanguage[];
  models: TtsModelInfo[];
  recommendedModel: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function CreateSpeechForm({
  languages,
  models,
  recommendedModel,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [voices, setVoices] = useState<TtsVoice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultLanguage = languages.find((l) => l.code === "en-US")?.code
    ?? languages[0]?.code
    ?? "en-US";

  const form = useForm<CreateSpeechFormValues>({
    resolver: zodResolver(createSpeechSchema),
    defaultValues: {
      title: "",
      blocks: [{ title: "", text: "" }],
      ttsLanguage: defaultLanguage,
      ttsVoice: "",
      ttsModel: recommendedModel || models[0]?.name || "Standard",
      ttsStyle: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blocks",
  });

  const watchedLanguage = watch("ttsLanguage");

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
      const currentVoice = getValues("ttsVoice");
      const stillValid = result.data.voices.some((v) => v.name === currentVoice);
      if (!stillValid) {
        setValue("ttsVoice", result.data.voices[0]?.name ?? "");
      }
      setVoicesLoading(false);
    }

    void loadVoices();

    return () => {
      cancelled = true;
    };
  }, [watchedLanguage, setValue, getValues]);

  async function goNext() {
    if (step === 0) {
      const ok = await trigger("title");
      if (!ok) return;
      setStep(1);
      return;
    }

    if (step === 1) {
      const ok = await trigger("blocks");
      if (!ok) return;
      setStep(2);
    }
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function onSubmit(values: CreateSpeechFormValues) {
    setSubmitError(null);

    startTransition(async () => {
      const result = await createSpeechAction({
        title: values.title,
        blocks: values.blocks.map((block, index) => ({
          title: block.title,
          text: block.text,
          order: index + 1,
        })),
        ttsLanguage: values.ttsLanguage,
        ttsVoice: values.ttsVoice,
        ttsModel: values.ttsModel,
        ...(values.ttsStyle?.trim()
          ? { ttsStyle: values.ttsStyle.trim() }
          : {}),
      });

      if ("error" in result) {
        setSubmitError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Speech created");
      router.push(`/speeches/${result.data.id}`);
    });
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <nav aria-label="Form steps" className="flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-medium",
                index === step
                  ? "bg-black text-white dark:bg-zinc-50 dark:text-black"
                  : index < step
                    ? "bg-zinc-300 text-black dark:bg-zinc-600 dark:text-zinc-50"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400",
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                index === step
                  ? "font-medium text-black dark:text-zinc-50"
                  : "text-zinc-500 dark:text-zinc-400",
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="mx-1 h-px w-6 bg-zinc-200 dark:bg-zinc-800" />
            )}
          </div>
        ))}
      </nav>

      <form
        className="flex flex-col gap-6"
        // Prevent implicit submit (Enter / button type race between steps).
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {step === 0 && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Speech title</Label>
            <Input
              id="title"
              placeholder="My keynote"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            <FieldError message={errors.title?.message} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-3 border-b border-zinc-200 pb-6 last:border-b-0 dark:border-zinc-800"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-black dark:text-zinc-50">
                    Block {index + 1}
                  </h2>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`blocks.${index}.title`}>Title</Label>
                  <Input
                    id={`blocks.${index}.title`}
                    placeholder="Introduction"
                    aria-invalid={!!errors.blocks?.[index]?.title}
                    {...register(`blocks.${index}.title`)}
                  />
                  <FieldError message={errors.blocks?.[index]?.title?.message} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor={`blocks.${index}.text`}>Text</Label>
                  <textarea
                    id={`blocks.${index}.text`}
                    rows={5}
                    placeholder="Write the speech text for this block..."
                    aria-invalid={!!errors.blocks?.[index]?.text}
                    className={cn(
                      "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
                    )}
                    {...register(`blocks.${index}.text`)}
                  />
                  <FieldError message={errors.blocks?.[index]?.text?.message} />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ title: "", text: "" })}
            >
              Add block
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              These settings apply to all blocks. Voice previews will come later.
            </p>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ttsLanguage">Language</Label>
              <select
                id="ttsLanguage"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                aria-invalid={!!errors.ttsLanguage}
                {...register("ttsLanguage")}
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name} ({language.code})
                  </option>
                ))}
              </select>
              <FieldError message={errors.ttsLanguage?.message} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ttsVoice">Voice</Label>
              <select
                id="ttsVoice"
                disabled={voicesLoading || voices.length === 0}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
                aria-invalid={!!errors.ttsVoice}
                {...register("ttsVoice")}
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
              <FieldError message={errors.ttsVoice?.message} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ttsModel">Model</Label>
              <select
                id="ttsModel"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                aria-invalid={!!errors.ttsModel}
                {...register("ttsModel")}
              >
                {models.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                    {model.name === recommendedModel ? " (recommended)" : ""}
                  </option>
                ))}
              </select>
              <FieldError message={errors.ttsModel?.message} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ttsStyle">Style (optional)</Label>
              <textarea
                id="ttsStyle"
                rows={3}
                placeholder="Speaking style for Gemini voices (e.g. Speak calmly and clearly)"
                className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                {...register("ttsStyle")}
              />
              <p className="text-xs text-muted-foreground">
                Applied as a Gemini style prompt. Ignored for classic SSML voices
                so line timestamps stay accurate.
              </p>
            </div>
          </div>
        )}

        {submitError && <FieldError message={submitError} />}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={isPending}
            >
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/speeches")}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => void goNext()}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isPending || voicesLoading}
              onClick={() => void handleSubmit(onSubmit)()}
            >
              {isPending ? "Creating..." : "Create speech"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
