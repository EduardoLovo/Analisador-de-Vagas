export type Analise = {
  nota: number;
  resumo: string;
  pontosFortes: string[];
  lacunas: string[];
  palavrasChaveEncontradas: string[];
  palavrasChaveFaltando: string[];
  sugestoes: string[];
  cartaApresentacao: string;
};

const listaDeTexto = { type: "array", items: { type: "string" } };

// JSON Schema enviado ao Gemini para forçar a resposta no formato de `Analise`.
export const analiseSchema = {
  type: "object",
  properties: {
    nota: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description: "Compatibilidade do candidato com a vaga, de 0 a 100.",
    },
    resumo: {
      type: "string",
      description: "Parágrafo curto explicando a nota.",
    },
    pontosFortes: {
      ...listaDeTexto,
      description: "Requisitos da vaga que o currículo atende bem.",
    },
    lacunas: {
      ...listaDeTexto,
      description: "Requisitos da vaga que o currículo não atende ou não evidencia.",
    },
    palavrasChaveEncontradas: {
      ...listaDeTexto,
      description: "Palavras-chave da vaga presentes no currículo.",
    },
    palavrasChaveFaltando: {
      ...listaDeTexto,
      description: "Palavras-chave importantes da vaga ausentes do currículo.",
    },
    sugestoes: {
      ...listaDeTexto,
      description: "Ajustes concretos no currículo para esta vaga.",
    },
    cartaApresentacao: {
      type: "string",
      description: "Rascunho de carta de apresentação para a vaga.",
    },
  },
  required: [
    "nota",
    "resumo",
    "pontosFortes",
    "lacunas",
    "palavrasChaveEncontradas",
    "palavrasChaveFaltando",
    "sugestoes",
    "cartaApresentacao",
  ],
};

export const promptSistema = `Você é um recrutador técnico experiente e especialista em currículos para o mercado brasileiro.
Compare o currículo do candidato com a descrição da vaga e responda em português do Brasil.

Regras:
- Seja honesto na nota: não infle a compatibilidade.
- Baseie-se apenas no que está escrito no currículo. Nunca invente experiências, cursos ou resultados.
- Nas sugestões, indique ajustes concretos (o que reescrever, destacar ou incluir), e só sugira incluir algo se o candidato realmente tiver aquela experiência.
- Na carta de apresentação, use apenas fatos do currículo, em tom profissional e direto, com até 4 parágrafos curtos.`;
