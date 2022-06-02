import { ApiServiceBuilder } from "@/helpers/api";
import { PAGES } from "@/helpers/navigation";
import { HTTP_METHOD } from "@/types/api";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { useRouter } from "next/router";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../../firebase";

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<IAuth>({
  user: null,
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  );

  const signUp = async (email: string, password: string): Promise<void> => {
    /**
     * attempt to create new user in postgres
     */
    const apiServiceBuilder = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/students",
      body: { user: { email } },
    });
    const apiService = apiServiceBuilder.build();
    const createUserResponse = await apiService();

    /**
     * terminate sign up if postgres user creation fails and display error message
     */
    if (!createUserResponse.ok) {
      const errorMessage = await createUserResponse.text();
      throw new Error(errorMessage);
    }

    /**
     * attempt to create new user in firebase
     */
    await createUserWithEmailAndPassword(auth, email, password).catch(
      async (err) => {
        /**
         * delete user in postgres if firebase user creation fails
         */
        const apiServiceBuilder = new ApiServiceBuilder({
          method: HTTP_METHOD.DELETE,
          endpoint: `/${email}`,
        });
        const apiService = apiServiceBuilder.build();
        const deleteUserResponse = await apiService();

        /**
         * terminate sign up after deleting user in postgres and display error message
         */
        if (!deleteUserResponse.ok) {
          const errorMessage = await deleteUserResponse.text();
          throw new Error(errorMessage);
        } else {
          throw new Error(
            err instanceof Error
              ? err.message
              : "Something went wrong while signing up"
          );
        }

        throw err;
      }
    );
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
    router.push(PAGES.LANDING);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const memoedValue = useMemo(
    () => ({ user, signUp, signIn, logOut, resetPassword }),
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
