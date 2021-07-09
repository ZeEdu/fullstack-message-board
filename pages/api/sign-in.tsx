import Jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import { User } from "../../interfaces/User.interface";
import { getUserWithPassword } from "../../dao/users";
import { createSession, deleteSession, getSession } from "../../dao/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      methods: ["POST"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
  } catch (error) {
    res.status(404).json({
      meta: {
        type: "error",
      },
      data: {
        message: "Method Not Allowed",
      },
    });
  }

  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      meta: {
        type: "error",
      },
      data: {
        message: `Method ${method} Not Allowed`,
      },
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      meta: {
        type: "error",
      },
      data: {
        message: "Request must have  email and password",
      },
    });
  }

  try {
    const user: User = await getUserWithPassword("email", email);

    if (!user) {
      return res.status(400).json({
        meta: {
          type: "error",
        },
        data: {
          message: "Email not found",
        },
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        meta: {
          type: "error",
        },
        data: {
          message: "Invalid Credentials",
        },
      });
    }

    const checkSession = await getSession("email", email);

    if (!checkSession) {
      const id = user._id.toString();
      const maxAge = 60 * 60 * 24 * 7;
      const token = Jwt.sign({ id }, "myLittleSecret", {
        expiresIn: maxAge,
      });

      const createdSession = await createSession(user.email, token);

      if (!createdSession.success) {
        return res.status(500).json({
          meta: {
            type: "error",
          },
          data: {
            message: "Failed to create user session",
          },
        });
      }

      return res.status(202).json({
        meta: {
          type: "success",
        },
        data: {
          user,
          token,
        },
      });
    }

    try {
      Jwt.verify(checkSession.token, "myLittleSecret");
      res.status(202).json({
        user: user,
        token: checkSession.token,
      });
    } catch (err) {
      // Delete invalid session
      await deleteSession("email", user.email);

      const id = user._id.toString();
      const maxAge = 60 * 60 * 1;
      const token = Jwt.sign({ id }, "myLittleSecret", {
        expiresIn: maxAge,
      });

      const createdSession = await createSession(user.email, token);

      if (!createdSession) {
        return res.status(500).json({
          meta: {
            type: "error",
          },
          data: {
            message: "Faild to create user session",
          },
        });
      }

      return res.status(202).json({
        meta: {
          type: "error",
        },
        data: {
          user,
          token,
        },
      });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      meta: {
        type: "error",
      },
      data: {
        message: "Internal Error",
      },
    });
  }
}
