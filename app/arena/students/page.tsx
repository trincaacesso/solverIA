"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Pencil,
  X,
  Save,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { alunos, turmas, type Aluno, type Plano, type SituacaoAluno } from "@/lib/db";
import { useDados, useSalvar } from "@/lib/use-dados";
import {
  Carregando,
  Erro,
  ErroAoSalvar,
  Vazio,
} from "@/components/arena/estado-carga";
import { useAuth, RequireAdmin } from "@/components/arena/auth-context";

const PLANOS: Plano[] = [
  "Mensal",
  "Trimestral",
  "Semestral",
  "Anual",
  "Passe Livre",
  "Avulso",
];
const SITUACOES: SituacaoAluno[] = ["Ativo", "Inadimplente", "Inativo"];

const estiloSituacao: Record<SituacaoAluno, string> = {
  Ativo: "bg-arena-green/15 text-arena-green",
  Inadimplente: "bg-arena-orange/15 text-arena-orange",
  Inativo: "bg-arena-muted/15 text-arena-muted",
};

const inputClass =
  "w-full rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue";

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface Formulario {
  nome: string;
  telefone: string;
  email: string;
  plano: Plano;
  turma: string;
  aulas: string;
  situacao: SituacaoAluno;
}

const formularioVazio: Formulario = {
  nome: "",
  telefone: "",
  email: "",
  plano: "Mensal",
  turma: "—",
  aulas: "2",
  situacao: "Ativo",
};

function StudentsPageContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    dados: lista,
    carregando,
    erro,
    recarregar,
  } = useDados(() => alunos.listar(), []);

  // As turmas vêm do banco para o menu não descolar do que existe de
  // verdade — o código antigo tinha uma lista fixa que já estava
  // desatualizada (faltava Feminino Iniciante, por exemplo).
  const { dados: listaTurmas } = useDados(() => turmas.listar(), []);

  const { salvar, salvando, erro: erroSalvar, setErro } = useSalvar();

  const [busca, setBusca] = useState("");
  // null = fechado, "novo" = cadastro, senão o id em edição
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<Formulario>(formularioVazio);
  const [credenciais, setCredenciais] = useState<{
    username: string;
    senha: string;
    nome: string;
  } | null>(null);

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!lista) return [];
    if (!q) return lista;
    return lista.filter((a) => a.full_name.toLowerCase().includes(q));
  }, [lista, busca]);

  const numeros = useMemo(() => {
    const l = lista ?? [];
    return [
      { label: "Total de Alunos", value: l.length },
      { label: "Ativos", value: l.filter((a) => a.status === "Ativo").length },
      {
        label: "Inadimplentes",
        value: l.filter((a) => a.status === "Inadimplente").length,
      },
      { label: "Inativos", value: l.filter((a) => a.status === "Inativo").length },
    ];
  }, [lista]);

  const abrirNovo = () => {
    setForm(formularioVazio);
    setErro(null);
    setCredenciais(null);
    setEditando("novo");
  };

  const abrirEdicao = (a: Aluno) => {
    setForm({
      nome: a.full_name,
      telefone: a.phone ?? "",
      email: a.contact_email ?? "",
      plano: a.plan,
      turma: a.turma ?? "—",
      aulas: String(a.aulas_semana ?? 2),
      situacao: a.status,
    });
    setErro(null);
    setCredenciais(null);
    setEditando(a.id);
  };

  const gravar = async () => {
    const nome = form.nome.trim();
    if (!nome) {
      setErro("Informe o nome do aluno.");
      return;
    }

    const campos = {
      full_name: nome,
      phone: form.telefone.trim() || null,
      contact_email: form.email.trim() || null,
      plan: form.plano,
      turma: form.turma,
      aulas_semana: Math.max(0, parseInt(form.aulas, 10) || 0),
      status: form.situacao,
    };

    if (editando === "novo") {
      let novo: { username: string; senha: string } | null = null;
      const deuCerto = await salvar(async () => {
        novo = await alunos.criar({
          full_name: nome,
          turma: form.turma,
          phone: campos.phone ?? undefined,
          contact_email: campos.contact_email ?? undefined,
          plan: form.plano,
          aulas_semana: campos.aulas_semana,
          status: form.situacao,
        });
      });
      if (deuCerto && novo) {
        // Mantém o modal aberto mostrando o acesso: é a única vez em que
        // a senha aparece, e o professor precisa anotá-la para o aluno.
        setCredenciais({ ...(novo as { username: string; senha: string }), nome });
        await recarregar();
      }
      return;
    }

    const deuCerto = await salvar(() => alunos.atualizar(editando!, campos));
    if (deuCerto) {
      setEditando(null);
      await recarregar();
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">
            Gestão de Alunos
          </h1>
          <p className="mt-1 text-sm text-arena-muted">
            Acompanhe matrículas, planos e status dos alunos.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
          >
            <UserPlus className="h-5 w-5" />
            Novo Aluno
          </button>
        )}
      </div>

      {/* Números */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {numeros.map((n) => (
          <div
            key={n.label}
            className="rounded-lg border border-arena-border bg-arena-card p-4 shadow-sm"
          >
            <p className="text-sm text-arena-muted">{n.label}</p>
            <p className="mt-1 text-2xl font-bold text-arena-ink">
              {carregando ? "—" : n.value}
            </p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena-muted" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar aluno pelo nome..."
          className="w-full rounded-md border border-arena-border bg-arena-card py-2 pl-9 pr-3 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
        />
      </div>

      {erro && <Erro mensagem={erro} aoTentarDeNovo={recarregar} className="mb-4" />}

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-arena-border bg-arena-card shadow-sm">
        {carregando ? (
          <Carregando texto="Buscando os alunos..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-arena-border bg-arena-bg text-xs uppercase tracking-wide text-arena-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Aluno</th>
                  <th className="px-4 py-3 font-semibold">Contato</th>
                  <th className="px-4 py-3 font-semibold">Plano</th>
                  <th className="px-4 py-3 font-semibold">Turma</th>
                  <th className="px-4 py-3 font-semibold">Aulas</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  {isAdmin && <th className="px-4 py-3 font-semibold">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-arena-border">
                {filtrados.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-arena-bg">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena-blue/10 text-xs font-semibold text-arena-blue">
                          {iniciais(a.full_name)}
                        </span>
                        <div>
                          <span className="font-medium text-arena-ink">
                            {a.full_name}
                          </span>
                          <p className="text-xs text-arena-muted">
                            login: {a.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {a.phone || a.contact_email ? (
                        <>
                          {a.phone && (
                            <p className="flex items-center gap-1.5 text-arena-muted">
                              <Phone className="h-3.5 w-3.5" /> {a.phone}
                            </p>
                          )}
                          {a.contact_email && (
                            <p className="flex items-center gap-1.5 text-arena-muted">
                              <Mail className="h-3.5 w-3.5" /> {a.contact_email}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-arena-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-arena-ink">{a.plan}</td>
                    <td className="px-4 py-3 text-arena-ink">{a.turma}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-arena-blue/10 px-2.5 py-0.5 text-xs font-semibold text-arena-blue">
                        {a.aulas_semana}x/semana
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          estiloSituacao[a.status],
                        )}
                      >
                        {a.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => abrirEdicao(a)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-arena-border px-2.5 py-1.5 text-xs font-semibold text-arena-ink transition-colors hover:border-arena-blue hover:text-arena-blue"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {filtrados.length === 0 && !erro && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6}>
                      <Vazio
                        texto={
                          busca
                            ? `Nenhum aluno com "${busca}".`
                            : "Nenhum aluno cadastrado ainda."
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cadastro / edição */}
      {isAdmin && editando !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setEditando(null)}
          />
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-arena-border bg-arena-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-arena-ink">
                {editando === "novo" ? "Novo Aluno" : "Editar Aluno"}
              </h2>
              <button
                onClick={() => setEditando(null)}
                className="rounded-md p-1.5 text-arena-muted hover:bg-arena-bg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {credenciais ? (
              // Depois de cadastrar: mostra o acesso. A senha só aparece
              // aqui, uma vez — o banco guarda embaralhada e nem eu
              // consigo recuperá-la depois.
              <div>
                <div className="rounded-lg border border-arena-green/30 bg-arena-green/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-arena-ink">
                    <KeyRound className="h-4 w-4 text-arena-green" />
                    {credenciais.nome} cadastrado
                  </p>
                  <p className="mt-3 text-xs text-arena-muted">
                    Entregue este acesso ao aluno:
                  </p>
                  <div className="mt-2 space-y-1 rounded-md bg-arena-card px-3 py-2 font-mono text-sm text-arena-ink">
                    <p>login: {credenciais.username}</p>
                    <p>senha: {credenciais.senha}</p>
                  </div>
                  <p className="mt-3 text-xs text-arena-muted">
                    Anote agora: por segurança, a senha não pode ser vista
                    de novo depois que esta janela fechar.
                  </p>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={abrirNovo}
                    className="rounded-md border border-arena-border px-4 py-2 text-sm font-semibold text-arena-ink transition-colors hover:bg-arena-bg"
                  >
                    Cadastrar outro
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="rounded-md bg-arena-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arena-blue-dark"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-arena-ink">
                      Nome
                    </label>
                    <input
                      autoFocus
                      className={inputClass}
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      placeholder="Nome do aluno"
                    />
                    {editando === "novo" && (
                      <p className="mt-1 text-xs text-arena-muted">
                        O login e a senha são gerados a partir do nome.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        Telefone
                      </label>
                      <input
                        className={inputClass}
                        value={form.telefone}
                        onChange={(e) =>
                          setForm({ ...form, telefone: e.target.value })
                        }
                        placeholder="(31) 90000-0000"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="aluno@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        Plano
                      </label>
                      <select
                        className={inputClass}
                        value={form.plano}
                        onChange={(e) =>
                          setForm({ ...form, plano: e.target.value as Plano })
                        }
                      >
                        {PLANOS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        Turma
                      </label>
                      <select
                        className={inputClass}
                        value={form.turma}
                        onChange={(e) =>
                          setForm({ ...form, turma: e.target.value })
                        }
                      >
                        {(listaTurmas ?? []).map((t) => (
                          <option key={t.id} value={t.nome}>
                            {t.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        Aulas por semana
                      </label>
                      <input
                        type="number"
                        min={0}
                        className={inputClass}
                        value={form.aulas}
                        onChange={(e) =>
                          setForm({ ...form, aulas: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-arena-ink">
                        Status
                      </label>
                      <select
                        className={inputClass}
                        value={form.situacao}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            situacao: e.target.value as SituacaoAluno,
                          })
                        }
                      >
                        {SITUACOES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {erroSalvar && <ErroAoSalvar mensagem={erroSalvar} />}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => setEditando(null)}
                    disabled={salvando}
                    className="rounded-md border border-arena-border px-4 py-2 text-sm font-semibold text-arena-ink transition-colors hover:bg-arena-bg disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={gravar}
                    disabled={salvando}
                    className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-arena-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {salvando ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Bloqueia o acesso por URL direta: sem isso um aluno abre /arena/students
// e vê a tela. Isto é só conveniência de interface — quem realmente
// protege os dados são as policies de RLS no banco.
export default function StudentsPage() {
  return (
    <RequireAdmin>
      <StudentsPageContent />
    </RequireAdmin>
  );
}
