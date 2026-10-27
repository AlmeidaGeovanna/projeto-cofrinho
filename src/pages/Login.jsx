import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CampoSenha from "../componentes/CampoSenha";
import { login, estaLogado } from "../utils/Autenticacao";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  if (estaLogado()) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !senha) {
      toast.error("Preencha email e senha.");
      return;
    }

    try {
      const usuario = login(email.trim().toLowerCase(), senha);
      toast.success(`Bem-vindo(a), ${usuario.nome.split(" ")[0]}!`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-icone" aria-hidden="true">🐷</span>
          <h1>Cofrinho</h1>
          <p>Controle financeiro pessoal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-senha">Senha</label>
            <CampoSenha
              id="login-senha"
              autoComplete="current-password"
              value={senha}
              onChange={setSenha}
            />
          </div>

          <button type="submit" className="btn btn-primario">
            Entrar
          </button>
        </form>

        <p className="auth-link">
          Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
