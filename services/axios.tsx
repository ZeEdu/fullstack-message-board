import axios from "axios";
import { parseCookies } from "nookies";

export function GetApiClient(ctx?) {
  const { ["messageboard.token"]: token } = parseCookies(ctx);
  const production: string = process.env.NEXT_PUBLIC_PRODUCTION;
  const devUrl = "http://localhost:3000/api";
  const prodUrl = "https://fullstack-message-board-nextjs.herokuapp.com";
  const apiUrl = production === "true" ? prodUrl : devUrl;

  const api = axios.create({
    baseURL: apiUrl,
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}
