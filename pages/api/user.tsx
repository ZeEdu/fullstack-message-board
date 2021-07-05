import { User } from "../../interfaces/User.interface";
import { Session } from "../../interfaces/Session.interface";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../dao/session";
import { getUser } from "../../dao/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      res.status(400).json({
        type: "error",
        message: "No token informed in headers",
      });
    }
    const session: Session = await getSession("token", token);
    if (!session) {
      res.status(404).json({
        type: "error",
        message: "No open session found",
      });
    }
    // Checar a validade do token
    // Caso seja invalido, envia-se um novo
    const user: User = await getUser("email", session.email);
    if (!user) {
      res.status(404).json({
        type: "error",
        message: "User not found",
      });
    }
    res.status(200).json({ type: "success", user });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
}
