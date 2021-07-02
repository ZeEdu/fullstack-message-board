import Jwt from "jsonwebtoken";

export async function validateToken(token: string) {
  try {
    Jwt.verify(token, "myLittleSecret");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
