import { useState } from "react";
import { toast } from "react-toastify";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

import ModalConfirmacao from "../componentes/ModalConfirmacao";
import ModalEditarPlanejamento from "../componentes/ModalEditarPlanejamento";
import CardTransacao from "../componentes/CardTransacao";
import CampoData from "../componentes/CampoData";
import {
  categoriasSaida,
  dataLocalISO,
  formatarMoeda,
  gerarId,
  mascaraMoeda,
  moedaParaNumero,
} from "../utils/formatacao";

export default function Planejamento({
  planejamentos,
  setPlanejamentos,
  setTransacoes,
}) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");

  const [paraExcluir, setParaExcluir] = useState(null);
  const [planejamentoEditando, setPlanejamentoEditando] = useState(null);

  const hoje = dataLocalISO();

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setData("");
    setCategoria("");
  }

  function adicionarPlanejamento(e) {
    e.preventDefault();

    const descricaoLimpa = descricao.trim();
    const valorNumerico = moedaParaNumero(valor);

    if (!descricaoLimpa || !valor || !data || !categoria) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Informe um valor válido!");
      return;
    }

    setPlanejamentos((prev) => [
      ...prev,
      {
        id: gerarId(),
        descricao: descricaoLimpa,
        valor: valorNumerico,
        data,
        categoria,
      },
    ]);

    toast.success("Conta planejada!");
    limparFormulario();
  }

  function salvarEdicaoPlanejamento(atualizado) {
    setPlanejamentos((prev) =>
      prev.map((p) => (p.id === atualizado.id ? atualizado : p))
    );
    setPlanejamentoEditando(null);
    toast.success("Planejamento atualizado!");
  }

  function confirmarExclusao() {
    setPlanejamentos((prev) => prev.filter((p) => p.id !== paraExcluir.id));
    setParaExcluir(null);
    toast.info("Planejamento removido.");
  }

  function marcarComoPago(item) {
    setTransacoes((prev) => [
      ...prev,
      {
        id: gerarId(),
        descricao: item.descricao,
        valor: item.valor,
        tipo: "saida",
        categoria: item.categoria,
        data: dataLocalISO(),
      },
    ]);

    setPlanejamentos((prev) => prev.filter((p) => p.id !== item.id));

    toast.success("Conta paga! Lançada em Transações.");
  }

  const totalPrevisto = planejamentos.reduce((acc, item) => acc + item.valor, 0);
  const totalVencido = planejamentos
    .filter((p) => p.data < hoje)
    .reduce((acc, item) => acc + item.valor, 0);

  const planejamentosOrdenados = [...planejamentos].sort((a, b) =>
    a.data.localeCompare(b.data)
  );

  function selo(p) {
    if (p.data < hoje) return <span className="selo perigo">Vencida</span>;
    if (p.data === hoje) return <span className="selo alerta">Vence hoje</span>;
    return null;
  }

  return (
    <section className="pagina">
      <h1 className="titulo-pagina">Planejamento</h1>

      <form className="form" onSubmit={adicionarPlanejamento}>
        <h2 className="form-title">Nova conta a pagar</h2>

        <div className="form-group">
          <label htmlFor="plan-novo-descricao">Descrição</label>
          <input
            id="plan-novo-descricao"
            className="input"
            placeholder="Ex: Conta de luz"
            maxLength={60}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="plan-novo-valor">Valor</label>
            <input
              id="plan-novo-valor"
              className="input"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(mascaraMoeda(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="plan-novo-categoria">Categoria</label>
            <select
              id="plan-novo-categoria"
              className="input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione</option>
              {categoriasSaida.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="plan-novo-data">Vencimento</label>
            <CampoData id="plan-novo-data" value={data} onChange={setData} />
          </div>
        </div>

        <button type="submit" className="btn btn-primario">
          Adicionar
        </button>
      </form>

      <div className="resumo-historico">
        <div className="resumo-card saldo">
          <span className="resumo-label">Total previsto</span>
          <h3>{formatarMoeda(totalPrevisto)}</h3>
        </div>

        {totalVencido > 0 && (
          <div className="resumo-card saidas">
            <span className="resumo-label">Vencido</span>
            <h3 className="negativo">{formatarMoeda(totalVencido)}</h3>
          </div>
        )}
      </div>

      {planejamentosOrdenados.length === 0 ? (
        <div className="estado-vazio">
          <div className="icone-vazio">📅</div>
          <h3>Nenhuma conta planejada</h3>
          <p>Cadastre contas futuras para não esquecer de pagar.</p>
        </div>
      ) : (
        <div className="lista">
          {planejamentosOrdenados.map((p) => (
            <CardTransacao
              key={p.id}
              item={p}
              tipo="saida"
              selo={selo(p)}
              acoes={
                <>
                  <button
                    className="btn-icone pagar"
                    onClick={() => marcarComoPago(p)}
                    aria-label={`Marcar ${p.descricao} como pago`}
                    title="Marcar como pago"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="btn-icone editar"
                    onClick={() => setPlanejamentoEditando(p)}
                    aria-label={`Editar ${p.descricao}`}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icone excluir"
                    onClick={() => setParaExcluir(p)}
                    aria-label={`Excluir ${p.descricao}`}
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      {paraExcluir && (
        <ModalConfirmacao
          titulo="Excluir planejamento"
          mensagem={`Deseja excluir "${paraExcluir.descricao}"?`}
          textoConfirmar="Excluir"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setParaExcluir(null)}
        />
      )}

      {planejamentoEditando && (
        <ModalEditarPlanejamento
          planejamento={planejamentoEditando}
          onSalvar={salvarEdicaoPlanejamento}
          onCancelar={() => setPlanejamentoEditando(null)}
        />
      )}
    </section>
  );
}
