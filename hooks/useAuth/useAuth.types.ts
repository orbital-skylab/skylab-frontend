import { User } from "../../types/users";

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export interface IAuth {
  user: User | undefined;
  isLoading: boolean;
  isPreviewMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: ({ email }: { email: string }) => Promise<void>;
  changePassword: ({
    newPassword,
    token,
    id,
  }: {
    newPassword: string;
    token: string;
    id: number;
  }) => Promise<void>;
  previewSiteAs: (user: User) => void;
  stopPreview: () => void;
}
