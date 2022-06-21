import { User } from "./users";

export interface AuthProviderProps {
  children?: React.ReactNode;
}

export interface IAuth {
  user: User | null;
  isLoading: boolean;
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
    password: string;
    matricNo?: string;
    nusnetId?: string;
    cohortYear: number;
    role: "students" | "mentors" | "advisers" | "facilitators";
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
