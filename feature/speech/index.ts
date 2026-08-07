export type {
  SpeechBlockResponse,
  SpeechDetailResponse,
  SpeechBlockResponse as ServerSpeechBlockResponse,
  SpeechDetailResponse as ServerSpeechDetailResponse,
} from "@/feature/speech/api/get-speech";
export type { SpeechListItemResponse as ServerSpeechResponse } from "@/feature/speech/api/get-speeches";

export { getSpeech } from "@/feature/speech/api/get-speech";
export { getSpeeches } from "@/feature/speech/api/get-speeches";
export { getSpeechServer } from "@/feature/speech/api/get-speech-server";
export { getSpeechesServer } from "@/feature/speech/api/get-speeches-server";
export { createSpeech } from "@/feature/speech/api/create-speech";
export type {
  CreateSpeechInput,
  CreateSpeechBlockInput,
} from "@/feature/speech/api/create-speech";
export { generateSpeechAudio } from "@/feature/speech/api/generate-speech-audio";
export type { GenerateSpeechAudioResponse } from "@/feature/speech/api/generate-speech-audio";
export { deleteSpeech } from "@/feature/speech/api/delete-speech";
export { deleteSpeechBlockAudio } from "@/feature/speech/api/delete-speech-block-audio";
export { getTtsLanguagesServer } from "@/feature/speech/api/get-tts-languages-server";
export { getTtsModelsServer } from "@/feature/speech/api/get-tts-models-server";

export { getSpeechAction } from "@/feature/speech/actions/get-speech-action";
export { createSpeechAction } from "@/feature/speech/actions/create-speech-action";
export type { CreateSpeechActionResult } from "@/feature/speech/actions/create-speech-action";
export { generateSpeechAudioAction } from "@/feature/speech/actions/generate-speech-audio-action";
export type { GenerateSpeechAudioActionResult } from "@/feature/speech/actions/generate-speech-audio-action";
export { deleteSpeechAction } from "@/feature/speech/actions/delete-speech-action";
export { deleteSpeechBlockAudioAction } from "@/feature/speech/actions/delete-speech-block-audio-action";

export { SpeechDetailClient } from "@/feature/speech/ui/SpeechDetailClient";
export { GenerateAudio } from "@/feature/speech/ui/GenerateAudio";
export { SpeechHeader } from "@/feature/speech/ui/header";
export { CreateSpeechForm } from "@/feature/speech/ui/create/CreateSpeechForm";
