import { MongoClient } from "mongodb";
import Jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      type: "error",
      message: "Request must have  email and password",
    });
  }

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

    if (password !== user.password) {
      return res.status(400).json({
        type: "error",
        message: "Invalid Credentials",
      });
    }

    const sessionsColletion = db.collection("sessions");

    const checkSession = await sessionsColletion.findOne({ user_id: email });

    if (!checkSession) {
      const id = user._id.toString();
      const maxAge = 60 * 60 * 24 * 7;
      const token = Jwt.sign({ id }, "myLittleSecret", {
        expiresIn: maxAge,
      });

      const createdSession = await sessionsColletion.insertOne({
        user_id: user.email,
        token,
      });

      if (!createdSession) {
        return res.status(500).json({
          type: "error",
          message: "Faild to create user session",
        });
      }

      client.close();

      return res.status(202).json({
        user: user,
        token: token,
      });
    }

    try {
      Jwt.verify(checkSession.token, "myLittleSecret");
      res.status(202).json({
        user: user,
        token: checkSession.token,
      });
    } catch (err) {
      // Delete invalid session
      await sessionsColletion.deleteOne({
        user_id: user.email,
      });

      const id = user._id.toString();
      const maxAge = 60 * 60 * 1;
      const token = Jwt.sign({ id }, "myLittleSecret", {
        expiresIn: maxAge,
      });

      const createdSession = await sessionsColletion.insertOne({
        user_id: user.email,
        token,
      });

      if (!createdSession) {
        return res.status(500).json({
          type: "error",
          message: "Faild to create user session",
        });
      }

      client.close();

      return res.status(202).json({
        user: user,
        token: token,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: "error", message: "Internal Error" });
  }
}