/* eslint-disable @typescript-eslint/no-empty-function */
import { AuthProviderProps, IAuth } from "@/contexts/useAuth/useAuth.types";
import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import { User } from "@/types/users";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext<IAuth>({
  user: undefined,
  isExternalVoter: false,
  isLoading: true,
  isPreviewMode: false,
  signIn: async () => {},
  signOut: async () => {},
  externalVoterSignIn: async () => {},
  externalVoterSignOut: async () => {},
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
  const [isExternalVoter, setIsExternalVoter] = useState(false);
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

  const fetchExternalVoterAuth = async () => {
    setIsLoading(true);
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.GET,
      endpoint: "/auth/external-voter",
      requiresAuthorization: true,
    });
    const apiService = apiServiceBuilder.build();
    const response = await apiService();

    if (!response.ok) {
      setIsExternalVoter(false);
      setIsLoading(false);
      return;
    }

    const { isExternalVoter } = await response.json();
    setIsExternalVoter(isExternalVoter);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      fetchUserInfo();

      if (!isExternalVoter) {
        fetchExternalVoterAuth();
      }
    }
  }, [user, isExternalVoter]);

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

  const externalVoterSignIn = async (voterId: string) => {
    const externalVoterSignInApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/auth/sign-in/external-voter",
      body: { voterId },
      requiresAuthorization: true,
    }).build();

    const externalVoterSignInResponse = await externalVoterSignInApiService();

    if (!externalVoterSignInResponse.ok) {
      const error = await externalVoterSignInResponse.json();
      throw new Error(error.message);
    }

    setIsExternalVoter(true);
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

  const externalVoterSignOut = async () => {
    const externalVoterSignOutApiService = new ApiServiceBuilder({
      method: HTTP_METHOD.GET,
      endpoint: "/auth/sign-out/external-voter",
      requiresAuthorization: true,
    }).build();
    const externalVoterSignOutResponse = await externalVoterSignOutApiService();

    if (!externalVoterSignOutResponse.ok) {
      const error = await externalVoterSignOutResponse.json();
      throw new Error(error.message);
    }

    setIsExternalVoter(false);
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
      isExternalVoter,
      signIn,
      signOut,
      externalVoterSignIn,
      externalVoterSignOut,
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
