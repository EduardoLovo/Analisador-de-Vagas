import { Analisador } from "@/components/Analisador";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Analisador de Vaga</h1>
        <p className="mt-2 text-suave">
          Compare seu currículo com uma vaga e descubra sua compatibilidade, as palavras-chave que faltam e o que
          ajustar antes de se candidatar.
        </p>
      </header>
      <Analisador />
    </main>
  );
}
