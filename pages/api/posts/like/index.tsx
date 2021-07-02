import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "../../../../interfaces/Post.interface";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { user_id, post_id } = req.body;

  const { authorization } = req.headers;

  if (!user_id || !post_id || !authorization) {
    return res.status(400).json({
      type: "error",
      message: "Request malformed",
    });
  }
  const token = authorization.split("Bearer ")[1];

  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const postsColletion = db.collection("posts");

    // TODO: Validar a sessão

    const post: Message = await postsColletion.findOne({
      _id: new ObjectId(post_id),
    });

    // Já existe dentro?
    const checkInside = post.likes.includes(user_id);
    if (checkInside) {
      return res.status(400).json({ message: "User already liked post" });
    }
    // Inserir o id do usuário dentro de likes
    const updatedPost = post;
    updatedPost.likes.push(user_id);
    updatedPost.likeCount = post.likeCount + 1;
    updatedPost.updatedAt = new Date().toISOString();

    await postsColletion.updateOne(
      { _id: new ObjectId(post_id) },
      { $set: updatedPost }
    );

    client.close();

    return res.status(200).json({ result: updatedPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ type: "error", message: error });
  }
}
