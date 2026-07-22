"use client";

import { useState } from "react";
import { Save, Building2, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-arena-ink">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors focus:border-arena-blue";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-arena-blue" : "bg-arena-border",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [arenaName, setArenaName] = useState("CT VH");
  const [openTime, setOpenTime] = useState("06:00");
  const [closeTime, setCloseTime] = useState("22:00");
  const [maxPerClass, setMaxPerClass] = useState("12");
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-arena-muted">
          Ajuste os dados da arena e as preferências do sistema.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Dados da arena */}
        <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-arena-ink">
            <Building2 className="h-5 w-5 text-arena-blue" />
            Dados da Arena
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome da arena">
              <input
                className={inputClass}
                value={arenaName}
                onChange={(e) => setArenaName(e.target.value)}
              />
            </Field>
            <Field label="Máx. de alunos por aula">
              <input
                type="number"
                min={1}
                className={inputClass}
                value={maxPerClass}
                onChange={(e) => setMaxPerClass(e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Horário de funcionamento */}
        <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-arena-ink">
            <Clock className="h-5 w-5 text-arena-blue" />
            Horário de Funcionamento
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Abertura">
              <input
                type="time"
                className={inputClass}
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </Field>
            <Field label="Fechamento">
              <input
                type="time"
                className={inputClass}
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </Field>
          </div>
        </section>

        {/* Notificações */}
        <section className="rounded-lg border border-arena-border bg-arena-card p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-arena-ink">
            <Bell className="h-5 w-5 text-arena-blue" />
            Notificações
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-arena-ink">
                  Lembretes por e-mail
                </p>
                <p className="text-xs text-arena-muted">
                  Enviar avisos de aula e cobrança por e-mail.
                </p>
              </div>
              <Toggle checked={emailNotif} onChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-arena-ink">
                  Lembretes por WhatsApp
                </p>
                <p className="text-xs text-arena-muted">
                  Enviar confirmações e lembretes via WhatsApp.
                </p>
              </div>
              <Toggle checked={whatsappNotif} onChange={setWhatsappNotif} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
          >
            <Save className="h-5 w-5" />
            Salvar Alterações
          </button>
          {saved && (
            <span className="text-sm font-medium text-arena-green">
              Alterações salvas!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
