import axios from "axios";
import { parseCookies } from "nookies";

export function GetApiClient(ctx?) {
  const { ["messageboard.token"]: token } = parseCookies(ctx);
  const prodUrl = "http://fullstack-message-board-nextjs.herokuapp.com/api";
  const localUrl = "http://localhost:3000/api";
  const apiUrl = prodUrl;

  const api = axios.create({
    baseURL: apiUrl,
  });

  // api.interceptors.request.use((config) => {
  //   console.log(config);
  //   return config;
  // });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}
