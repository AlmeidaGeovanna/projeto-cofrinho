import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaHome,
  FaExchangeAlt,
  FaHistory,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logout, getUsuarioLogado } from "../utils/Autenticacao";

const links = [
  { to: "/", label: "Início", icone: FaHome },
  { to: "/transacoes", label: "Transações", icone: FaExchangeAlt },
  { to: "/historico", label: "Histórico", icone: FaHistory },
  { to: "/planejamento", label: "Planejamento", icone: FaCalendarCheck },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = getUsuarioLogado();
  const primeiroNome = usuario?.nome?.split(" ")[0];

  // Fecha o menu mobile ao trocar de página
  const [rotaAnterior, setRotaAnterior] = useState(location.pathname);
  if (rotaAnterior !== location.pathname) {
    setRotaAnterior(location.pathname);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    function onKey(e) {
      if (e.key === "Escape") setAberto(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  function handleLogout() {
    logout();
    toast.success("Sessão encerrada com sucesso.");
    setAberto(false);
    navigate("/login", { replace: true });
  }

  function renderLinks() {
    return links.map(({ to, label, icone: Icone }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) => (isActive ? "nav-link ativo" : "nav-link")}
      >
        <Icone aria-hidden="true" />
        <span>{label}</span>
      </NavLink>
    ));
  }

  return (
    <>
      <header className="header">
        <div className="nav-container">
          <div className="marca">
            <span className="marca-icone" aria-hidden="true">🐷</span>
            <div>
              <strong className="marca-nome">Cofrinho</strong>
              {primeiroNome && (
                <span className="marca-saudacao">Olá, {primeiroNome}</span>
              )}
            </div>
          </div>

          <nav className="menu" aria-label="Navegação principal">
            {renderLinks()}
            <button className="nav-link nav-sair" onClick={handleLogout}>
              <FaSignOutAlt aria-hidden="true" />
              <span>Sair</span>
            </button>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
          >
            {aberto ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav
          className={`menu-mobile ${aberto ? "open" : ""}`}
          aria-label="Navegação principal"
          aria-hidden={!aberto}
          inert={!aberto}
        >
          {renderLinks()}
          <button className="nav-link nav-sair" onClick={handleLogout}>
            <FaSignOutAlt aria-hidden="true" />
            <span>Sair</span>
          </button>
        </nav>
      </header>

      {aberto && (
        <div className="menu-overlay" onClick={() => setAberto(false)} />
      )}
    </>
  );
}
