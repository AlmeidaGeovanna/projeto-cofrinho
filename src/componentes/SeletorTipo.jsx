import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function SeletorTipo({ value, onChange }) {
  return (
    <div className="seletor-tipo" role="radiogroup" aria-label="Tipo">
      <button
        type="button"
        role="radio"
        aria-checked={value === "entrada"}
        className={`seletor-opcao entrada ${value === "entrada" ? "ativo" : ""}`}
        onClick={() => onChange("entrada")}
      >
        <FaArrowUp aria-hidden="true" /> Entrada
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "saida"}
        className={`seletor-opcao saida ${value === "saida" ? "ativo" : ""}`}
        onClick={() => onChange("saida")}
      >
        <FaArrowDown aria-hidden="true" /> Saída
      </button>
    </div>
  );
}
