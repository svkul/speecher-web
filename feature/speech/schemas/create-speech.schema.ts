import { z } from "zod";

export const createSpeechBlockSchema = z.object({
  title: z.string().min(1, "Block title is required"),
  text: z.string().min(1, "Block text is required"),
});

export const createSpeechSchema = z.object({
  title: z.string().min(1, "Speech title is required"),
  blocks: z
    .array(createSpeechBlockSchema)
    .min(1, "Add at least one block"),
  ttsLanguage: z.string().min(1, "Language is required"),
  ttsVoice: z.string().min(1, "Voice is required"),
  ttsModel: z.string().min(1, "Model is required"),
  ttsStyle: z.string().optional(),
});

export type CreateSpeechFormValues = z.infer<typeof createSpeechSchema>;
