export { deleteSpeechBlockAudioClient } from "./speech/delete-speech-block";

export type { GenerateSpeechAudioResponse } from "./speech/generate-speech-audio";
export { generateSpeechAudioClient } from "./speech/generate-speech-audio";

export type {
  ClientSpeechBlockResponse,
  ClientSpeechDetailResponse,
} from "./speech/get-speech";
export { getSpeechClient } from "./speech/get-speech";

export type { UserResponse, OAuthSignInResponse } from "./auth/types";
export { signInWithGoogle } from "./auth/sign-in";
export { signOut } from "./auth/sign-out";
