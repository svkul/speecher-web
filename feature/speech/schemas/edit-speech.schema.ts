import { z } from "zod";

export const editSpeechTtsSchema = z.object({
  ttsLanguage: z.string().min(1, "Language is required"),
  ttsVoice: z.string().min(1, "Voice is required"),
  ttsModel: z.string().min(1, "Model is required"),
  ttsStyle: z.string().optional(),
});

export type EditSpeechTtsFormValues = z.infer<typeof editSpeechTtsSchema>;
