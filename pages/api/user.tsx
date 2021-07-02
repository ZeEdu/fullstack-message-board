import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    if (!token) {
      res.status(400).json({
        type: "error",
        message: "No token informed in headers",
      });
    }

    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const sessionColletion = db.collection("sessions");
    const usersColletion = db.collection("users");

    const session = await sessionColletion.findOne({ token });

    if (!session) {
      res.status(404).json({
        type: "error",
        message: "No open session found",
      });
    }

    // Checar a validade do toke
    // Caso seja invalido, envia-se um novo

    const user = await usersColletion.findOne(
      { email: session.user_id },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      res.status(404).json({
        type: "error",
        message: "User not found",
      });
    }

    client.close();

    res.status(200).json({ type: "success", user });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
}
