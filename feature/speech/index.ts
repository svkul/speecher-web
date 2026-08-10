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
export { updateSpeech } from "@/feature/speech/api/update-speech";
export type { UpdateSpeechInput } from "@/feature/speech/api/update-speech";
export { updateSpeechBlock } from "@/feature/speech/api/update-speech-block";
export type { UpdateSpeechBlockInput } from "@/feature/speech/api/update-speech-block";
export { addSpeechBlock } from "@/feature/speech/api/add-speech-block";
export type { AddSpeechBlockInput } from "@/feature/speech/api/add-speech-block";
export { deleteSpeechBlock } from "@/feature/speech/api/delete-speech-block";
export { generateSpeechAudio } from "@/feature/speech/api/generate-speech-audio";
export type { GenerateSpeechAudioResponse } from "@/feature/speech/api/generate-speech-audio";
export { generateSpeechBlockAudio } from "@/feature/speech/api/generate-speech-block-audio";
export type { GenerateSpeechBlockAudioResponse } from "@/feature/speech/api/generate-speech-block-audio";
export { deleteSpeech } from "@/feature/speech/api/delete-speech";
export { deleteSpeechBlockAudio } from "@/feature/speech/api/delete-speech-block-audio";
export { getSpeechBlockAudioDownloadUrl } from "@/feature/speech/api/get-speech-block-audio-download-url";
export type { SpeechBlockAudioDownloadUrlResponse } from "@/feature/speech/api/get-speech-block-audio-download-url";
export { getSpeechAudioPlayUrls } from "@/feature/speech/api/get-speech-audio-play-urls";
export type { SpeechAudioPlayUrlsResponse } from "@/feature/speech/api/get-speech-audio-play-urls";
export { getTtsLanguagesServer } from "@/feature/speech/api/get-tts-languages-server";
export { getTtsModelsServer } from "@/feature/speech/api/get-tts-models-server";

export { getSpeechAction } from "@/feature/speech/actions/get-speech-action";
export { createSpeechAction } from "@/feature/speech/actions/create-speech-action";
export type { CreateSpeechActionResult } from "@/feature/speech/actions/create-speech-action";
export { updateSpeechAction } from "@/feature/speech/actions/update-speech-action";
export type { UpdateSpeechActionResult } from "@/feature/speech/actions/update-speech-action";
export { updateSpeechBlockAction } from "@/feature/speech/actions/update-speech-block-action";
export type { UpdateSpeechBlockActionResult } from "@/feature/speech/actions/update-speech-block-action";
export { addSpeechBlockAction } from "@/feature/speech/actions/add-speech-block-action";
export type { AddSpeechBlockActionResult } from "@/feature/speech/actions/add-speech-block-action";
export { deleteSpeechBlockAction } from "@/feature/speech/actions/delete-speech-block-action";
export type { DeleteSpeechBlockActionResult } from "@/feature/speech/actions/delete-speech-block-action";
export { generateSpeechAudioAction } from "@/feature/speech/actions/generate-speech-audio-action";
export type { GenerateSpeechAudioActionResult } from "@/feature/speech/actions/generate-speech-audio-action";
export { generateSpeechBlockAudioAction } from "@/feature/speech/actions/generate-speech-block-audio-action";
export type { GenerateSpeechBlockAudioActionResult } from "@/feature/speech/actions/generate-speech-block-audio-action";
export { deleteSpeechAction } from "@/feature/speech/actions/delete-speech-action";
export { deleteSpeechBlockAudioAction } from "@/feature/speech/actions/delete-speech-block-audio-action";
export { getSpeechBlockAudioDownloadUrlAction } from "@/feature/speech/actions/get-speech-block-audio-download-url-action";
export type { GetSpeechBlockAudioDownloadUrlActionResult } from "@/feature/speech/actions/get-speech-block-audio-download-url-action";
export { getSpeechAudioPlayUrlsAction } from "@/feature/speech/actions/get-speech-audio-play-urls-action";
export type { GetSpeechAudioPlayUrlsActionResult } from "@/feature/speech/actions/get-speech-audio-play-urls-action";

export { SpeechDetailClient } from "@/feature/speech/ui/SpeechDetailClient";
export { SpeechHeader } from "@/feature/speech/ui/header";
export { CreateSpeechForm } from "@/feature/speech/ui/create/CreateSpeechForm";
export { EditSpeechForm } from "@/feature/speech/ui/edit/EditSpeechForm";
