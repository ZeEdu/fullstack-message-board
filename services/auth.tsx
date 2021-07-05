import { api } from "./api";

export async function logOutRequest(email: string) {
  try {
    const { data } = await api.post("/logout", { email });
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error(error.response.data.message);
    return {
      error: error.response.data.message,
      success: false,
    };
  }
}

export async function signInRequest(email: string, password: string) {
  try {
    const { data } = await api.post("/sign-in", {
      email: email,
      password: password,
    });

    return { data, success: true };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}

export async function signUpRequest(
  username: string,
  email: string,
  password: string
) {}

export async function recoverUserInformation() {
  try {
    const { data } = await api.get("/user");
    if (data.type === "success") {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
