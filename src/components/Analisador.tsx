"use client";

import { useState, type FormEvent } from "react";
import type { Analise } from "@/lib/analise";
import { Resultado } from "./Resultado";

type ModoCurriculo = "pdf" | "texto";

export function Analisador() {
  const [modo, setModo] = useState<ModoCurriculo>("pdf");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [analise, setAnalise] = useState<Analise | null>(null);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setErro(null);
    setAnalise(null);

    const form = new FormData(evento.currentTarget);
    if (modo === "pdf") form.delete("curriculoTexto");
    else form.delete("curriculoPdf");

    try {
      const resposta = await fetch("/api/analisar", { method: "POST", body: form });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro ?? "Erro inesperado.");
      setAnalise(dados);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={enviar} className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Descrição da vaga</span>
          <textarea
            name="vaga"
            required
            minLength={50}
            rows={14}
            placeholder="Cole aqui o texto completo da vaga: responsabilidades, requisitos, diferenciais..."
            className="campo resize-y"
          />
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Seu currículo</span>
            <div className="flex rounded-lg border border-borda p-0.5 text-xs">
              {(["pdf", "texto"] as const).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => setModo(opcao)}
                  className={`rounded-md px-3 py-1 transition ${
                    modo === opcao ? "bg-destaque text-white" : "text-suave hover:text-foreground"
                  }`}
                >
                  {opcao === "pdf" ? "Enviar PDF" : "Colar texto"}
                </button>
              ))}
            </div>
          </div>

          {modo === "pdf" ? (
            <label className="campo flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 border-dashed text-center">
              <span className="text-3xl" aria-hidden>📄</span>
              <span className="text-sm text-suave">Clique para escolher um PDF (até 5 MB)</span>
              <input
                type="file"
                name="curriculoPdf"
                accept="application/pdf"
                required
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-destaque file:px-3 file:py-1.5 file:text-white"
              />
            </label>
          ) : (
            <textarea
              name="curriculoTexto"
              required
              minLength={50}
              rows={14}
              placeholder="Cole aqui o texto do seu currículo..."
              className="campo flex-1 resize-y"
            />
          )}
        </div>

        <div className="flex flex-col items-start gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={carregando}
            className="rounded-lg bg-destaque px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {carregando ? "Analisando..." : "Analisar compatibilidade"}
          </button>
          {erro && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {erro}
            </p>
          )}
        </div>
      </form>

      {carregando && (
        <p className="animate-pulse text-suave">Lendo a vaga e o currículo, isso leva alguns segundos...</p>
      )}
      {analise && <Resultado analise={analise} />}
    </div>
  );
}
