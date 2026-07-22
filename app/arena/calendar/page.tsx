"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  User,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  addDays,
  startOfWeek,
  isSameDay,
  toISODate,
  parseISODate,
  weekdayShort,
  dayOfMonth,
  longDate,
} from "@/lib/arena-date";
import { cn } from "@/lib/utils";

type Level = "Iniciante" | "Intermediário" | "Avançado";

interface Student {
  name: string;
  confirmed: boolean;
}

interface ClassData {
  id: string;
  name: string;
  professor: string;
  students: Student[];
  maxStudents: number;
  level: Level;
  date: string; // yyyy-MM-dd
  time: string; // HH:MM
}

const LEVELS: Level[] = ["Iniciante", "Intermediário", "Avançado"];

// s("Nome") = pendente ⏳ · s("Nome", true) = confirmado ✅
const s = (name: string, confirmed = false): Student => ({ name, confirmed });

// Listas de treino da semana de 20/07 a 22/07.
function buildClasses(): ClassData[] {
  return [
    // ── Segunda-feira (20/07) ──
    { id: "seg-15", name: "Iniciante", professor: "A definir", level: "Iniciante", date: "2026-07-20", time: "15:00", maxStudents: 8, students: [s("Caixa", true), s("Brendon"), s("Pedro Dias", true), s("Enzo Neves", true), s("Gustavo Santos", true)] },
    { id: "seg-16", name: "Aprendiz", professor: "A definir", level: "Intermediário", date: "2026-07-20", time: "16:00", maxStudents: 8, students: [s("Pedro", true), s("Livia", true), s("Lara", true)] },
    { id: "seg-17", name: "Feminino Avançado", professor: "A definir", level: "Avançado", date: "2026-07-20", time: "17:00", maxStudents: 8, students: [s("Mariana", true), s("Francielle", true), s("Camila Rodrigues", true), s("Yasmin", true)] },
    { id: "seg-18", name: "Iniciante", professor: "A definir", level: "Iniciante", date: "2026-07-20", time: "18:00", maxStudents: 8, students: [s("Karla", true), s("Anna Júlia", true), s("Aline", true), s("Clarckson (3-8)", true)] },
    { id: "seg-19", name: "Elite B", professor: "A definir", level: "Avançado", date: "2026-07-20", time: "19:00", maxStudents: 8, students: [s("Victor", true), s("Enzo Felipe (6-8)", true), s("Ericky", true), s("Bernardo"), s("Silva", true), s("Kaká", true), s("Léo")] },
    { id: "seg-20", name: "Misto Aprendiz", professor: "A definir", level: "Intermediário", date: "2026-07-20", time: "20:00", maxStudents: 8, students: [s("Hugo (4-8)"), s("Cindya (4-8)"), s("Eduarda", true), s("Jotinha", true), s("Ana Beatriz (3-8)", true), s("Ruivadas", true)] },
    // ── Terça-feira (21/07) ──
    { id: "ter-16", name: "Livre para Personal", professor: "A definir", level: "Intermediário", date: "2026-07-21", time: "16:00", maxStudents: 8, students: [] },
    { id: "ter-17", name: "Iniciante", professor: "A definir", level: "Iniciante", date: "2026-07-21", time: "17:00", maxStudents: 8, students: [] },
    { id: "ter-18", name: "Iniciante Misto", professor: "A definir", level: "Iniciante", date: "2026-07-21", time: "18:00", maxStudents: 8, students: [s("Amanda"), s("Nicolas"), s("Ana Clara"), s("Ana Luisa"), s("Gustavo Rodrigues")] },
    { id: "ter-19", name: "Pré-Elite", professor: "A definir", level: "Avançado", date: "2026-07-21", time: "19:00", maxStudents: 8, students: [s("Pedro Dias"), s("Nicolas"), s("Daniel Baia"), s("Enzo Neves"), s("Acácio"), s("Gui Souza")] },
    { id: "ter-20", name: "Aprendiz Misto", professor: "A definir", level: "Intermediário", date: "2026-07-21", time: "20:00", maxStudents: 8, students: [s("Yasmin S."), s("Ruivadas"), s("Gui Almeida"), s("Jotinha"), s("Duda")] },
    // ── Quarta-feira (22/07) ──
    { id: "qua-15", name: "Iniciante", professor: "A definir", level: "Iniciante", date: "2026-07-22", time: "15:00", maxStudents: 8, students: [s("Caixa"), s("Pedro Dias"), s("Gui Souza"), s("Enzo Neves", true)] },
    { id: "qua-16", name: "Aprendiz", professor: "A definir", level: "Intermediário", date: "2026-07-22", time: "16:00", maxStudents: 8, students: [s("Pedro Mafra", true), s("Lívia"), s("Lara")] },
    { id: "qua-17", name: "Feminino Avançado", professor: "A definir", level: "Avançado", date: "2026-07-22", time: "17:00", maxStudents: 8, students: [s("Mariana", true), s("Francielle"), s("Camila Rodrigues"), s("Yasmin")] },
    { id: "qua-18", name: "Iniciante", professor: "A definir", level: "Iniciante", date: "2026-07-22", time: "18:00", maxStudents: 8, students: [s("Nicolas Taylor"), s("Aline", true), s("Clarckson"), s("Gustavin", true)] },
    { id: "qua-19", name: "Elite B (duplas)", professor: "A definir", level: "Avançado", date: "2026-07-22", time: "19:00", maxStudents: 4, students: [s("Ericky e Biel"), s("Enzo Felipe e David Silva"), s("Bernardo e Kauã Martins"), s("Victor e Vini", true)] },
    { id: "qua-20", name: "Feminino", professor: "A definir", level: "Intermediário", date: "2026-07-22", time: "20:00", maxStudents: 8, students: [s("Luanda"), s("Cecília"), s("Rafa"), s("Karla")] },
  ];
}

const levelStyles: Record<Level, string> = {
  Iniciante: "border-arena-green bg-arena-green/10",
  Intermediário: "border-arena-blue bg-arena-blue/10",
  Avançado: "border-arena-orange bg-arena-orange/10",
};

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue";

interface NewClassForm {
  name: string;
  professor: string;
  level: Level;
  date: string;
  time: string;
  maxStudents: string;
}

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(() => new Date());
  const [classes, setClasses] = useState<ClassData[]>(() => buildClasses());
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<ClassData | null>(null);
  const [nextId, setNextId] = useState(100);

  const weekStart = startOfWeek(anchor);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );
  const today = new Date();

  const emptyForm: NewClassForm = {
    name: "",
    professor: "",
    level: "Iniciante",
    date: toISODate(weekStart),
    time: "08:00",
    maxStudents: "10",
  };
  const [form, setForm] = useState<NewClassForm>(emptyForm);
  const [error, setError] = useState("");

  const openForm = () => {
    setForm({ ...emptyForm, date: toISODate(weekStart) });
    setError("");
    setShowForm(true);
  };

  const addClass = () => {
    if (!form.name.trim() || !form.professor.trim()) {
      setError("Preencha o nome da aula e o professor.");
      return;
    }
    const max = Math.max(1, parseInt(form.maxStudents, 10) || 1);
    setClasses((prev) => [
      ...prev,
      {
        id: String(nextId),
        name: form.name.trim(),
        professor: form.professor.trim(),
        level: form.level,
        date: form.date,
        time: form.time,
        students: [],
        maxStudents: max,
      },
    ]);
    setNextId((n) => n + 1);
    setShowForm(false);
  };

  const removeClass = (id: string) =>
    setClasses((prev) => prev.filter((c) => c.id !== id));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
            Calendário de Aulas
          </h1>
          <p className="mt-1 text-sm text-arena-muted">
            Clique em uma aula para ver a lista de alunos. Use “Nova Aula” para
            adicionar e passe o mouse sobre uma aula para removê-la.
          </p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
        >
          <PlusCircle className="h-5 w-5" />
          Nova Aula
        </button>
      </div>

      {/* Week navigation */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-arena-border bg-arena-card px-4 py-3 shadow-sm">
        <button
          onClick={() => setAnchor(addDays(anchor, -7))}
          className="rounded-md p-2 text-arena-muted transition-transform duration-200 hover:scale-110 hover:text-arena-blue active:scale-95"
          aria-label="Semana anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="text-center text-sm font-semibold text-arena-ink sm:text-base">
          {longDate(weekStart)} — {longDate(addDays(weekStart, 6))}
        </p>
        <button
          onClick={() => setAnchor(addDays(anchor, 7))}
          className="rounded-md p-2 text-arena-muted transition-transform duration-200 hover:scale-110 hover:text-arena-blue active:scale-95"
          aria-label="Próxima semana"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((day) => {
          const dayClasses = classes
            .filter((c) => isSameDay(parseISODate(c.date), day))
            .sort((a, b) => a.time.localeCompare(b.time));
          const isToday = isSameDay(day, today);
          return (
            <div key={day.toISOString()} className="flex flex-col">
              <div
                className={cn(
                  "mb-2 rounded-md py-2 text-center",
                  isToday ? "bg-arena-blue text-white" : "text-arena-muted",
                )}
              >
                <span className="text-xs font-semibold">{weekdayShort(day)}</span>
                <span
                  className={cn(
                    "block text-lg font-bold",
                    isToday ? "text-white" : "text-arena-ink",
                  )}
                >
                  {dayOfMonth(day)}
                </span>
              </div>
              <div className="flex-1 space-y-2 rounded-lg border border-arena-border bg-arena-card p-2 shadow-sm transition-shadow duration-200 hover:shadow-md lg:min-h-[220px]">
                {dayClasses.length === 0 ? (
                  <p className="py-6 text-center text-xs text-arena-muted">
                    Sem aulas
                  </p>
                ) : (
                  dayClasses.map((cls) => {
                    const count = cls.students.length;
                    const confirmed = cls.students.filter(
                      (st) => st.confirmed,
                    ).length;
                    const full = count >= cls.maxStudents;
                    return (
                      <div
                        key={cls.id}
                        onClick={() => setSelected(cls)}
                        className={cn(
                          "group relative cursor-pointer rounded-md border-l-4 p-2.5 text-xs shadow-sm transition-transform duration-150 hover:scale-[1.02]",
                          levelStyles[cls.level],
                        )}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeClass(cls.id);
                          }}
                          className="absolute right-1.5 top-1.5 rounded p-0.5 text-arena-muted opacity-0 transition-opacity hover:bg-arena-red/20 hover:text-arena-red group-hover:opacity-100"
                          aria-label="Remover aula"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <p className="pr-4 font-semibold text-arena-ink">
                          {cls.name}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-arena-muted">
                          <Clock className="h-3 w-3" /> {cls.time}
                        </p>
                        <p className="flex items-center gap-1 text-arena-muted">
                          <User className="h-3 w-3" /> {cls.professor}
                        </p>
                        <p
                          className={cn(
                            "mt-1 font-medium",
                            full ? "text-arena-red" : "text-arena-green",
                          )}
                        >
                          {count}/{cls.maxStudents} alunos
                          {full ? " · Lotada" : ""}
                        </p>
                        {count > 0 && (
                          <p className="flex items-center gap-1 text-arena-muted">
                            <CheckCircle2 className="h-3 w-3 text-arena-green" />
                            {confirmed}/{count} confirmados
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Class detail modal — student list */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-arena-border bg-arena-card p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-arena-ink">
                  {selected.name}
                </h2>
                <p className="mt-0.5 text-sm text-arena-muted">
                  {longDate(parseISODate(selected.date))} · {selected.time}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-1.5 text-arena-muted hover:bg-arena-bg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-arena-ink">
              <Users className="h-4 w-4 text-arena-blue" />
              Lista do treino ({selected.students.length}/{selected.maxStudents})
            </p>
            {selected.students.length === 0 ? (
              <p className="rounded-md border border-dashed border-arena-border py-6 text-center text-sm text-arena-muted">
                Nenhum aluno na lista
              </p>
            ) : (
              <ul className="max-h-72 space-y-1.5 overflow-y-auto">
                {selected.students.map((st) => (
                  <li
                    key={st.name}
                    className="flex items-center justify-between rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm"
                  >
                    <span className="text-arena-ink">{st.name}</span>
                    {st.confirmed ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-arena-green">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirmado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-arena-muted">
                        <Clock className="h-3.5 w-3.5" /> Pendente
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* New class modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-md rounded-xl border border-arena-border bg-arena-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-arena-ink">Nova Aula</h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md p-1.5 text-arena-muted hover:bg-arena-bg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-arena-ink">
                  Nome da aula
                </label>
                <input
                  autoFocus
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex.: Futevôlei Iniciante"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-arena-ink">
                  Professor
                </label>
                <input
                  className={inputClass}
                  value={form.professor}
                  onChange={(e) =>
                    setForm({ ...form, professor: e.target.value })
                  }
                  placeholder="Ex.: João Silva"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Data
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Horário
                  </label>
                  <input
                    type="time"
                    className={inputClass}
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Nível
                  </label>
                  <select
                    className={inputClass}
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value as Level })
                    }
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-arena-ink">
                    Vagas
                  </label>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={form.maxStudents}
                    onChange={(e) =>
                      setForm({ ...form, maxStudents: e.target.value })
                    }
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-arena-red">{error}</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md border border-arena-border px-4 py-2 text-sm font-semibold text-arena-ink transition-colors hover:bg-arena-bg"
              >
                Cancelar
              </button>
              <button
                onClick={addClass}
                className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arena-blue-dark"
              >
                <PlusCircle className="h-4 w-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
