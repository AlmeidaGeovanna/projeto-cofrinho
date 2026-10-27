import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import CampoData from "./CampoData";
import {
  categoriasSaida,
  formatarMoeda,
  mascaraMoeda,
  moedaParaNumero,
} from "../utils/formatacao";

export default function ModalEditarPlanejamento({
  planejamento,
  onSalvar,
  onCancelar,
}) {
  const [descricao, setDescricao] = useState(planejamento.descricao);
  const [valor, setValor] = useState(formatarMoeda(planejamento.valor));
  const [categoria, setCategoria] = useState(planejamento.categoria || "");
  const [data, setData] = useState(planejamento.data);

  function salvar(e) {
    e.preventDefault();

    const descricaoLimpa = descricao.trim();
    const valorNumerico = moedaParaNumero(valor);

    if (!descricaoLimpa || !valor || !categoria || !data) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (valorNumerico <= 0) {
      toast.error("Informe um valor válido!");
      return;
    }

    onSalvar({
      ...planejamento,
      descricao: descricaoLimpa,
      valor: valorNumerico,
      categoria,
      data,
    });
  }

  return (
    <Modal titulo="Editar planejamento" onFechar={onCancelar}>
      <form className="modal-form" onSubmit={salvar}>
        <div className="form-group">
          <label htmlFor="plan-descricao">Descrição</label>
          <input
            id="plan-descricao"
            className="input"
            value={descricao}
            maxLength={60}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="plan-valor">Valor</label>
          <input
            id="plan-valor"
            className="input"
            inputMode="numeric"
            value={valor}
            onChange={(e) => setValor(mascaraMoeda(e.target.value))}
          />
        </div>

        <div className="form-row duas">
          <div className="form-group">
            <label htmlFor="plan-categoria">Categoria</label>
            <select
              id="plan-categoria"
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
            <label htmlFor="plan-data">Vencimento</label>
            <CampoData id="plan-data" value={data} onChange={setData} />
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
