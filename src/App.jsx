import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Layout from "./componentes/Layout";

import Inicio from "./pages/Inicio";
import Transacoes from "./pages/Transacoes";
import Historico from "./pages/Historico";
import Planejamento from "./pages/Planejamento";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import RotaProtegida from "./componentes/RotaProtegida";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getUsuarioLogado } from "./utils/Autenticacao";
import useDadosUsuario from "./utils/useDadosUsuario";

import "./App.css";

export default function App() {
  // Re-renderiza a cada navegação para detectar login/logout
  useLocation();

  const usuario = getUsuarioLogado();
  const email = usuario?.email;

  const [transacoes, setTransacoes] = useDadosUsuario(
    email ? `transacoes_${email}` : null
  );

  const [planejamentos, setPlanejamentos] = useDadosUsuario(
    email ? `planejamentos_${email}` : null
  );

  return (
    <Layout>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Inicio
                transacoes={transacoes}
                planejamentos={planejamentos}
              />
            </RotaProtegida>
          }
        />

        <Route
          path="/transacoes"
          element={
            <RotaProtegida>
              <Transacoes
                transacoes={transacoes}
                setTransacoes={setTransacoes}
              />
            </RotaProtegida>
          }
        />

        <Route
          path="/historico"
          element={
            <RotaProtegida>
              <Historico transacoes={transacoes} />
            </RotaProtegida>
          }
        />

        <Route
          path="/planejamento"
          element={
            <RotaProtegida>
              <Planejamento
                planejamentos={planejamentos}
                setPlanejamentos={setPlanejamentos}
                setTransacoes={setTransacoes}
              />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="dark"
        newestOnTop
      />
    </Layout>
  );
}
