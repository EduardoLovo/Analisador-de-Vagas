import { ApiError, GoogleGenAI, type Part } from "@google/genai";
import { analiseSchema, promptSistema, type Analise } from "@/lib/analise";

const TAMANHO_MAXIMO_PDF = 5 * 1024 * 1024; // 5 MB

function erro(mensagem: string, status: number) {
  return Response.json({ erro: mensagem }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return erro("GEMINI_API_KEY não configurada. Veja o arquivo .env.example.", 500);
  }

  const form = await request.formData();
  const vaga = String(form.get("vaga") ?? "").trim();
  const curriculoTexto = String(form.get("curriculoTexto") ?? "").trim();
  const curriculoPdf = form.get("curriculoPdf");

  if (vaga.length < 50) {
    return erro("Cole a descrição completa da vaga (mínimo de 50 caracteres).", 400);
  }

  let curriculo: Part;
  if (curriculoPdf instanceof File && curriculoPdf.size > 0) {
    if (curriculoPdf.type !== "application/pdf") {
      return erro("O currículo precisa ser um arquivo PDF.", 400);
    }
    if (curriculoPdf.size > TAMANHO_MAXIMO_PDF) {
      return erro("O PDF deve ter no máximo 5 MB.", 400);
    }
    const base64 = Buffer.from(await curriculoPdf.arrayBuffer()).toString("base64");
    curriculo = { inlineData: { mimeType: "application/pdf", data: base64 } };
  } else if (curriculoTexto.length >= 50) {
    curriculo = { text: `CURRÍCULO:\n${curriculoTexto}` };
  } else {
    return erro("Envie o currículo em PDF ou cole o texto dele.", 400);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const resposta = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [{ text: `DESCRIÇÃO DA VAGA:\n${vaga}` }, curriculo],
        },
      ],
      config: {
        systemInstruction: promptSistema,
        responseMimeType: "application/json",
        responseJsonSchema: analiseSchema,
        temperature: 0.4,
      },
    });

    if (!resposta.text) {
      return erro("A IA não retornou uma análise. Tente novamente.", 502);
    }

    const analise: Analise = JSON.parse(resposta.text);
    return Response.json(analise);
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 429) {
        return erro("Limite gratuito da API atingido. Aguarde um minuto e tente de novo.", 429);
      }
      if (e.status === 400 || e.status === 403) {
        return erro("Requisição recusada pelo Gemini. Confira sua GEMINI_API_KEY.", e.status);
      }
    }
    console.error("Erro ao analisar:", e);
    return erro("Erro ao gerar a análise. Tente novamente.", 500);
  }
}
