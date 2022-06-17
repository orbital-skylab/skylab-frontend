import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { IAuth, User } from "@/types/useAuth";
import { useRouter } from "next/router";
import { createContext, useContext, useMemo, useState } from "react";

const defaultUser: User = { email: "" };

const AuthContext = createContext<IAuth>({
  user: defaultUser,
  loading: false,
  signUp: async () => {
    /* Placeholder for callback function */
  },
  signIn: async () => {
    /* Placeholder for callback function */
  },
  logOut: async () => {
    /* Placeholder for callback function */
  },
  resetPassword: async () => {
    /* Placeholder for callback function */
  },
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  /**
   * TODO: ONLY FOR TESTING PURPOSES
   */
  const signUp = async ({
    name,
    email,
    password,
    cohortYear,
    role,
    matricNo,
    nusnetId,
  }: {
    name?: string;
    email: string;
    password: string;
    cohortYear: number;
    role: "students" | "advisers" | "mentors";
    matricNo?: string;
    nusnetId?: string;
  }) => {
    setLoading(true);
    const body: { user: { [key: string]: string | number } } = {
      user: { email, cohortYear },
    };
    if (name) body.user = { ...body.user, name };
    if (matricNo) body.user = { ...body.user, matricNo };
    if (nusnetId) body.user = { ...body.user, nusnetId };
    if (password) body.user = { ...body.user, password };

    /**
     * attempt to create new user in postgres
     */
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: `/${role}`,
      body,
    });
    const apiService = apiServiceBuilder.build();
    const createUserResponse = await apiService();

    /**
     * throw error if postgres user creation failed
     */
    if (!createUserResponse.ok) {
      const errorMessage = await createUserResponse.text();
      throw new Error(errorMessage);
    }

    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: `/${email}`,
      body: { password },
    });
    const apiService = apiServiceBuilder.build();
    const loginResponse = await apiService();

    /**
     * Unsuccessful user login
     */
    if (!loginResponse.ok) {
      const errorMessage = await loginResponse.text();
      setLoading(false);
      throw new Error(errorMessage);
    }

    /**
     * successful user login
     */
    const user = await loginResponse.json();
    setUser(user as User);
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);
    // TODO: make cookie expire
    setUser(defaultUser);
    setLoading(false);
    router.push(PAGES.LANDING);
  };

  const resetPassword = async (email: string) => {
    console.log(email);
    // TODO: sendinblue
  };

  const memoedValue = useMemo(
    () => ({ user, loading, signUp, signIn, logOut, resetPassword }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
