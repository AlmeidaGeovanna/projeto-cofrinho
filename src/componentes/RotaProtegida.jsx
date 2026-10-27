import { Navigate } from "react-router-dom";
import { estaLogado } from "../utils/Autenticacao";

export default function RotaProtegida({ children }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
