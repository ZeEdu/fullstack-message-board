import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import { getUser, saveUser } from "../../dao/users";
import { User } from "../../interfaces/User.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["POST"],
      origin: "*",
      optionsSuccessStatus: 200,
    });
  } catch (error) {
    res.status(404).json({
      type: "error",
      message: "Method Not Allowed",
    });
  }

  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      meta: {
        type: "error",
      },
      data: {
        message: `Method ${method} Not Allowed`,
      },
    });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      type: "error",
      message: "Request must have username, email and password",
    });
  }

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      type: "error",
      message: "Invalid data format",
    });
  }

  if (username.length < 5) {
    res.status(400).json({
      type: "error",
      message: "Username is less than 5 characters",
    });
  }

  if (username.length > 30) {
    res.status(400).json({
      type: "error",
      message: "Username is more than 30 characters",
    });
  }

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    )
  ) {
    res.status(400).json({
      type: "error",
      message: "Invalid username format",
    });
  }

  if (password.length < 6) {
    res.status(400).json({
      type: "error",
      message: "Password is less than 6 characters",
    });
  }

  if (password.length > 30) {
    res.status(400).json({
      type: "error",
      message: "Password is more than 30 characters",
    });
  }

  try {
    const emailStm = await getUser("email", email);
    if (emailStm) {
      res.status(400).json({
        type: "error",
        message: "Email already exist",
      });
    }
    const usernameStm = await getUser("username", username);
    if (usernameStm) {
      res.status(400).json({
        type: "error",
        message: "Username already exist",
      });
    }
    const insertedUser = await saveUser({
      username,
      email,
      password,
    });
    if (!insertedUser.success) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }
    const emailCheckStm: User = await getUser("email", email);
    const usernameCheckStm: User = await getUser("username", username);
    if (emailCheckStm._id.toString() === usernameCheckStm._id.toString()) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }
    const findUser: User = await getUser(
      "_id",
      new ObjectId(emailCheckStm._id)
    );
    if (!findUser) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }
    res.status(202).json({
      user: findUser,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: error });
    // console.error(error);
  }
}
