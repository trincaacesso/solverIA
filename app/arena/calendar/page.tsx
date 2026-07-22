"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Clock, User } from "lucide-react";
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

interface ClassData {
  id: string;
  name: string;
  professor: string;
  currentStudents: number;
  maxStudents: number;
  level: Level;
  date: string; // yyyy-MM-dd
  time: string; // HH:MM
}

// Mock classes anchored to the current week (offset from Monday).
function buildMockClasses(): ClassData[] {
  const monday = startOfWeek(new Date());
  const on = (offset: number) => toISODate(addDays(monday, offset));
  return [
    { id: "1", name: "Futevôlei Iniciante", professor: "João Silva", currentStudents: 5, maxStudents: 10, level: "Iniciante", date: on(0), time: "08:00" },
    { id: "2", name: "Futevôlei Intermediário", professor: "João Silva", currentStudents: 6, maxStudents: 12, level: "Intermediário", date: on(0), time: "19:00" },
    { id: "3", name: "Futevôlei Intermediário", professor: "Maria Souza", currentStudents: 8, maxStudents: 12, level: "Intermediário", date: on(1), time: "10:00" },
    { id: "4", name: "Futevôlei Avançado", professor: "Pedro Santos", currentStudents: 10, maxStudents: 10, level: "Avançado", date: on(2), time: "18:00" },
    { id: "5", name: "Futevôlei Iniciante", professor: "Ana Costa", currentStudents: 7, maxStudents: 10, level: "Iniciante", date: on(3), time: "09:00" },
    { id: "6", name: "Treino Livre", professor: "Pedro Santos", currentStudents: 4, maxStudents: 16, level: "Avançado", date: on(5), time: "16:00" },
  ];
}

const levelStyles: Record<Level, string> = {
  Iniciante: "border-arena-green bg-arena-green/10 text-arena-green",
  Intermediário: "border-arena-blue bg-arena-blue/10 text-arena-blue",
  Avançado: "border-arena-orange bg-arena-orange/10 text-arena-orange",
};

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(() => new Date());
  const classes = useMemo(() => buildMockClasses(), []);

  const weekStart = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
            Calendário de Aulas
          </h1>
          <p className="mt-1 text-sm text-arena-muted">
            Visualize e organize as aulas da semana.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95">
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
          const dayClasses = classes.filter((c) =>
            isSameDay(parseISODate(c.date), day),
          );
          const isToday = isSameDay(day, today);
          return (
            <div key={day.toISOString()} className="flex flex-col">
              <div
                className={cn(
                  "mb-2 rounded-md py-2 text-center",
                  isToday ? "bg-arena-blue text-white" : "text-arena-muted",
                )}
              >
                <span className="text-xs font-semibold">
                  {weekdayShort(day)}
                </span>
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
                    const full = cls.currentStudents >= cls.maxStudents;
                    return (
                      <div
                        key={cls.id}
                        className={cn(
                          "rounded-md border-l-4 p-2.5 text-xs shadow-sm transition-transform duration-150 hover:scale-[1.02]",
                          levelStyles[cls.level],
                        )}
                      >
                        <p className="font-semibold text-arena-ink">
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
                          {cls.currentStudents}/{cls.maxStudents} alunos
                          {full ? " · Lotada" : ""}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
