import { createContext, useEffect, useState } from "react";
import {
  logOutRequest,
  recoverUserInformation,
  signInRequest,
  signUpRequest,
} from "../services/auth";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { api } from "../services/api";

type User = {
  _id: string;
  username: string;
  email: string;
};

type signInType = (
  email: string,
  password: string
) => Promise<{
  success: boolean;
  error?: any;
}>;

type signUpType = (
  username: string,
  email: string,
  password: string
) => Promise<{
  data?: any;
  success: boolean;
  error?: any;
}>;

type logOutType = () => Promise<{
  success: boolean;
  error?: any;
}>;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: signInType;
  signUp: signUpType;
  logOut: logOutType;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { ["messageboard.token"]: token } = parseCookies();

    // Mensagem sobre cookies

    if (token) {
      recoverUserInformation().then(({ user, success }) => {
        if (success === true) {
          setUser(user);
        }
      });
    }
  }, []);

  async function signUp(username: string, email: string, password: string) {
    return await signUpRequest(username, email, password);
  }

  async function logOut() {
    try {
      if (!isAuthenticated) return;
      const logOutResponse = await logOutRequest(user.email);
      if (!logOutResponse.success) return;

      destroyCookie(null, "messageboard.token");
      setUser(null);
      api.defaults.headers["Authorization"] = null;
      router.push("/");
      return {
        success: true,
      };
    } catch (error) {
      console.error(error);
      return {
        error,
        success: false,
      };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const signResponse = await signInRequest(email, password);
      if (signResponse.success === true) {
        setCookie(null, "messageboard.token", signResponse.data.token, {
          maxAge: 60 * 60 * 1,
          path: "/",
        });
        api.defaults.headers[
          "Authorization"
        ] = `Bearer ${signResponse.data.token}`;
        setUser(signResponse.data.user);
        router.push("/profile");
        return { success: true, error: signResponse.error };
      }
      return { success: false };
    } catch (error) {
      console.error(error);
      return { error, success: false };
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signUp, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}