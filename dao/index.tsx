import { MongoClient } from "mongodb";
import { FindUser } from "../interfaces/FindUser.interface";
import { Message } from "../interfaces/Post.interface";

type postPreSave = {
  email: string;
  username: string;
  user_id: string;
  message: string;
  likeCount: number;
  likes: string[];
};

export async function getAllMessages(page = 0): Promise<Message[]> {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const postsColletion = db.collection("posts");

    const posts = (await postsColletion
      .find()
      .limit(10)
      .skip(page * 10)
      // .sort({ _id: -1 })
      .toArray()) as Message[];

    client.close();

    return posts;
  } catch (err) {
    console.error(err);
    return [] as Message[];
  }
}

export async function savePost(post: postPreSave) {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );
    const db = client.db();
    const colletion = db.collection("posts");
    const savedPost = await colletion.insertOne(post);
    client.close();
    if (!savedPost) {
      return { success: false };
    }
    return { success: true, result: savedPost.ops };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

export async function getUserMessages(
  idField: "user_id" | "email",
  value: any,
  page = 0
) {
  const filter = { [idField]: value };
  const client = await MongoClient.connect(
    "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  const db = client.db();
  const colletion = db.collection("posts");
  const posts = await colletion
    .find(filter, { skip: page * 10, limit: 10 })
    .toArray();
  client.close();
  return posts as Message[];
}

export async function getUserData(idField: "_id" | "email", value: any) {
  const filter = { [idField]: value };
  const client = await MongoClient.connect(
    "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
  );
  const db = client.db();
  const colletion = db.collection("users");
  const user = await colletion.findOne(filter, {
    projection: { password: 0 },
  });
  client.close();

  if (!user) return null;
  return user as FindUser;
}
