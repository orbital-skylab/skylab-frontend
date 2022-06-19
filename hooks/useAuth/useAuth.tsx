import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { IAuth } from "@/types/auth";
import { User } from "@/types/users";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultCohortYear = 2022;
const defaultUser: User = {
  id: 0,
  name: "",
  email: "",
  cohortYear: defaultCohortYear,
};

const AuthContext = createContext<IAuth>({
  user: defaultUser,
  loading: false,
  currentCohortYear: defaultCohortYear,
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
  const [currentCohortYear, setCurrentCohortYear] =
    useState<number>(defaultCohortYear);
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async (id: number) => {
      const apiServiceBuilder = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: `/auth/${id}/info`,
      });
      const apiService = apiServiceBuilder.build();
      const userInfoResponse = await apiService();

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        setUser(userInfo as User);
      }
    };

    if (user) {
      getUserInfo(user.id);
    }
  }, [user]);

  useEffect(() => {
    const getCurrentCohortYear = async () => {
      const apiServiceBuilder = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: "/cohorts/latest",
      });
      const apiService = apiServiceBuilder.build();
      const latestCohortYearResponse = await apiService();

      if (latestCohortYearResponse.ok) {
        const { latestCohortYear } = await latestCohortYearResponse.json();
        setCurrentCohortYear(Number(latestCohortYear));
      }
    };

    getCurrentCohortYear();
  }, []);

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
    setLoading(true);
    const body: {
      user: { [key: string]: string | number };
      student?: { nusnetId: string; matricNo: string; cohortYear: number };
      mentor?: { cohortYear: number };
      adviser?: { cohortYear: number };
      facilitator?: { cohortYear: number };
    } = {
      user: { email },
    };

    if (name) {
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

    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.GET,
      endpoint: `/auth/${user.id}/sign-out`,
    });
    const apiService = apiServiceBuilder.build();
    const logoutResponse = await apiService();

    if (!logoutResponse.ok) {
      const errorMessage = await logoutResponse.text();
      setLoading(false);
      throw new Error(errorMessage);
    }

    setUser(defaultUser);
    setLoading(false);
    router.push(PAGES.LANDING);
  };

  const resetPassword = async (email: string) => {
    console.log(email);
    // TODO: sendinblue
  };

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      currentCohortYear,
      signUp,
      signIn,
      logOut,
      resetPassword,
    }),
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
