import { Db } from "mongodb";
import Collections from "../utils/Collections";
import { connectToDatabase } from "../utils/mongodb";

export async function deleteSession(field: "email" | "token", value: string) {
  try {
    const query = { [field]: value };
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection(Collections.sessions).deleteOne(query);
    return { success: true };
  } catch (error) {
    // console.error(error);
    return { success: false };
  }
}

export async function getSession(field: string, value: string) {
  const { db }: { db: Db } = await connectToDatabase();
  const query = { [field]: value };
  return await db.collection(Collections.sessions).findOne(query);
}

export async function createSession(email: string, token: string) {
  try {
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection(Collections.sessions).insertOne({ email, token });
    return { success: true };
  } catch (error) {
    // console.error(error);
    return { success: false };
  }
}
