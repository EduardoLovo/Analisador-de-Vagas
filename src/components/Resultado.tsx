"use client";

import { useState } from "react";
import type { Analise } from "@/lib/analise";

function corDaNota(nota: number) {
  if (nota >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (nota >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function Cartao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-borda bg-cartao p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-suave">{titulo}</h2>
      {children}
    </section>
  );
}

function Lista({ itens }: { itens: string[] }) {
  if (itens.length === 0) return <p className="text-sm text-suave">Nada a destacar.</p>;
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed">
      {itens.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Etiquetas({ itens, tipo }: { itens: string[]; tipo: "ok" | "falta" }) {
  if (itens.length === 0) return <p className="text-sm text-suave">Nenhuma.</p>;
  const estilo =
    tipo === "ok"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  return (
    <div className="flex flex-wrap gap-2">
      {itens.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1 text-xs font-medium ${estilo}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function Resultado({ analise }: { analise: Analise }) {
  const [copiado, setCopiado] = useState(false);

  async function copiarCarta() {
    await navigator.clipboard.writeText(analise.cartaApresentacao);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4 rounded-xl border border-borda bg-cartao p-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex flex-col items-center">
          <span className={`text-6xl font-bold tabular-nums ${corDaNota(analise.nota)}`}>{analise.nota}</span>
          <span className="text-xs text-suave">de 100</span>
        </div>
        <p className="leading-relaxed">{analise.resumo}</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Cartao titulo="Pontos fortes">
          <Lista itens={analise.pontosFortes} />
        </Cartao>
        <Cartao titulo="Lacunas">
          <Lista itens={analise.lacunas} />
        </Cartao>
        <Cartao titulo="Palavras-chave encontradas">
          <Etiquetas itens={analise.palavrasChaveEncontradas} tipo="ok" />
        </Cartao>
        <Cartao titulo="Palavras-chave faltando">
          <Etiquetas itens={analise.palavrasChaveFaltando} tipo="falta" />
        </Cartao>
      </div>

      <Cartao titulo="Sugestões para o currículo">
        <Lista itens={analise.sugestoes} />
      </Cartao>

      <Cartao titulo="Carta de apresentação">
        <p className="whitespace-pre-line text-sm leading-relaxed">{analise.cartaApresentacao}</p>
        <button
          type="button"
          onClick={copiarCarta}
          className="mt-4 rounded-lg border border-borda px-4 py-2 text-sm transition hover:bg-background"
        >
          {copiado ? "Copiado!" : "Copiar carta"}
        </button>
      </Cartao>
    </div>
  );
}
