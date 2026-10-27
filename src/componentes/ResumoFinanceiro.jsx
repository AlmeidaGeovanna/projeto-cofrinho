import { FaArrowDown, FaArrowUp, FaWallet } from "react-icons/fa";
import { formatarMoeda, somarPorTipo } from "../utils/formatacao";

export default function ResumoFinanceiro({ transacoes }) {
  const entradas = somarPorTipo(transacoes, "entrada");
  const saidas = somarPorTipo(transacoes, "saida");
  const saldo = entradas - saidas;

  return (
    <div className="dashboard-resumo">
      <div className="card-resumo saldo destaque">
        <p>
          <FaWallet aria-hidden="true" /> Saldo
        </p>
        <h3 className={saldo >= 0 ? "positivo" : "negativo"}>
          {formatarMoeda(saldo)}
        </h3>
      </div>

      <div className="card-resumo entrada">
        <p>
          <FaArrowUp aria-hidden="true" /> Entradas
        </p>
        <h3>{formatarMoeda(entradas)}</h3>
      </div>

      <div className="card-resumo saida">
        <p>
          <FaArrowDown aria-hidden="true" /> Saídas
        </p>
        <h3>{formatarMoeda(saidas)}</h3>
      </div>
    </div>
  );
}
