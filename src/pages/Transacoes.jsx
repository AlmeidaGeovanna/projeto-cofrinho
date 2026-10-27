import { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

import ModalConfirmacao from "../componentes/ModalConfirmacao";
import ModalEditarTransacao from "../componentes/ModalEditarTransacao";
import CardTransacao from "../componentes/CardTransacao";
import CampoData from "../componentes/CampoData";
import SeletorTipo from "../componentes/SeletorTipo";
import {
  categoriasPorTipo,
  dataLocalISO,
  gerarId,
  mascaraMoeda,
  moedaParaNumero,
  ordenarPorDataDesc,
} from "../utils/formatacao";

export default function Transacoes({ transacoes, setTransacoes }) {
  const hoje = dataLocalISO();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("saida");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(hoje);

  const [paraExcluir, setParaExcluir] = useState(null);
  const [transacaoEditando, setTransacaoEditando] = useState(null);

  function handleTipoChange(novoTipo) {
    setTipo(novoTipo);
    setCategoria("");
  }

  function limparFormulario() {
    setDescricao("");
    setValor("");
    setCategoria("");
    setData(dataLocalISO());
  }

  function adicionarTransacao(e) {
    e.preventDefault();

    const descricaoLimpa = descricao.trim();
    const valorNumerico = moedaParaNumero(valor);

    if (!descricaoLimpa || !valor || !categoria || !data) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (descricaoLimpa.length < 3) {
      toast.error("A descrição precisa ter ao menos 3 letras.");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Digite um valor válido!");
      return;
    }

    // Datas AAAA-MM-DD podem ser comparadas como texto, sem problemas de fuso
    if (data > dataLocalISO()) {
      toast.error("A data não pode ser futura!");
      return;
    }

    const nova = {
      id: gerarId(),
      descricao: descricaoLimpa,
      valor: valorNumerico,
      tipo,
      categoria,
      data,
    };

    setTransacoes((prev) => [...prev, nova]);
    toast.success("Transação adicionada!");
    limparFormulario();
  }

  function salvarEdicao(transacaoAtualizada) {
    setTransacoes((prev) =>
      prev.map((t) => (t.id === transacaoAtualizada.id ? transacaoAtualizada : t))
    );
    setTransacaoEditando(null);
    toast.success("Transação atualizada!");
  }

  function confirmarExclusao() {
    setTransacoes((prev) => prev.filter((t) => t.id !== paraExcluir.id));
    setParaExcluir(null);
    toast.info("Transação removida.");
  }

  const ordenadas = ordenarPorDataDesc(transacoes);

  return (
    <section className="pagina">
      <h1 className="titulo-pagina">Transações</h1>

      <form className="form" onSubmit={adicionarTransacao}>
        <h2 className="form-title">Nova transação</h2>

        <SeletorTipo value={tipo} onChange={handleTipoChange} />

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            className="input"
            placeholder="Ex: Mercado"
            maxLength={60}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="valor">Valor</label>
            <input
              id="valor"
              type="text"
              inputMode="numeric"
              className="input"
              placeholder="R$ 0,00"
              value={valor}
              onChange={(e) => setValor(mascaraMoeda(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              className="input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione</option>
              {categoriasPorTipo(tipo).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data">Data</label>
            <CampoData id="data" value={data} max={hoje} onChange={setData} />
          </div>
        </div>

        <button type="submit" className="btn btn-primario">
          Adicionar
        </button>
      </form>

      <h2 className="titulo-secao">
        Todas as transações{" "}
        {transacoes.length > 0 && (
          <span className="contador">{transacoes.length}</span>
        )}
      </h2>

      {ordenadas.length === 0 ? (
        <div className="estado-vazio">
          <div className="icone-vazio">💸</div>
          <h3>Nenhuma transação cadastrada</h3>
          <p>Use o formulário acima para registrar sua primeira movimentação.</p>
        </div>
      ) : (
        <div className="lista">
          {ordenadas.map((t) => (
            <CardTransacao
              key={t.id}
              item={t}
              acoes={
                <>
                  <button
                    className="btn-icone editar"
                    onClick={() => setTransacaoEditando(t)}
                    aria-label={`Editar ${t.descricao}`}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-icone excluir"
                    onClick={() => setParaExcluir(t)}
                    aria-label={`Excluir ${t.descricao}`}
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
          titulo="Excluir transação"
          mensagem={`Deseja excluir "${paraExcluir.descricao}"?`}
          textoConfirmar="Excluir"
          onConfirmar={confirmarExclusao}
          onCancelar={() => setParaExcluir(null)}
        />
      )}

      {transacaoEditando && (
        <ModalEditarTransacao
          transacao={transacaoEditando}
          onSalvar={salvarEdicao}
          onCancelar={() => setTransacaoEditando(null)}
        />
      )}
    </section>
  );
}
