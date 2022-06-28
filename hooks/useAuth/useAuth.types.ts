import { User } from "../../types/users";

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export interface IAuth {
  user: User | undefined;
  isLoading: boolean;
  isPreviewMode: boolean;
  signUp: ({
    name,
    email,
    password,
    matricNo,
    nusnetId,
    cohortYear,
    role,
  }: {
    name?: string;
    email: string;
    password?: string;
    matricNo?: string;
    nusnetId?: string;
    cohortYear: number;
    role: "students" | "mentors" | "advisers" | "facilitators";
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  previewSiteAs: (user: User) => void;
  stopPreview: () => void;
}
