import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import CampoData from "./CampoData";
import SeletorTipo from "./SeletorTipo";
import {
  categoriasPorTipo,
  dataLocalISO,
  formatarMoeda,
  mascaraMoeda,
  moedaParaNumero,
} from "../utils/formatacao";

export default function ModalEditarTransacao({
  transacao,
  onSalvar,
  onCancelar,
}) {
  const [descricao, setDescricao] = useState(transacao.descricao);
  const [valor, setValor] = useState(formatarMoeda(transacao.valor));
  const [tipo, setTipo] = useState(transacao.tipo);
  const [categoria, setCategoria] = useState(transacao.categoria || "");
  const [data, setData] = useState(transacao.data);

  const hoje = dataLocalISO();
  const categorias = categoriasPorTipo(tipo);

  function handleTipoChange(novoTipo) {
    setTipo(novoTipo);
    // Mantém a categoria só se ela existir no novo tipo
    if (!categoriasPorTipo(novoTipo).includes(categoria)) {
      setCategoria("");
    }
  }

  function salvarEdicao(e) {
    e.preventDefault();

    const descricaoLimpa = descricao.trim();
    const valorNumerico = moedaParaNumero(valor);

    if (!descricaoLimpa || !valor || !categoria || !data) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (descricaoLimpa.length < 3) {
      toast.error("Descrição muito curta!");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Digite um valor válido!");
      return;
    }

    if (data > hoje) {
      toast.error("A data não pode ser futura!");
      return;
    }

    onSalvar({
      ...transacao,
      descricao: descricaoLimpa,
      valor: valorNumerico,
      tipo,
      categoria,
      data,
    });
  }

  return (
    <Modal titulo="Editar transação" onFechar={onCancelar}>
      <form className="modal-form" onSubmit={salvarEdicao}>
        <SeletorTipo value={tipo} onChange={handleTipoChange} />

        <div className="form-group">
          <label htmlFor="edit-descricao">Descrição</label>
          <input
            id="edit-descricao"
            type="text"
            className="input"
            value={descricao}
            maxLength={60}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-valor">Valor</label>
          <input
            id="edit-valor"
            type="text"
            inputMode="numeric"
            className="input"
            value={valor}
            onChange={(e) => setValor(mascaraMoeda(e.target.value))}
          />
        </div>

        <div className="form-row duas">
          <div className="form-group">
            <label htmlFor="edit-categoria">Categoria</label>
            <select
              id="edit-categoria"
              className="input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-data">Data</label>
            <CampoData id="edit-data" value={data} max={hoje} onChange={setData} />
          </div>
        </div>

        <div className="modal-botoes">
          <button type="button" className="btn btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
