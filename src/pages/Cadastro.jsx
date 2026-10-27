import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CampoSenha from "../componentes/CampoSenha";
import { cadastrarUsuario, estaLogado } from "../utils/Autenticacao";

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  if (estaLogado()) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !senha || !confirmacao) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (!emailValido(email.trim())) {
      toast.error("Informe um email válido.");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres.");
      return;
    }

    if (senha !== confirmacao) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      cadastrarUsuario({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
      });

      toast.success("Conta criada! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-icone" aria-hidden="true">🐷</span>
          <h1>Criar conta</h1>
          <p>Comece a controlar suas finanças</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="cad-nome">Nome</label>
            <input
              id="cad-nome"
              type="text"
              className="input"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cad-email">Email</label>
            <input
              id="cad-email"
              type="email"
              className="input"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cad-senha">Senha</label>
            <CampoSenha
              id="cad-senha"
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
              value={senha}
              onChange={setSenha}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cad-confirmacao">Confirmar senha</label>
            <CampoSenha
              id="cad-confirmacao"
              autoComplete="new-password"
              value={confirmacao}
              onChange={setConfirmacao}
            />
          </div>

          <button type="submit" className="btn btn-primario">
            Criar conta
          </button>
        </form>

        <p className="auth-link">
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
