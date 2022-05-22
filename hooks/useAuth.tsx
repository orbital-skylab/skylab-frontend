import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../firebase";
const usersApi = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users`;

interface IAuth {
  user: User | null;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<IAuth>({
  user: null,
  error: null,
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
  const [error, setError] = useState<string>("");

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  );

  const signUp = async (email: string, password: string) => {
    /**
     * attempt to create new user in postgres
     */
    const createUserResponse = await fetch(usersApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email,
        },
      }),
    });

    /**
     * terminate sign up if postgres user creation fails and display error message
     */
    if (!createUserResponse.ok) {
      const errorMessage = await createUserResponse.text();
      setError(errorMessage);
      return;
    }

    /**
     * attempt to create new user in firebase
     */
    await createUserWithEmailAndPassword(auth, email, password).catch(
      async (err) => {
        /**
         * delete user in postgres if firebase user creation fails
         */
        const deleteUserResponse = await fetch(`${usersApi}/${email}`, {
          method: "DELETE",
        });

        /**
         * terminate sign up after deleting user in postgres and display error message
         */
        if (!deleteUserResponse.ok) {
          const errorMessage = await deleteUserResponse.text();
          setError(errorMessage);
        } else {
          console.log(err);
          setError("Something went wrong while signing up");
        }
      }
    );
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const memoedValue = useMemo(
    () => ({ user, error, signUp, signIn, logOut, resetPassword }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, error]
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
