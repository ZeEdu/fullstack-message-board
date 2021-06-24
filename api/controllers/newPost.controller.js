async function newPost(req, res) {
  const {
    body: { message, user },
    headers: { authorization },
  } = req;

  const token = authorization.split("Bearer ")[1];

  console.log("token", token);

  // TODO: Validar token
  // TODO: Validar mensagem
  // TODO: Validar usuário
  // TODO: Salvar mensagem;

  if (!message || !user) {
    res.status(400).json({
      type: "error",
      message: "Request must have message and a user",
    });
  }

  res.status(200).json({ message: "Connected" });
}

export default newPost;
