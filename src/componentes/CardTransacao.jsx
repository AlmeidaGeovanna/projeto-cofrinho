import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatarDataBR, formatarMoeda } from "../utils/formatacao";

// Item de lista usado em Início, Transações, Histórico e Planejamento.
// `acoes` é opcional e aparece à direita do valor.
export default function CardTransacao({ item, tipo = item.tipo, selo, acoes }) {
  const Icone = tipo === "entrada" ? FaArrowUp : FaArrowDown;
  const sinal = tipo === "entrada" ? "+" : "−";

  return (
    <div className={`card ${tipo}`}>
      <div className="card-icone" aria-hidden="true">
        <Icone />
      </div>

      <div className="info-texto">
        <strong className="card-descricao">{item.descricao}</strong>
        <span className="card-meta">
          <span className="categoria">{item.categoria || "Outros"}</span>
          <span className="data">{formatarDataBR(item.data)}</span>
          {selo}
        </span>
      </div>

      <div className="card-lado">
        <span className="valor">
          {sinal} {formatarMoeda(item.valor)}
        </span>
        {acoes && <div className="acoes">{acoes}</div>}
      </div>
    </div>
  );
}
