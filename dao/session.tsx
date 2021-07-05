import { Db } from "mongodb";
import { connectToDatabase } from "../utils/mongodb";

export async function deleteSession(field: "email" | "token", value: string) {
  try {
    const query = { [field]: value };
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection("session").deleteOne(query);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getSession(field: string, value: string) {
  const { db }: { db: Db } = await connectToDatabase();
  const query = { [field]: value };
  return await db.collection("sessions").findOne(query);
}

export async function createSession(email: string, token: string) {
  try {
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection("session").insertOne({ email, token });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
