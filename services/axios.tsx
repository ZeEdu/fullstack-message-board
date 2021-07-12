import axios from "axios";
import { parseCookies } from "nookies";

export function GetApiClient(ctx?) {
  const { ["messageboard.token"]: token } = parseCookies(ctx);
  const apiUrl: string = process.env.NEXT_PUBLIC_API;

  const api = axios.create({
    baseURL: apiUrl,
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}
