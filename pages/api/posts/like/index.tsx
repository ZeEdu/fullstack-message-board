import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

import { getMessage, updateMessage } from "../../../../dao/messages";
import { Message } from "../../../../interfaces/Message.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await NextCors(req, res, {
      // Options
      methods: ["PUT"],
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

  if (method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({
      meta: {
        type: "error",
      },
      data: {
        message: `Method ${method} Not Allowed`,
      },
    });
  }

  const { user_id, post_id } = req.body;

  const { authorization } = req.headers;

  if (!user_id || !post_id || !authorization) {
    return res.status(400).json({
      meta: {
        type: "error",
      },
      data: {
        message: "Request malformed",
      },
    });
  }
  const token = authorization.split("Bearer ")[1];

  try {
    // TODO: Validar a sessão

    // const post: Message = await postsColletion.findOne({
    //   _id: new ObjectId(post_id),
    // });
    const message: Message = await getMessage("_id", new ObjectId(post_id));
    const checkInside = message.likes.includes(user_id);
    if (checkInside) {
      return res.status(400).json({
        meta: { type: "error" },
        data: {
          message: "User already liked post",
        },
      });
    }
    const updatedMessage = message;
    updatedMessage.likes.push(user_id);
    updatedMessage.likeCount = message.likeCount + 1;
    updatedMessage.updatedAt = new Date().toISOString();
    const updateResult = await updateMessage(
      "_id",
      new ObjectId(post_id),
      updatedMessage
    );
    if (!updateResult.success) {
      return res.status(500).json({
        meta: { type: "error" },
        data: {
          message: "Internal Error",
        },
      });
    }
    return res
      .status(200)
      .json({ meta: { type: "error" }, data: updatedMessage });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ type: "error", message: error });
  }
}
