import { MongoClient } from "mongodb";

export async function findSession(field: string, value: string) {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const sessionColletion = db.collection("sessions");

    const query = { [field]: value };
    const stmResponse = await sessionColletion.findOne(query);

    client.close();

    if (!stmResponse) {
      return { success: false };
    }

    return { success: true, user: stmResponse.user_id };
  } catch (err) {
    console.error(err);
    return { success: false };
    // Do something
  }
}
