# Analisador de Vaga

Compare seu currículo com uma vaga usando IA (Google Gemini, plano gratuito) e receba:

- Nota de compatibilidade (0–100) com justificativa
- Pontos fortes e lacunas em relação aos requisitos
- Palavras-chave encontradas e faltando
- Sugestões de ajuste no currículo
- Rascunho de carta de apresentação

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- `@google/genai` com saída em JSON estruturado
- O currículo pode ser enviado em PDF (lido direto pelo Gemini) ou colado como texto

## Como rodar

1. Gere uma chave grátis em https://aistudio.google.com/apikey
2. Copie `.env.example` para `.env.local` e preencha `GEMINI_API_KEY`
3. Instale e rode:

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

## Estrutura

- `src/app/api/analisar/route.ts`: rota que recebe vaga + currículo e chama o Gemini
- `src/lib/analise.ts`: tipo da resposta, JSON Schema e prompt
- `src/components/Analisador.tsx`: formulário
- `src/components/Resultado.tsx`: exibição da análise

## Deploy

Funciona na Vercel (plano gratuito): importe o repositório e configure `GEMINI_API_KEY` nas variáveis de ambiente.
