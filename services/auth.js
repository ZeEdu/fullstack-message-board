import { api } from "./api";

export async function signInRequest(email, password) {
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

export async function signUpRequest(username, email, password) {
  try {
    const res = await api.post("/sign-up", {
      username: username,
      email: email,
      password: password,
    });
    return { data: res.data, success: true };
  } catch (error) {
    return {
      error,
      success: false,
    };
  }
}

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
