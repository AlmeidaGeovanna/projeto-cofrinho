import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import CampoData from "../componentes/CampoData";
import CardTransacao from "../componentes/CardTransacao";
import {
  dataLocalISO,
  formatarMoeda,
  ordenarPorDataDesc,
  somarPorTipo,
} from "../utils/formatacao";

const filtrosTipo = [
  { valor: "todas", label: "Todas" },
  { valor: "entrada", label: "Entradas" },
  { valor: "saida", label: "Saídas" },
];

export default function Historico({ transacoes }) {
  const hoje = new Date();

  const [dataInicio, setDataInicio] = useState(
    dataLocalISO(new Date(hoje.getFullYear(), hoje.getMonth(), 1))
  );
  const [dataFim, setDataFim] = useState(dataLocalISO(hoje));
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todas");

  const periodoInvalido = dataInicio && dataFim && dataInicio > dataFim;
  const termo = busca.trim().toLowerCase();

  const filtradas = ordenarPorDataDesc(
    transacoes.filter((t) => {
      if (!t.data) return false;

      const matchPeriodo =
        (!dataInicio || t.data >= dataInicio) &&
        (!dataFim || t.data <= dataFim);

      const matchBusca =
        !termo ||
        t.descricao.toLowerCase().includes(termo) ||
        (t.categoria || "").toLowerCase().includes(termo);

      const matchTipo = filtroTipo === "todas" || t.tipo === filtroTipo;

      return matchPeriodo && matchBusca && matchTipo;
    })
  );

  const totalEntradas = somarPorTipo(filtradas, "entrada");
  const totalSaidas = somarPorTipo(filtradas, "saida");
  const saldo = totalEntradas - totalSaidas;

  return (
    <section className="pagina">
      <h1 className="titulo-pagina">Histórico</h1>

      <div className="filtros-historico">
        <div className="campo-busca">
          <FaSearch className="busca-icone" aria-hidden="true" />
          <input
            type="search"
            placeholder="Pesquisar por descrição ou categoria..."
            className="input"
            aria-label="Pesquisar transação"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros-data">
          <div className="form-group">
            <label htmlFor="data-inicio">De</label>
            <CampoData
              id="data-inicio"
              value={dataInicio}
              max={dataFim || undefined}
              onChange={setDataInicio}
            />
          </div>

          <div className="form-group">
            <label htmlFor="data-fim">Até</label>
            <CampoData
              id="data-fim"
              value={dataFim}
              min={dataInicio || undefined}
              onChange={setDataFim}
            />
          </div>
        </div>

        {periodoInvalido && (
          <p className="texto-perigo">
            A data inicial é maior que a data final.
          </p>
        )}

        <div className="tipo-filtros" role="group" aria-label="Filtrar por tipo">
          {filtrosTipo.map((f) => (
            <button
              key={f.valor}
              type="button"
              aria-pressed={filtroTipo === f.valor}
              className={filtroTipo === f.valor ? "filtro-btn ativo" : "filtro-btn"}
              onClick={() => setFiltroTipo(f.valor)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="resumo-historico">
        <div className="resumo-card entradas">
          <span className="resumo-label">Entradas</span>
          <h3>{formatarMoeda(totalEntradas)}</h3>
        </div>

        <div className="resumo-card saidas">
          <span className="resumo-label">Saídas</span>
          <h3>{formatarMoeda(totalSaidas)}</h3>
        </div>

        <div className="resumo-card saldo">
          <span className="resumo-label">Saldo</span>
          <h3 className={saldo >= 0 ? "positivo" : "negativo"}>
            {formatarMoeda(saldo)}
          </h3>
        </div>
      </div>

      {filtradas.length > 0 ? (
        <>
          <h2 className="titulo-secao">
            Transações encontradas{" "}
            <span className="contador">{filtradas.length}</span>
          </h2>

          <div className="lista">
            {filtradas.map((t) => (
              <CardTransacao key={t.id} item={t} />
            ))}
          </div>
        </>
      ) : (
        <div className="estado-vazio">
          <div className="icone-vazio">🔍</div>
          <h3>Nenhuma transação encontrada</h3>
          <p>Tente ajustar o período ou os filtros.</p>
        </div>
      )}
    </section>
  );
}
