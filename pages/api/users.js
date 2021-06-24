// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  res.status(200).json({
    name: "Eduardo",
    email: "eduardo@gmail.com",
    avatar_url: "https://github.com/ZeEdu.png",
  });
}
