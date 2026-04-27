export interface UserResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  language: string | null;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthSignInResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}
