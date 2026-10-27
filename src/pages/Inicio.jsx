import { Link } from "react-router-dom";
import { FaPlus, FaCalendarCheck } from "react-icons/fa";

import ResumoFinanceiro from "../componentes/ResumoFinanceiro";
import CardTransacao from "../componentes/CardTransacao";
import { getUsuarioLogado } from "../utils/Autenticacao";
import {
  dataLocalISO,
  formatarMoeda,
  ordenarPorDataDesc,
} from "../utils/formatacao";

export default function Inicio({ transacoes, planejamentos }) {
  const usuario = getUsuarioLogado();
  const primeiroNome = usuario?.nome?.split(" ")[0];

  const ultimas = ordenarPorDataDesc(transacoes).slice(0, 5);

  const hoje = dataLocalISO();
  const contasPendentes = planejamentos.length;
  const contasVencidas = planejamentos.filter((p) => p.data < hoje).length;
  const totalPendente = planejamentos.reduce((acc, p) => acc + p.valor, 0);

  return (
    <section className="pagina">
      <div className="home-topo">
        <h1>Olá{primeiroNome ? `, ${primeiroNome}` : ""}! 👋</h1>
        <p>Aqui está o resumo das suas finanças.</p>
      </div>

      <ResumoFinanceiro transacoes={transacoes} />

      <Link to="/transacoes" className="btn btn-primario btn-bloco">
        <FaPlus aria-hidden="true" /> Nova movimentação
      </Link>

      {contasPendentes > 0 && (
        <Link to="/planejamento" className="aviso-contas">
          <FaCalendarCheck aria-hidden="true" />
          <div>
            <strong>
              {contasPendentes} conta{contasPendentes > 1 ? "s" : ""} planejada
              {contasPendentes > 1 ? "s" : ""} · {formatarMoeda(totalPendente)}
            </strong>
            {contasVencidas > 0 && (
              <span className="texto-perigo">
                {contasVencidas} vencida{contasVencidas > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </Link>
      )}

      <div className="secao-cabecalho">
        <h2 className="titulo-secao">Últimas movimentações</h2>
        {transacoes.length > 0 && (
          <Link to="/historico" className="link-secundario">
            Ver tudo
          </Link>
        )}
      </div>

      {ultimas.length > 0 ? (
        <div className="lista">
          {ultimas.map((t) => (
            <CardTransacao key={t.id} item={t} />
          ))}
        </div>
      ) : (
        <div className="estado-vazio">
          <div className="icone-vazio">🐷</div>
          <h3>Seu cofrinho está vazio</h3>
          <p>Adicione sua primeira movimentação para começar.</p>
        </div>
      )}
    </section>
  );
}
