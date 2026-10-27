import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CampoSenha({ id, value, onChange, ...props }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="campo-senha">
      <input
        id={id}
        type={visivel ? "text" : "password"}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <button
        type="button"
        className="senha-toggle"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
      >
        {visivel ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
