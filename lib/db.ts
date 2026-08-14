import { supabase } from "./supabase";

/**
 * Todas as conversas com o banco ficam aqui, agrupadas por assunto.
 *
 * As telas chamam funções com nome claro — `aulas.daSemana(inicio)` — em
 * vez de montarem consultas soltas. Assim, corrigir uma consulta é mexer
 * num lugar só, e não caçá-la em cinco arquivos.
 *
 * Toda função lança erro quando o banco recusa. Quem chama trata com
 * useDados/useSalvar, que mostram a mensagem na tela.
 */

/** Transforma o erro do Supabase em algo que dá para ler. */
function ok<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// =====================================================================
// ALUNOS  (tabela profiles)
// =====================================================================

export type Cargo = "admin" | "aluno";
export type SituacaoAluno = "Ativo" | "Inadimplente" | "Inativo";
export type Plano =
  | "Mensal"
  | "Trimestral"
  | "Semestral"
  | "Anual"
  | "Passe Livre"
  | "Avulso";

export interface Aluno {
  id: string;
  username: string;
  full_name: string;
  role: Cargo;
  turma: string;
  phone: string | null;
  contact_email: string | null;
  plan: Plano;
  aulas_semana: number;
  status: SituacaoAluno;
}

const CAMPOS_ALUNO =
  "id, username, full_name, role, turma, phone, contact_email, plan, aulas_semana, status";

export const alunos = {
  /** Todos, em ordem alfabética. O admin vê todos; o aluno, só a si mesmo. */
  async listar(): Promise<Aluno[]> {
    return ok(
      await supabase.from("profiles").select(CAMPOS_ALUNO).order("full_name"),
    );
  },

  async atualizar(id: string, mudancas: Partial<Aluno>): Promise<void> {
    ok(await supabase.from("profiles").update(mudancas).eq("id", id).select("id"));
  },

  /**
   * Os quatro contadores do topo da tela, numa consulta só.
   *
   * Como são apenas ~65 alunos, contar aqui sai mais barato do que
   * quatro consultas com count ao banco.
   */
  async contadores() {
    const lista = await alunos.listar();
    return {
      total: lista.length,
      ativos: lista.filter((a) => a.status === "Ativo").length,
      inadimplentes: lista.filter((a) => a.status === "Inadimplente").length,
      inativos: lista.filter((a) => a.status === "Inativo").length,
    };
  },
};

// =====================================================================
// TURMAS
// =====================================================================

export interface Turma {
  id: string;
  nome: string;
  ordem: number;
}

export const turmas = {
  async listar(): Promise<Turma[]> {
    return ok(
      await supabase.from("turmas").select("id, nome, ordem").order("ordem"),
    );
  },
};

// =====================================================================
// AULAS E LISTAS DE TREINO
// =====================================================================

export type Nivel = "Iniciante" | "Intermediário" | "Avançado";

export interface AlunoNaAula {
  id: string;
  profile_id: string | null;
  /** Preenchido quando a pessoa não tem cadastro (ex.: Matias). */
  nome_livre: string | null;
  confirmado: boolean;
  presente: boolean | null;
  observacao: string | null;
  /** Os dois nomes de uma dupla do Elite compartilham este valor. */
  dupla_id: string | null;
  /** Vem do join com profiles. */
  nome: string;
}

export interface Aula {
  id: string;
  nome: string;
  professor: string;
  nivel: Nivel;
  data: string; // yyyy-MM-dd
  hora: string; // HH:MM
  max_alunos: number;
  alunos: AlunoNaAula[];
}

/**
 * Linha crua do banco, antes de achatar o join.
 *
 * `profiles` vem como objeto quando a relação é 1:1, mas o tipo gerado
 * pelo supabase-js a descreve como lista. Aceitamos as duas formas e
 * normalizamos em `nomeDoPerfil`.
 */
type PerfilNoJoin = { full_name: string } | { full_name: string }[] | null;

interface LinhaAula {
  id: string;
  nome: string;
  professor: string;
  nivel: Nivel;
  data: string;
  hora: string;
  max_alunos: number;
  aula_alunos: Array<{
    id: string;
    profile_id: string | null;
    nome_livre: string | null;
    confirmado: boolean;
    presente: boolean | null;
    observacao: string | null;
    dupla_id: string | null;
    profiles: PerfilNoJoin;
  }>;
}

function nomeDoPerfil(p: PerfilNoJoin): string | null {
  if (!p) return null;
  return Array.isArray(p) ? (p[0]?.full_name ?? null) : p.full_name;
}

function montaAula(linha: LinhaAula): Aula {
  return {
    id: linha.id,
    nome: linha.nome,
    professor: linha.professor,
    nivel: linha.nivel,
    data: linha.data,
    hora: linha.hora.slice(0, 5), // "15:00:00" -> "15:00"
    max_alunos: linha.max_alunos,
    alunos: (linha.aula_alunos ?? [])
      .map((a) => ({
        id: a.id,
        profile_id: a.profile_id,
        nome_livre: a.nome_livre,
        confirmado: a.confirmado,
        presente: a.presente,
        observacao: a.observacao,
        dupla_id: a.dupla_id,
        nome: nomeDoPerfil(a.profiles) ?? a.nome_livre ?? "(sem nome)",
      }))
      .sort((x, y) => x.nome.localeCompare(y.nome)),
  };
}

export const aulas = {
  /**
   * As aulas de um intervalo, já com a lista de alunos de cada uma.
   *
   * Traz a semana inteira numa consulta só. Buscar aula por aula geraria
   * uma dezena de idas ao servidor a cada troca de semana.
   */
  async doPeriodo(inicioISO: string, fimISO: string): Promise<Aula[]> {
    const linhas = ok<LinhaAula[]>(
      await supabase
        .from("aulas")
        .select(
          `id, nome, professor, nivel, data, hora, max_alunos,
           aula_alunos ( id, profile_id, nome_livre, confirmado, presente,
                         observacao, dupla_id, profiles ( full_name ) )`,
        )
        .gte("data", inicioISO)
        .lte("data", fimISO)
        .order("data")
        .order("hora"),
    );
    return linhas.map(montaAula);
  },

  async criar(nova: {
    nome: string;
    professor: string;
    nivel: Nivel;
    data: string;
    hora: string;
    max_alunos: number;
  }): Promise<string> {
    const criada = ok<{ id: string }>(
      await supabase.from("aulas").insert(nova).select("id").single(),
    );
    return criada.id;
  },

  /** Apaga a aula e, junto, a lista dela (o banco cuida em cascata). */
  async apagar(id: string): Promise<void> {
    ok(await supabase.from("aulas").delete().eq("id", id).select("id"));
  },

  /**
   * Marca ou desmarca a confirmação de alguém.
   *
   * Recebe o id da LINHA, não o nome. O código antigo casava por nome
   * (`st.name === studentName`) e quebrava com "Ericky e Matias" ou
   * "Clarckson (1-8)", que não correspondem a aluno nenhum.
   */
  async confirmar(linhaId: string, confirmado: boolean): Promise<void> {
    ok(
      await supabase
        .from("aula_alunos")
        .update({ confirmado, marcado_em: new Date().toISOString() })
        .eq("id", linhaId)
        .select("id"),
    );
  },

  async adicionarAluno(
    aulaId: string,
    quem: { profile_id?: string; nome_livre?: string },
  ): Promise<void> {
    ok(
      await supabase
        .from("aula_alunos")
        .insert({
          aula_id: aulaId,
          profile_id: quem.profile_id ?? null,
          nome_livre: quem.nome_livre ?? null,
        })
        .select("id"),
    );
  },

  async removerAluno(linhaId: string): Promise<void> {
    ok(await supabase.from("aula_alunos").delete().eq("id", linhaId).select("id"));
  },
};

// =====================================================================
// GRADE SEMANAL FIXA
// =====================================================================

export interface ItemDaGrade {
  id: string;
  dia_semana: number; // 0 = domingo, igual ao getDay() do JavaScript
  hora: string;
  nome: string;
  nivel: Nivel;
  max_alunos: number;
  duplas: boolean;
  ativo: boolean;
}

export const grade = {
  async listar(): Promise<ItemDaGrade[]> {
    const linhas = ok<ItemDaGrade[]>(
      await supabase
        .from("grade_semanal")
        .select("id, dia_semana, hora, nome, nivel, max_alunos, duplas, ativo")
        .eq("ativo", true)
        .order("dia_semana")
        .order("hora"),
    );
    return linhas.map((g) => ({ ...g, hora: g.hora.slice(0, 5) }));
  },

  /**
   * Cria as aulas de uma semana a partir da grade fixa, pulando as que
   * já existem — assim o professor pode gerar de novo sem duplicar.
   * Devolve quantas foram criadas.
   */
  async gerarSemana(segundaISO: string): Promise<number> {
    const itens = await grade.listar();
    const segunda = new Date(`${segundaISO}T12:00:00`);

    const datas = itens.map((g) => {
      const d = new Date(segunda);
      // getDay(): 0=domingo. A semana começa na segunda (1).
      d.setDate(segunda.getDate() + ((g.dia_semana + 6) % 7));
      return d.toISOString().slice(0, 10);
    });

    const existentes = await aulas.doPeriodo(
      datas.reduce((a, b) => (a < b ? a : b)),
      datas.reduce((a, b) => (a > b ? a : b)),
    );
    const jaTem = new Set(existentes.map((a) => `${a.data}|${a.hora}|${a.nome}`));

    const criar = itens
      .map((g, i) => ({
        nome: g.nome,
        professor: "A definir",
        nivel: g.nivel,
        data: datas[i],
        hora: g.hora,
        max_alunos: g.max_alunos,
      }))
      .filter((a) => !jaTem.has(`${a.data}|${a.hora}|${a.nome}`));

    if (criar.length === 0) return 0;
    ok(await supabase.from("aulas").insert(criar).select("id"));
    return criar.length;
  },
};

// =====================================================================
// PAGAMENTOS
// =====================================================================

export type FormaPagamento =
  | "—"
  | "Pix"
  | "Dinheiro"
  | "Cartão"
  | "Transferência";

export interface Pagamento {
  id: string;
  profile_id: string;
  competencia: string; // primeiro dia do mês, yyyy-MM-01
  valor: number | null;
  metodo: FormaPagamento;
  dia_habitual: number | null;
  pago: boolean;
  pago_em: string | null;
}

export const pagamentos = {
  /** Os pagamentos de um mês, indexados por aluno. */
  async doMes(competencia: string): Promise<Map<string, Pagamento>> {
    const linhas = ok<Pagamento[]>(
      await supabase
        .from("pagamentos")
        .select("id, profile_id, competencia, valor, metodo, dia_habitual, pago, pago_em")
        .eq("competencia", competencia),
    );
    return new Map(linhas.map((p) => [p.profile_id, p]));
  },

  /**
   * Grava o pagamento do aluno naquele mês, criando a linha se ainda não
   * existir. Indexado por aluno e mês — o código antigo usava o NOME do
   * aluno como chave, então dois alunos homônimos se sobrescreviam.
   */
  async registrar(
    profileId: string,
    competencia: string,
    mudancas: Partial<Pick<Pagamento, "valor" | "metodo" | "dia_habitual" | "pago">>,
  ): Promise<void> {
    const linha: Record<string, unknown> = {
      profile_id: profileId,
      competencia,
      ...mudancas,
    };
    if (mudancas.pago !== undefined) {
      linha.pago_em = mudancas.pago ? new Date().toISOString() : null;
    }
    ok(
      await supabase
        .from("pagamentos")
        .upsert(linha, { onConflict: "profile_id,competencia" })
        .select("id"),
    );
  },
};

// =====================================================================
// CAMPEONATOS (CEFFLASH)
// =====================================================================

export interface Campeonato {
  id: string;
  nome: string;
  pairs_count: number;
  /** O Round[] de lib/bracket.ts, guardado como JSON. */
  rounds: unknown;
  created_at: string;
}

export const campeonatos = {
  async listar(): Promise<Campeonato[]> {
    return ok(
      await supabase
        .from("campeonatos")
        .select("id, nome, pairs_count, rounds, created_at")
        .order("created_at", { ascending: false }),
    );
  },

  async criar(nome: string, pairsCount: number, rounds: unknown): Promise<string> {
    const criado = ok<{ id: string }>(
      await supabase
        .from("campeonatos")
        .insert({ nome, pairs_count: pairsCount, rounds })
        .select("id")
        .single(),
    );
    return criado.id;
  },

  async salvarChaveamento(id: string, rounds: unknown): Promise<void> {
    ok(await supabase.from("campeonatos").update({ rounds }).eq("id", id).select("id"));
  },

  async apagar(id: string): Promise<void> {
    ok(await supabase.from("campeonatos").delete().eq("id", id).select("id"));
  },
};

// =====================================================================
// CONFIGURAÇÕES (linha única, id = 1)
// =====================================================================

export interface Config {
  arena_nome: string;
  abre: string;
  fecha: string;
  max_por_aula: number;
  notif_email: boolean;
  notif_whatsapp: boolean;
}

export const config = {
  async ler(): Promise<Config> {
    const c = ok<Config>(
      await supabase
        .from("config")
        .select("arena_nome, abre, fecha, max_por_aula, notif_email, notif_whatsapp")
        .eq("id", 1)
        .single(),
    );
    return { ...c, abre: c.abre.slice(0, 5), fecha: c.fecha.slice(0, 5) };
  },

  async salvar(mudancas: Partial<Config>): Promise<void> {
    ok(
      await supabase
        .from("config")
        .update({ ...mudancas, updated_at: new Date().toISOString() })
        .eq("id", 1)
        .select("id"),
    );
  },
};

// =====================================================================
// FEED
// =====================================================================

export interface PostDoFeed {
  id: string;
  url: string;
  ordem: number;
  visto: boolean;
}

export const feed = {
  /** Os posts, já sabendo quais este usuário ainda não viu. */
  async listar(profileId: string): Promise<PostDoFeed[]> {
    const posts = ok<Array<{ id: string; url: string; ordem: number }>>(
      await supabase.from("feed_posts").select("id, url, ordem").order("ordem"),
    );
    const vistos = ok<Array<{ post_id: string }>>(
      await supabase.from("feed_seen").select("post_id").eq("profile_id", profileId),
    );
    const jaViu = new Set(vistos.map((v) => v.post_id));
    return posts.map((p) => ({ ...p, visto: jaViu.has(p.id) }));
  },

  /**
   * Marca tudo como visto. Diferente do jeito antigo — que guardava no
   * navegador e sumia ao limpar o cache — isso acompanha o usuário entre
   * o celular e o computador.
   */
  async marcarTudoVisto(profileId: string, postIds: string[]): Promise<void> {
    if (postIds.length === 0) return;
    ok(
      await supabase
        .from("feed_seen")
        .upsert(
          postIds.map((post_id) => ({ profile_id: profileId, post_id })),
          { onConflict: "profile_id,post_id" },
        )
        .select("post_id"),
    );
  },
};
