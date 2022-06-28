/* eslint-disable @typescript-eslint/no-empty-function */
import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { AuthProviderProps, IAuth } from "@/hooks/useAuth/useAuth.types";
import { User } from "@/types/users";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext<IAuth>({
  user: undefined,
  isLoading: true,
  isPreviewMode: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  changePassword: async () => {},
  previewSiteAs: () => {},
  stopPreview: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [isPreviewMode, setPreviewMode] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [backupUser, setBackupUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserInfo = async () => {
    setIsLoading(true);
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

  useEffect(() => {
    if (!user) {
      fetchUserInfo();
    }
  }, [user]);

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
    password?: string;
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
      body.user.name = name;
    }
    if (user && password) {
      body.user.password = password;
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
      endpoint: `/users/create-${role.slice(0, role.length - 1)}`, // remove the last "s" in the role name
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

  const resetPassword = async ({ email }: { email: string }) => {
    console.log(email);
    // TODO: sendinblue
  };

  const changePassword = async ({
    newPassword,
    token,
    id,
  }: {
    newPassword: string;
    token: string;
    id: number;
  }) => {
    console.log(newPassword, token, id);
    // TODO: change password
  };

  const previewSiteAs = (userToPreviewAs: User) => {
    setBackupUser(user);
    setUser(userToPreviewAs);
    setPreviewMode(true);
  };

  const stopPreview = () => {
    setPreviewMode(false);
    setUser(backupUser);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      isLoading,
      isPreviewMode,
      signUp,
      signIn,
      signOut,
      resetPassword,
      changePassword,
      previewSiteAs,
      stopPreview,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isPreviewMode, isLoading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
