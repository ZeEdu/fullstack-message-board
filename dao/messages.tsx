import { Db } from "mongodb";
import { Message } from "../interfaces/Message.interface";
import { connectToDatabase } from "../utils/mongodb";

export async function getAllMessages(page = 0): Promise<Message[]> {
  const { db }: { db: Db } = await connectToDatabase();
  return await db
    .collection("posts")
    .find()
    .limit(10)
    .skip(page * 10)
    .toArray();
}

export async function saveMessage(message: Message) {
  try {
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection("posts").insertOne(message);
    return { success: true };
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
  const { db }: { db: Db } = await connectToDatabase();
  const filter = { [idField]: value };
  return await db
    .collection("posts")
    .find(filter, { skip: page * 10, limit: 10 })
    .toArray();
}

export async function getMessage(field: string, value: any) {
  const query = { [field]: value };
  const { db }: { db: Db } = await connectToDatabase();
  return await db.collection("posts").findOne(query);
}

export async function updateMessage(field: string, value: any, body: any) {
  const query = { [field]: value };
  try {
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection("posts").updateOne(query, { $set: body });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
