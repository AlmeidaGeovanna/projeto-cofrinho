function lerJSON(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao;
  } catch {
    return padrao;
  }
}

export function getUsuarios() {
  return lerJSON("usuarios", []);
}

export function cadastrarUsuario(usuario) {
  const usuarios = getUsuarios();

  const existe = usuarios.find(
    (u) => u.email.toLowerCase() === usuario.email.toLowerCase()
  );

  if (existe) {
    throw new Error("Este email já está cadastrado.");
  }

  usuarios.push(usuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export function login(email, senha) {
  const usuarios = getUsuarios();

  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // Mensagem genérica para não revelar quais emails estão cadastrados
  if (!usuario || usuario.senha !== senha) {
    throw new Error("Email ou senha incorretos.");
  }

  // A sessão não guarda a senha
  const sessao = { nome: usuario.nome, email: usuario.email };

  localStorage.setItem("usuarioLogado", JSON.stringify(sessao));

  return sessao;
}

export function logout() {
  localStorage.removeItem("usuarioLogado");
}

export function getUsuarioLogado() {
  return lerJSON("usuarioLogado", null);
}

export function estaLogado() {
  return !!getUsuarioLogado();
}
