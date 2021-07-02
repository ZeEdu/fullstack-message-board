import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      type: "error",
      message: "Request must have username, email and password",
    });
  }

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      type: "error",
      message: "Invalid data format",
    });
  }

  if (username.length < 5) {
    res.status(400).json({
      type: "error",
      message: "Username is less than 5 characters",
    });
  }

  if (username.length > 30) {
    res.status(400).json({
      type: "error",
      message: "Username is more than 30 characters",
    });
  }

  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    )
  ) {
    res.status(400).json({
      type: "error",
      message: "Invalid username format",
    });
  }

  if (password.length < 6) {
    res.status(400).json({
      type: "error",
      message: "Password is less than 6 characters",
    });
  }

  if (password.length > 30) {
    res.status(400).json({
      type: "error",
      message: "Password is more than 30 characters",
    });
  }

  try {
    const client = await MongoClient.connect(
      "mongodb+srv://eduardo:eduardo@cluster0.m0kue.mongodb.net/messageboard?retryWrites=true&w=majority"
    );

    const db = client.db();
    const usersColletion = db.collection("users");

    const emailStm = await usersColletion.findOne({ email: email });

    if (emailStm) {
      res.status(400).json({
        type: "error",
        message: "Email already exist",
      });
    }

    const usernameStm = await usersColletion.findOne({ username: username });

    if (usernameStm) {
      res.status(400).json({
        type: "error",
        message: "Username already exist",
      });
    }

    const user = await usersColletion.insertOne({
      username,
      email,
      password,
    });

    if (!user) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }

    const emailCheckStm = await usersColletion.findOne({ email: email });
    const usernameCheckStm = await usersColletion.findOne({
      username: username,
    });

    if (!emailCheckStm || !usernameCheckStm) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }

    const findUser = await usersColletion.findOne({
      username: username,
      email: email,
      password: password,
    });

    if (!findUser) {
      res
        .status(500)
        .json({ type: "error", message: "Internal Error. Try againg later" });
    }

    client.close();

    res.status(202).json({
      user: findUser,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: error });
    console.error(error);
  }
}
