export const categoriasEntrada = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
];

export const categoriasSaida = [
  "Alimentação",
  "Transporte",
  "Lazer",
  "Contas",
  "Moradia",
  "Saúde",
  "Educação",
  "Outros",
];

export function categoriasPorTipo(tipo) {
  return tipo === "entrada" ? categoriasEntrada : categoriasSaida;
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Máscara de digitação: "12345" -> "R$ 123,45"
export function mascaraMoeda(valorDigitado) {
  const numeros = String(valorDigitado).replace(/\D/g, "");
  if (!numeros) return "";
  return formatarMoeda(Number(numeros) / 100);
}

export function moedaParaNumero(valorFormatado) {
  return Number(String(valorFormatado).replace(/\D/g, "")) / 100;
}

// Data local no formato AAAA-MM-DD (toISOString usa UTC e erra o dia à noite no Brasil)
export function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  return dataISO.split("-").reverse().join("/");
}

export function somarPorTipo(transacoes, tipo) {
  return transacoes
    .filter((t) => t.tipo === tipo)
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);
}

export function ordenarPorDataDesc(lista) {
  return [...lista].sort(
    (a, b) => (b.data || "").localeCompare(a.data || "") || b.id - a.id
  );
}

export function gerarId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
