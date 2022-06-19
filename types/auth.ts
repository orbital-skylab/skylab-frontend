import { User } from "./users";

export interface IAuth {
  user: User;
  loading: boolean;
  currentCohortYear: number;
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
