import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { AuthProviderProps, IAuth } from "@/types/useAuth";
import { User } from "@/types/users";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import useFetch, { isFetching } from "../useFetch";

const AuthContext = createContext<IAuth>({
  user: undefined,
  isLoading: true,
  signUp: async () => {
    /* Placeholder for callback function */
  },
  signIn: async () => {
    /* Placeholder for callback function */
  },
  signOut: async () => {
    /* Placeholder for callback function */
  },
  resetPassword: async () => {
    /* Placeholder for callback function */
  },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  // const { data: user, status } = useFetch<User>({
  //   endpoint: "/auth/info",
  //   requiresAuthorization: true,
  // });

  // const isLoading = isFetching(status);

  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const apiServiceBuilder = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: "/auth/info",
        requiresAuthorization: true,
      });
      const apiService = apiServiceBuilder.build();
      const response = await apiService();

      if (response.ok) {
        const _user = await response.json();
        setUser(_user as User);
      }

      setIsLoading(false);
    };

    user ? setIsLoading(false) : fetchUserInfo();
  }, [user]);

  /**
   * TODO: ONLY FOR TESTING PURPOSES
   */
  const signUp = async ({
    name,
    email,
    cohortYear,
    role,
    matricNo,
    nusnetId,
  }: {
    name?: string;
    email: string;
    password: string;
    cohortYear: number;
    role: "students" | "advisers" | "mentors" | "facilitators";
    matricNo?: string;
    nusnetId?: string;
  }) => {
    const body: {
      user: { [key: string]: string | number };
      student?: { nusnetId: string; matricNo: string; cohortYear: number };
      mentor?: { cohortYear: number };
      adviser?: { cohortYear: number };
      facilitator?: { cohortYear: number };
    } = {
      user: { email },
    };

    if (user && name) {
      user.name = name;
    }

    switch (role) {
      case "students":
        body.student = {
          nusnetId: nusnetId ?? "",
          matricNo: matricNo ?? "",
          cohortYear,
        };
        break;
      case "mentors":
        body.mentor = {
          cohortYear,
        };
        break;
      case "advisers":
        body.adviser = {
          cohortYear,
        };
        break;
      case "facilitators":
        body.facilitator = {
          cohortYear,
        };
        break;
      default:
        break;
    }

    /**
     * attempt to create new user in postgres
     */
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: `/users/create-${role.slice(0, role.length - 2)}`, // remove the last "s" in the role name
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
  };

  const signIn = async (email: string, password: string) => {
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/auth/sign-in",
      body: { email, password },
      requiresAuthorization: true,
    });
    const apiService = apiServiceBuilder.build();
    const loginResponse = await apiService();

    /**
     * Unsuccessful user login
     */
    if (!loginResponse.ok) {
      const errorMessage = await loginResponse.text();
      throw new Error(errorMessage);
    }

    const _user = await loginResponse.json();
    setUser(_user as User);
  };

  const signOut = async () => {
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.GET,
      endpoint: "/auth/sign-out",
      requiresAuthorization: true,
    });
    const apiService = apiServiceBuilder.build();
    const signOutResponse = await apiService();

    if (!signOutResponse.ok) {
      const errorMessage = await signOutResponse.text();
      throw new Error(errorMessage);
    }

    setUser(undefined);
    router.push(PAGES.LANDING);
  };

  const resetPassword = async (email: string) => {
    console.log(email);
    // TODO: sendinblue
  };

  const memoedValue = useMemo(
    () => ({
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      resetPassword,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
