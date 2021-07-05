// Create a new Post
// Get Posts
// Get Posts All
// Methods: POST, GET

import { NextApiRequest, NextApiResponse } from "next";
import {
  getAllMessages,
  getUserMessages,
  saveMessage,
} from "../../../dao/messages";
import { getSession } from "../../../dao/session";
import { getUser } from "../../../dao/users";
import { Message } from "../../../interfaces/Message.interface";
import { User } from "../../../interfaces/User.interface";
import { validateToken } from "../../../utils/Token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await getPost();
      break;
    case "POST":
      await postMessage();
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function postMessage() {
    const {
      body: { email, message },
    } = req;
    if (!message || !email) {
      return res.status(400).json({
        message: "Request must have a message and a user identifier.",
      });
    }
    const token = req.headers.authorization.split("Bearer ")[1];
    const tokenValResponse = await validateToken(token);
    if (tokenValResponse.success === false) {
      return res.status(403).json({
        message: "Invalid token.",
      });
    }
    const findSessionResponse = await getSession("token", token);
    if (findSessionResponse.success === false) {
      return res.status(403).json({
        message: "User session not found.",
      });
    }
    const user: User = await getUser("email", findSessionResponse.user);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (user.email !== email) {
      return res.status(400).json({
        message: "User ids doesn't match.",
      });
    }
    const post = {
      email: user.email,
      username: user.username,
      user_id: user._id.toString(),
      message,
      likeCount: 0,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    const savedPost = await saveMessage(post);
    if (!savedPost) {
      return res.status(404).json({
        message: "Couldn't save the post. Try again later.",
      });
    }
    res.status(200).json({ success: true });
  }

  async function getPost() {
    const {
      query: { id, page },
    } = req;
    try {
      if (!id) {
        const messages: Message[] = await getAllMessages(Number(page));
        return res.status(200).json({ result: messages });
      }
      const user_id = typeof id === "string" ? id : id[0];
      const messages: Message[] = await getUserMessages(
        "user_id",
        user_id,
        Number(page)
      );
      return res.status(200).json({ result: messages });
    } catch (error) {
      return res.status(404).json({ message: "Internal Error" });
    }
  }
}
