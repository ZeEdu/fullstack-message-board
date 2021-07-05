import { NextApiRequest, NextApiResponse } from "next";
import { deleteSession, getSession } from "../../dao/session";
import { getUser } from "../../dao/users";
import { Session } from "../../interfaces/Session.interface";
import { User } from "../../interfaces/User.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      type: "error",
      message: "Request must have a email ",
    });
  }

  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(400).json({
      message: "No authentication informed",
    });
  }

  const token = req.headers.authorization.split("Bearer ")[1];

  try {
    const userByEmail: User = await getUser("email", email);
    if (!userByEmail) {
      return res.status(400).json({
        type: "error",
        message: "Email not found",
      });
    }
    const session: Session = await getSession("email", email);
    if (userByEmail.email !== session.email) {
      return res.status(401).json({
        type: "error",
        message: "Session and email informed do not match",
      });
    }
    await deleteSession(email, token);
    return res
      .status(200)
      .json({ type: "success", message: "deleted user session" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ type: "error", message: "Internal Error" });
  }
}
