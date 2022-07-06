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

  const signIn = async (email: string, password: string) => {
    const signInApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/auth/sign-in",
      body: { email, password },
      requiresAuthorization: true,
    }).build();

    const signInResponse = await signInApiService();

    /**
     * Unsuccessful user login
     */
    if (!signInResponse.ok) {
      const error = await signInResponse.json();
      throw new Error(error.message);
    }

    const _user = await signInResponse.json();
    setUser(_user as User);
  };

  const signOut = async () => {
    const signOutApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.GET,
      endpoint: "/auth/sign-out",
      requiresAuthorization: true,
    }).build();
    const signOutResponse = await signOutApiService();

    if (!signOutResponse.ok) {
      const error = await signOutResponse.json();
      throw new Error(error.message);
    }

    setUser(undefined);
    router.push(PAGES.LANDING);
  };

  const resetPassword = async ({
    email,
    origin,
  }: {
    email: string;
    origin: string;
  }) => {
    const resetPasswordApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/auth/reset-password",
      body: { email, origin },
    }).build();
    const signOutResponse = await resetPasswordApiService();

    if (!signOutResponse.ok) {
      const error = await signOutResponse.json();
      throw new Error(error.message ?? error);
    }
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
    const changePasswordApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/auth/change-password",
      body: { newPassword, token, id },
    }).build();
    const changePasswordResponse = await changePasswordApiService();

    if (!changePasswordResponse.ok) {
      const error = await changePasswordResponse.json();
      throw new Error(error.message ?? error);
    }
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
