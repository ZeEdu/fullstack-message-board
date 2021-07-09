import { Db } from "mongodb";
import { User } from "../interfaces/User.interface";
import Collections from "../utils/Collections";
import { connectToDatabase } from "../utils/mongodb";

export async function saveUser(user: User) {
  try {
    const { db }: { db: Db } = await connectToDatabase();
    await db.collection(Collections.users).insertOne(user);
    return { success: true };
  } catch (error) {
    // console.error(error);
    return { success: false };
  }
}

export async function getUser(
  idField: "_id" | "email" | "username",
  value: any
) {
  const filter = { [idField]: value };
  const { db }: { db: Db } = await connectToDatabase();
  return await db.collection(Collections.users).findOne(filter, {
    projection: { password: 0 },
  });
}

export async function getUserWithPassword(
  idField: "_id" | "email" | "username",
  value: any
) {
  const filter = { [idField]: value };
  const { db }: { db: Db } = await connectToDatabase();
  return await db.collection(Collections.users).findOne(filter);
}
