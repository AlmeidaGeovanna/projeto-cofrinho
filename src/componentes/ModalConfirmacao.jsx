import Modal from "./Modal";

export default function ModalConfirmacao({
  onConfirmar,
  onCancelar,
  titulo = "Confirmar ação",
  mensagem = "Tem certeza que deseja continuar?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
}) {
  return (
    <Modal titulo={titulo} onFechar={onCancelar}>
      <p className="modal-mensagem">{mensagem}</p>

      <div className="modal-botoes">
        <button type="button" className="btn btn-secundario" onClick={onCancelar}>
          {textoCancelar}
        </button>

        <button
          type="button"
          className="btn btn-perigo"
          onClick={onConfirmar}
          autoFocus
        >
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
