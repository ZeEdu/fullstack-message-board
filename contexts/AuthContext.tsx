import { createContext, useEffect, useState } from "react";
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
  data: any | null;
  success: true | false;
  error: any | null;
}>;

type signUpType = (
  username: string,
  email: string,
  password: string
) => Promise<{
  data: any | null;
  success: true | false;
  error: any | null;
}>;

type logOutType = () => Promise<{
  data: any | null;
  success: true | false;
  error: any | null;
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
    const fetchUser = async () => {
      const { ["messageboard.token"]: token } = parseCookies();
      if (!token) return;
      try {
        const { data } = await api.get("/user");

        setUser(data.data.user as User);
      } catch (error) {
        // console.log("No user found");
      }
    };
    fetchUser();
  }, []);

  async function signIn(email: string, password: string) {
    let data: any | null = null;
    let success: true | false = false;
    let error: any | null = null;

    try {
      const { data: response } = await api.post("/sign-in", {
        email: email,
        password: password,
      });

      setCookie(null, "messageboard.token", response.data.token, {
        maxAge: 60 * 60 * 1,
        path: "/",
      });
      api.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      router.push("/profile");
      data = response.data;
      success = true;
    } catch (err) {
      // console.error(error);
      error = err;
      success = false;
    }
    return { data, success, error };
  }

  async function signUp(username: string, email: string, password: string) {
    let data: any | null = null;
    let success: true | false = false;
    let error: any | null = null;

    try {
      const { data: response } = await api.post("/sign-up", {
        username: username,
        email: email,
        password: password,
      });
      data = response.data;
      success = true;
    } catch (err) {
      error = err;
      success = false;
    }
    return { data, success, error };
  }

  async function logOut() {
    let data: any | null = null;
    let success: true | false = false;
    let error: any | null = null;

    try {
      if (!isAuthenticated) return;
      const { data: response } = await api.post("/logout", {
        email: user.email,
      });
      if (response.meta.type !== "success") return;
      destroyCookie(null, "messageboard.token");
      setUser(null);
      api.defaults.headers["Authorization"] = null;
      router.push("/");
      data = response.data;
      success = true;
    } catch (err) {
      // console.error(error);
      error = err;
      success = false;
    }

    return { data, success, error };
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signUp, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
