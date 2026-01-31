export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  displayName: string;
  avatarUrl: string;
}

export interface AppSession {
  user: AppUser;
  expires: string;
}
