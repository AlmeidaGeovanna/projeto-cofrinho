import { useEffect } from "react";

// Base dos modais: fecha com Esc ou clique fora e trava a rolagem da página
export default function Modal({ titulo, onFechar, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", onKey);

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onFechar]);

  return (
    <div className="modal-overlay" onMouseDown={onFechar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
