import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { useRouter } from "next/router";
import { createContext, useContext, useMemo, useState } from "react";
import { IAuth, SimpleUser, User } from "./useAuth.types";

const AuthContext = createContext<IAuth>({
  user: null,
  loading: false,
  signUp: async () => {
    return { email: "", password: "" }; /* Placeholder for callback function */
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
  const [user, setUser] = useState<User | null>(null);
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
     * postgres user creation failed
     */
    if (!createUserResponse.ok) {
      const errorMessage = await createUserResponse.text();
      setLoading(false);
      throw new Error(errorMessage);
    }

    /**
     * successful user creation returns the users' randomly generated password
     */
    const createUserResponseJson = await createUserResponse.json();
    setLoading(false);
    return createUserResponseJson as SimpleUser;
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

    if (!loginResponse.ok) {
      const errorMessage = await loginResponse.text();
      setLoading(false);
      throw new Error(errorMessage);
    }

    /**
     * successful user login returns the users' jwt token
     */
    const { user, token } = await loginResponse.json();
    if (token) {
      localStorage.setItem("jwt_token", token);
      setUser(user as User);
    }
    setLoading(false);
  };

  const logOut = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem("jwt_token");
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
