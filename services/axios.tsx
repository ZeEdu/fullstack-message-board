import axios from "axios";
import { parseCookies } from "nookies";
import parseStringToBoolean from "../utils/parseStringToBoolean";

export function GetApiClient(ctx?) {
  const { ["messageboard.token"]: token } = parseCookies(ctx);
  const productionEnv = process.env.PRODUCTION;
  const prodUrl = "http://fullstack-message-board-nextjs.herokuapp.com/api";
  const localUrl = "http://localhost:3000/api";
  let apiUrl: string;

  try {
    console.log("production?", parseStringToBoolean(productionEnv));
    apiUrl = parseStringToBoolean(productionEnv) ? prodUrl : localUrl;
  } catch (error) {
    apiUrl = localUrl;
  }

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
