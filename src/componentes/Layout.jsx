import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const paginasPublicas = ["/login", "/cadastro"];

export default function Layout({ children }) {
  const location = useLocation();

  const mostrarLayout = !paginasPublicas.includes(location.pathname);

  return (
    <div className="app">
      {mostrarLayout && <Header />}

      <main className="main-content">
        {mostrarLayout ? (
          <div className="container">{children}</div>
        ) : (
          children
        )}
      </main>

      {mostrarLayout && <Footer />}
    </div>
  );
}
