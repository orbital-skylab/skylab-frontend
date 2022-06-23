import { User } from "../../types/users";

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export interface IAuth {
  user: User | undefined;
  isLoading: boolean;
  signUp: ({
    name,
    email,
    matricNo,
    nusnetId,
    cohortYear,
    role,
  }: {
    name?: string;
    email: string;
    matricNo?: string;
    nusnetId?: string;
    cohortYear: number;
    role: "students" | "mentors" | "advisers" | "facilitators";
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
