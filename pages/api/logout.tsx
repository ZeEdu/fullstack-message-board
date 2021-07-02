import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      type: "error",
      message: "Request must have a email ",
    });
  }

  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(400).json({
      message: "No authentication informed",
    });
  }

  const token = req.headers.authorization.split("Bearer ")[1];

  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const usersColletion = db.collection("users");

    const user = await usersColletion.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        type: "error",
        message: "Email not found",
      });
    }

    const sessionsColletion = db.collection("sessions");

    await sessionsColletion.deleteOne({ user_id: email, token });
    client.close();

    return res
      .status(200)
      .json({ type: "success", message: "deleted user session" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ type: "error", message: "Internal Error" });
  }
}
