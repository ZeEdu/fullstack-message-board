import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import { User } from "../../interfaces/User.interface";
import { Session } from "../../interfaces/Session.interface";
import { getSession } from "../../dao/session";
import { getUser } from "../../dao/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["GET"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
  } catch (error) {
    res.status(404).json({
      meta: { type: "error" },
      message: "Method Not Allowed",
    });
  }

  try {
    const token = req.headers.authorization.split("Bearer ")[1];

    if (!token) {
      res.status(400).json({
        meta: {
          type: "error",
        },
        message: "No token informed in headers",
      });
    }
    console.log(token);

    const session: Session = await getSession("token", token);
    if (!session) {
      res.status(402).json({
        meta: {
          type: "error",
        },
        data: { message: "No open session found" },
      });
    }
    // Checar a validade do token
    // Caso seja invalido, envia-se um novo
    const user: User = await getUser("email", session.email);
    if (!user) {
      res.status(404).json({
        meta: {
          type: "error",
        },
        data: {
          message: "User not found",
        },
      });
    }
    res.status(200).json({
      meta: {
        type: "success",
      },
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      meta: {
        type: "error",
      },
      message: "Something went wrong",
    });
  }
}
