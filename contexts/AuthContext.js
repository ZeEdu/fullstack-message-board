import { createContext, useEffect, useState } from "react";
import {
  recoverUserInformation,
  signInRequest,
  signUpRequest,
} from "../services/auth";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { api } from "../services/api";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const cookies = parseCookies();
    console.log(cookies);

    const { "messageboard.token": token } = parseCookies();
    // console.log("useEffect", token);

    if (token) {
      recoverUserInformation().then(({ user, success }) => {
        if (success === true) {
          setUser(user);
        }
      });
    }
  }, []);

  async function signUp(username, email, password) {
    return await signUpRequest(username, email, password);
  }

  async function signIn(email, password) {
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
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
