import newPost from "../../api/controllers/newPost.controller";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      break;
    case "POST":
      await newPost(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
