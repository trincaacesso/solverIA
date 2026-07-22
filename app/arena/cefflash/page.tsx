"use client";

import { useState } from "react";
import { Zap, Plus, Trash2, Shuffle, Trophy, Crown, Pencil } from "lucide-react";
import {
  buildBracket,
  recomputeBracket,
  roundLabel,
  championOf,
  type Round,
} from "@/lib/bracket";
import { cn } from "@/lib/utils";

interface Championship {
  name: string;
  rounds: Round[];
}

export default function CefflashPage() {
  const [name, setName] = useState("");
  const [pairs, setPairs] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [championship, setChampionship] = useState<Championship | null>(null);

  const updatePair = (i: number, value: string) =>
    setPairs((p) => p.map((v, idx) => (idx === i ? value : v)));

  const addPair = () => setPairs((p) => [...p, ""]);

  const removePair = (i: number) =>
    setPairs((p) => (p.length <= 2 ? p : p.filter((_, idx) => idx !== i)));

  const shuffle = () =>
    setPairs((p) => {
      const arr = [...p];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });

  const generate = () => {
    const clean = pairs.map((p) => p.trim()).filter(Boolean);
    if (!name.trim()) {
      setError("Dê um nome ao campeonato.");
      return;
    }
    if (clean.length < 2) {
      setError("Cadastre pelo menos 2 duplas.");
      return;
    }
    if (new Set(clean.map((c) => c.toLowerCase())).size !== clean.length) {
      setError("Há nomes de duplas repetidos.");
      return;
    }
    setError("");
    setChampionship({ name: name.trim(), rounds: buildBracket(clean) });
  };

  const pickWinner = (roundIdx: number, matchIdx: number, side: "a" | "b") => {
    setChampionship((c) => {
      if (!c) return c;
      const rounds = c.rounds.map((r) => r.map((m) => ({ ...m })));
      const match = rounds[roundIdx][matchIdx];
      if (side === "a" ? !match.a : !match.b) return c; // empty slot
      match.winner = match.winner === side ? null : side;
      recomputeBracket(rounds);
      return { ...c, rounds };
    });
  };

  const reset = () => setChampionship(null);

  const champion = championship ? championOf(championship.rounds) : null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-arena-orange/15 text-arena-orange">
          <Zap className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">CEFFLASH</h1>
          <p className="text-sm text-arena-muted">
            Crie um campeonato e gere o chaveamento das duplas automaticamente.
          </p>
        </div>
      </div>

      {!championship ? (
        /* ---------- Setup form ---------- */
        <div className="max-w-2xl space-y-6">
          <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium text-arena-ink">
              Nome do campeonato
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Copa CT VH de Verão"
              className="w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
            />
          </section>

          <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-arena-ink">
                Duplas ({pairs.filter((p) => p.trim()).length})
              </h2>
              <button
                type="button"
                onClick={shuffle}
                className="inline-flex items-center gap-1.5 rounded-md border border-arena-border px-3 py-1.5 text-xs font-semibold text-arena-ink transition-colors hover:border-arena-blue hover:text-arena-blue"
              >
                <Shuffle className="h-4 w-4" />
                Sortear ordem
              </button>
            </div>

            <div className="space-y-2">
              {pairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 text-center text-sm font-semibold text-arena-muted">
                    {i + 1}
                  </span>
                  <input
                    value={pair}
                    onChange={(e) => updatePair(i, e.target.value)}
                    placeholder={`Dupla ${i + 1}`}
                    className="flex-1 rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
                  />
                  <button
                    type="button"
                    onClick={() => removePair(i)}
                    disabled={pairs.length <= 2}
                    className="rounded-md p-2 text-arena-muted transition-colors hover:text-arena-red disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remover dupla"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPair}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-arena-blue transition-opacity hover:opacity-80"
            >
              <Plus className="h-4 w-4" />
              Adicionar dupla
            </button>
          </section>

          {error && <p className="text-sm font-medium text-arena-red">{error}</p>}

          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
          >
            <Trophy className="h-5 w-5" />
            Gerar chaveamento
          </button>
        </div>
      ) : (
        /* ---------- Bracket view ---------- */
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-arena-muted">
                Campeonato
              </p>
              <h2 className="text-xl font-bold text-arena-ink">
                {championship.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md border border-arena-border px-4 py-2 text-sm font-semibold text-arena-ink transition-colors hover:border-arena-blue hover:text-arena-blue"
            >
              <Pencil className="h-4 w-4" />
              Editar / Novo
            </button>
          </div>

          {champion && (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-arena-orange/40 bg-arena-orange/10 p-4">
              <Crown className="h-7 w-7 text-arena-orange" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-arena-orange">
                  Campeão
                </p>
                <p className="text-lg font-bold text-arena-ink">{champion}</p>
              </div>
            </div>
          )}

          <p className="mb-3 text-sm text-arena-muted">
            Clique na dupla vencedora de cada confronto para avançá-la.
          </p>

          <div className="overflow-x-auto pb-4">
            <div className="flex min-w-max gap-6">
              {championship.rounds.map((round, rIdx) => (
                <div
                  key={rIdx}
                  className="flex w-56 flex-shrink-0 flex-col justify-around gap-4"
                >
                  <h3 className="text-center text-xs font-bold uppercase tracking-wide text-arena-muted">
                    {roundLabel(round.length)}
                  </h3>
                  {round.map((match, mIdx) => (
                    <div
                      key={mIdx}
                      className="overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm"
                    >
                      {(["a", "b"] as const).map((side, sIdx) => {
                        const team = match[side];
                        const isWinner = match.winner === side;
                        const isBye = !team;
                        return (
                          <button
                            key={side}
                            type="button"
                            disabled={isBye}
                            onClick={() => pickWinner(rIdx, mIdx, side)}
                            className={cn(
                              "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                              sIdx === 0 && "border-b border-arena-border",
                              isWinner
                                ? "bg-arena-blue/15 font-semibold text-arena-ink"
                                : "text-arena-ink hover:bg-arena-bg",
                              isBye && "cursor-default text-arena-muted",
                            )}
                          >
                            <span className="truncate">
                              {team ?? "—"}
                            </span>
                            {isWinner && (
                              <Trophy className="ml-2 h-4 w-4 flex-shrink-0 text-arena-blue" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
