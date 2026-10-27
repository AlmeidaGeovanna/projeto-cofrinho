import { useCallback, useEffect, useState } from "react";

function ler(chave) {
  if (!chave) return [];
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch {
    return [];
  }
}

// Estado persistido no localStorage que é recarregado quando a chave muda
// (ex.: ao trocar de usuário), evitando misturar dados de contas diferentes.
export default function useDadosUsuario(chave) {
  const [estado, setEstado] = useState(() => ({
    chave,
    dados: ler(chave),
  }));

  let atual = estado;

  if (estado.chave !== chave) {
    atual = { chave, dados: ler(chave) };
    setEstado(atual);
  }

  useEffect(() => {
    if (estado.chave) {
      localStorage.setItem(estado.chave, JSON.stringify(estado.dados));
    }
  }, [estado]);

  const setDados = useCallback((novo) => {
    setEstado((prev) => ({
      ...prev,
      dados: typeof novo === "function" ? novo(prev.dados) : novo,
    }));
  }, []);

  return [atual.dados, setDados];
}
