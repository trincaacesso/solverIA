/**
 * Importa as listas reais de treino do WhatsApp para o banco.
 *
 *   node scripts/importar-listas.mjs --dry-run   ver o que vai acontecer
 *   node scripts/importar-listas.mjs             importar de verdade
 *   node scripts/importar-listas.mjs --semana 2026-08-17   outra semana
 *
 * PRECISA que o 0005_grade_semanal.sql já tenha sido aplicado.
 *
 * O que faz:
 *   1. cria conta para quem treina mas ainda não tem cadastro
 *   2. cria as 19 aulas da semana
 *   3. monta a lista de cada aula, com quem confirmou
 *   4. imprime um relatório de como cada apelido foi resolvido
 *
 * Rodar de novo APAGA as aulas dessa semana e refaz — então é seguro
 * repetir se algo sair errado.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const DRY = process.argv.includes("--dry-run");
const argSemana = process.argv.indexOf("--semana");
const SEMANA = argSemana > -1 ? process.argv[argSemana + 1] : null;

// ── as listas, exatamente como vieram do WhatsApp ─────────────────────
// "*" no fim = confirmou (o ✅ da lista)
// "(...)" = observação do professor, não faz parte do nome
// ["A", "B"] = dupla do Elite
const LISTAS = {
  1: [ // segunda
    { hora: "15:00", nome: "Iniciante", alunos: ["Caixa*", "Brendon", "Dias*"] },
    { hora: "16:00", nome: "Aprendiz", alunos: ["Pedro Mafra*", "Daniel Lages*", "Lívia", "Lara*"] },
    { hora: "17:00", nome: "Feminino Avançado", alunos: ["Andressa*", "Yasmin*", "Camila Rodrigues*", "Francielle*", "Mari*", "Cecília*"] },
    { hora: "18:00", nome: "Feminino Iniciante", alunos: ["Ana Julia*", "Ana Clara", "Alice*", "Karla*", "Yasmin Silva*", "Vitória*"] },
    { hora: "19:00", nome: "Elite", duplas: [["Enzo Felipe*", "Vinicius*"], ["Victor*", "David Silva*"], ["Kauã Martins*", "Yago*"], ["Ericky*", "Matias"]] },
    { hora: "20:00", nome: "Aprendiz", alunos: ["Bia Viana*", "Jota*", "Ruivo*", "Clarkson", "Nicolas*", "Breno*", "Kaio*"] },
  ],
  2: [ // terça
    { hora: "17:00", nome: "Iniciante", alunos: ["Pedro Mafra*", "Brendon*", "Leandro", "Lages*"] },
    { hora: "18:30", nome: "Pré-Elite", alunos: ["Enzo Neves*", "Maxcell*", "Gustavo Santos*", "Pedro Henrique*", "Daniel Baia*", "João Almir*", "Acácio*", "Gui*", "Nicolau*", "Ericky*"] },
    { hora: "20:00", nome: "Aprendiz", alunos: ["Lucas* (2-8)", "Jota*", "Ruivo*", "Amanda*", "Breno*", "Kaio*", "Ana Clara*", "Ana Luísa*"] },
  ],
  3: [ // quarta
    { hora: "15:00", nome: "Iniciante", alunos: ["Caixa*", "Brendon*", "Gustavo*", "Gui*"] },
    { hora: "16:00", nome: "Aprendiz", alunos: ["Pedro*", "Lívia", "Lara", "Daniel Lages"] },
    { hora: "17:00", nome: "Feminino Avançado", alunos: ["Camila*", "Andressa*", "Mariana*", "Yasmin*", "Cecília*"] },
    { hora: "18:00", nome: "Feminino Iniciante", alunos: ["Alice*", "Yasmin Silva* (gym)", "Vitória*", "Karla* (gym)"] },
    { hora: "19:00", nome: "Elite", duplas: [["Vinícius Lacerda*", "Victor*"], ["Yago", "Kauã Martins*"], ["Ericky*", "Gerson* (gym)"], ["Enzo Felipe* (gym)", "KG*"]] },
    { hora: "20:00", nome: "Aprendiz", alunos: ["Rafa*", "Luanda*", "Bia*", "Nicolas*", "Lucas* (gym)"] },
  ],
  4: [ // quinta
    { hora: "17:00", nome: "Iniciante", alunos: ["Pedro*", "Leandro", "Daniel Lage*"] },
    { hora: "18:00", nome: "Aprendiz", alunos: ["Ana Clara", "Nicolas*", "Clarckson*", "Guilherme*"] },
    { hora: "19:00", nome: "Pré-Elite", alunos: ["Gustavo*", "Gui*", "João Almir*", "Acácio*", "Enzo*", "Phillipe*", "Daniel Baia*"] },
    { hora: "20:00", nome: "Aprendiz", alunos: ["Hugo*", "Breno*"] },
  ],
};

/**
 * Como cada apelido do WhatsApp vira um aluno do cadastro.
 * O valor é o nome completo em `profiles.full_name`.
 *
 * Os ambíguos foram decididos assim:
 *   Pedro       -> Pedro Dias      (há 3 Pedros; Dias é o mais citado)
 *   Enzo        -> Enzo Neves      (aparece no Pré-Elite, a turma dele)
 *   Gui         -> Guilherme Almeida
 *   Guilherme   -> Guilherme Pereira
 *   Gustavo     -> Gustavo Santos
 *   Bia         -> Bia Viana       (pessoa nova, não a Ana Beatriz)
 */
const APELIDOS = {
  "caixa": "Gabriel Avelino (Caixa)",
  "dias": "Pedro Dias",
  "pedro": "Pedro Dias",
  "mari": "Mariana Fagundes",
  "mariana": "Mariana Fagundes",
  "ana julia": "Anna Julia",
  "jota": "Jotinha",
  "clarkson": "Clarckson Marques",
  "clarckson": "Clarckson Marques",
  "lages": "Daniel Lages",
  "daniel lage": "Daniel Lages",
  "daniel baia": "Daniel Silva Baia",
  "phillipe": "Phillip Maximo",
  "enzo": "Enzo Neves",
  "gustavo": "Gustavo Santos",
  "bia": "Bia Viana",
  "livia": "Livia Eduarda",
  "cecilia": "Cecilia Gramschelli",
  "andressa": "Andressa Gomes",
  "camila": "Camila Rodrigues",
  "yasmin": "Yasmin Lawrence",
  "karla": "Karla Thais",
  "lara": "Lara Grazielle",
  "amanda": "Amanda Pereira",
  "ana luisa": "Ana Luisa",
  "vinicius": "Vinicius Lacerda",
  "vinicius lacerda": "Vinicius Lacerda",
  "victor": "Victor Gabriel",
  "nicolas": "Nicolas Taylor",
  "hugo": "Hugo Oliveira",
  "gui": "Guilherme Almeida",
  "guilherme": "Guilherme Pereira",
  "acacio": "Acacio",
  "kaua martins": "Kauã Martins",
};

/** Treina, mas não vai ter login (decisão do professor). */
const SEM_CONTA = ["Matias"];

/** Em que turma cada aluno novo entra, pela aula em que aparece. */
const TURMA_DOS_NOVOS = {
  "Pedro Mafra": "Aprendiz", "Alice": "Feminino Iniciante",
  "Vitória": "Feminino Iniciante", "Yago": "Elite", "Bia Viana": "Aprendiz",
  "Breno": "Aprendiz", "Kaio": "Aprendiz", "Leandro": "Iniciante",
  "Maxcell": "Pré-Elite", "Gustavo Santos": "Pré-Elite",
  "João Almir": "Pré-Elite", "Nicolau": "Pré-Elite", "Lucas": "Aprendiz",
  "Gerson": "Elite", "KG": "Elite", "Rafa": "Aprendiz", "Luanda": "Aprendiz",
};

const norm = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** "Lucas* (2-8)" -> { nome:"Lucas", confirmado:true, obs:"2-8" } */
function analisa(entrada) {
  let t = entrada.trim();
  const confirmado = t.includes("*");
  t = t.replace(/\*/g, "").trim();

  let obs = null;
  const paren = t.match(/\(([^)]*)\)\s*$/);
  // "Gabriel Avelino (Caixa)" não é observação — é parte do nome no
  // cadastro. Só tratamos como observação o que vem depois de um nome
  // que já termina, e o mapa de apelidos resolve o resto.
  if (paren) {
    obs = paren[1].trim();
    t = t.replace(/\(([^)]*)\)\s*$/, "").trim();
  }
  return { nome: t, confirmado, obs };
}

// ── começa ───────────────────────────────────────────────────────────
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !chave) {
  console.error("❌ Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(url, chave, { auth: { persistSession: false } });

// a grade precisa existir
const { data: grade, error: erroGrade } = await db.from("grade_semanal").select("*");
if (erroGrade) {
  console.error("❌ A tabela grade_semanal não existe.");
  console.error("   Rode antes: supabase/migrations/0005_grade_semanal.sql");
  process.exit(1);
}

// cadastro atual
const { data: perfis } = await db.from("profiles").select("id, username, full_name, turma");
const porNome = new Map(perfis.map((p) => [norm(p.full_name), p]));
const porPrimeiro = new Map();
for (const p of perfis) {
  const primeiro = norm(p.full_name).split(" ")[0];
  if (!porPrimeiro.has(primeiro)) porPrimeiro.set(primeiro, p);
}

/** Resolve um nome da lista para um aluno do cadastro. */
function resolve(nome) {
  const k = norm(nome);
  const viaApelido = APELIDOS[k];
  if (viaApelido) {
    const p = porNome.get(norm(viaApelido));
    if (p) return { perfil: p, via: `apelido -> ${viaApelido}` };
  }
  const exato = porNome.get(k);
  if (exato) return { perfil: exato, via: "nome completo" };

  const comeca = perfis.find((p) => norm(p.full_name).startsWith(k + " "));
  if (comeca) return { perfil: comeca, via: `prefixo -> ${comeca.full_name}` };

  const primeiro = porPrimeiro.get(k);
  if (primeiro) return { perfil: primeiro, via: `primeiro nome -> ${primeiro.full_name}` };

  return { perfil: null, via: null };
}

// ── 1. quem ainda não tem cadastro ───────────────────────────────────
const todosOsNomes = new Set();
for (const dia of Object.values(LISTAS)) {
  for (const aula of dia) {
    const entradas = aula.duplas ? aula.duplas.flat() : aula.alunos;
    for (const e of entradas) todosOsNomes.add(analisa(e).nome);
  }
}

const semCadastro = [];
for (const nome of todosOsNomes) {
  if (SEM_CONTA.some((s) => norm(s) === norm(nome))) continue;
  if (!resolve(nome).perfil) semCadastro.push(nome);
}

// nomes que são a mesma pessoa (Bia / Bia Viana) — fica só o mais completo
const criar = semCadastro.filter(
  (n) => !semCadastro.some((o) => o !== n && norm(o).startsWith(norm(n) + " ")),
);

console.log(`\n${criar.length} aluno(s) sem cadastro: ${criar.join(", ")}`);
console.log(`Sem login por decisão sua: ${SEM_CONTA.join(", ")}`);

if (DRY) {
  console.log("\n--- SIMULAÇÃO, nada foi gravado ---\n");
  console.log("Aulas que seriam criadas:");
  for (const [dia, aulas] of Object.entries(LISTAS)) {
    for (const a of aulas) {
      const qtd = a.duplas ? a.duplas.flat().length : a.alunos.length;
      console.log(`  dia ${dia} ${a.hora} ${a.nome.padEnd(20)} ${qtd} aluno(s)`);
    }
  }
  console.log("\nRode sem --dry-run para importar.");
  process.exit(0);
}

// ── 2. cria as contas que faltam ─────────────────────────────────────
const novasCredenciais = [];
for (const nome of criar) {
  const partes = norm(nome).replace(/[^a-z ]/g, "").split(/\s+/);
  let username = partes[0];
  if (porPrimeiro.has(username) || novasCredenciais.some((c) => c.username === username)) {
    username = partes[1] ? `${partes[0]}.${partes[1]}` : `${partes[0]}2`;
  }
  const senha = `${username.replace(/\./g, "")}123`;

  const { data, error } = await db.auth.admin.createUser({
    email: `${username}@ctvh.app`,
    password: senha,
    email_confirm: true,
    user_metadata: {
      username,
      full_name: nome,
      role: "aluno",
      turma: TURMA_DOS_NOVOS[nome] ?? "—",
    },
  });

  if (error) {
    console.log(`❌ ${nome}: ${error.message}`);
    continue;
  }
  novasCredenciais.push({ username, senha, nome });
  const novo = { id: data.user.id, username, full_name: nome, turma: TURMA_DOS_NOVOS[nome] ?? "—" };
  perfis.push(novo);
  porNome.set(norm(nome), novo);
  if (!porPrimeiro.has(partes[0])) porPrimeiro.set(partes[0], novo);
  console.log(`✅ ${nome} -> ${username} / ${senha}`);
}

// ── 3. as aulas da semana ────────────────────────────────────────────
/** Segunda-feira da semana pedida (ou da semana atual). */
function segundaDaSemana() {
  if (SEMANA) return new Date(`${SEMANA}T12:00:00`);
  const hoje = new Date();
  const d = new Date(hoje);
  const diff = (hoje.getDay() + 6) % 7; // 0=domingo -> 6 dias atrás
  d.setDate(hoje.getDate() - diff);
  return d;
}
const iso = (d) => d.toISOString().slice(0, 10);

const segunda = segundaDaSemana();
const datas = {};
for (const dia of [1, 2, 3, 4]) {
  const d = new Date(segunda);
  d.setDate(segunda.getDate() + (dia - 1));
  datas[dia] = iso(d);
}
console.log(`\nSemana de ${datas[1]} (segunda) a ${datas[4]} (quinta)\n`);

// apaga as aulas dessa semana para poder repetir a importação
const { error: erroDel } = await db
  .from("aulas")
  .delete()
  .in("data", Object.values(datas));
if (erroDel) console.log("aviso ao limpar a semana:", erroDel.message);

const relatorio = [];
let totalAulas = 0;
let totalLinhas = 0;

for (const [dia, aulas] of Object.entries(LISTAS)) {
  for (const aula of aulas) {
    const naGrade = grade.find(
      (g) => g.dia_semana === Number(dia) && g.hora.slice(0, 5) === aula.hora && g.nome === aula.nome,
    );

    const { data: criada, error } = await db
      .from("aulas")
      .insert({
        nome: aula.nome,
        professor: "Vitor Hugo",
        nivel: naGrade?.nivel ?? "Intermediário",
        data: datas[dia],
        hora: aula.hora,
        max_alunos: naGrade?.max_alunos ?? 8,
      })
      .select("id")
      .single();

    if (error) {
      console.log(`❌ aula dia ${dia} ${aula.hora} ${aula.nome}: ${error.message}`);
      continue;
    }
    totalAulas++;

    // monta a lista de alunos
    const linhas = [];
    const empurra = (entrada, duplaId) => {
      const { nome, confirmado, obs } = analisa(entrada);
      const { perfil, via } = resolve(nome);
      relatorio.push({ lista: nome, virou: perfil?.full_name ?? "(sem cadastro)", via: via ?? "nome solto" });
      linhas.push({
        aula_id: criada.id,
        profile_id: perfil?.id ?? null,
        nome_livre: perfil ? null : nome,
        confirmado,
        observacao: obs,
        dupla_id: duplaId,
      });
    };

    if (aula.duplas) {
      for (const dupla of aula.duplas) {
        const duplaId = crypto.randomUUID();
        for (const e of dupla) empurra(e, duplaId);
      }
    } else {
      for (const e of aula.alunos) empurra(e, null);
    }

    const { error: erroLinhas } = await db.from("aula_alunos").insert(linhas);
    if (erroLinhas) console.log(`❌ lista de ${aula.nome} ${aula.hora}: ${erroLinhas.message}`);
    else totalLinhas += linhas.length;
  }
}

console.log(`${totalAulas} aulas criadas · ${totalLinhas} alunos nas listas`);

// ── 4. relatório de como cada apelido foi resolvido ──────────────────
console.log("\n=========== CONFIRA ESTES VÍNCULOS ===========");
const vistos = new Set();
for (const r of relatorio.sort((a, b) => a.lista.localeCompare(b.lista))) {
  const chave = r.lista + r.virou;
  if (vistos.has(chave)) continue;
  vistos.add(chave);
  if (r.via === "nome completo") continue; // óbvio, não precisa conferir
  console.log(`  ${r.lista.padEnd(20)} -> ${r.virou.padEnd(26)} (${r.via})`);
}
console.log("==============================================");
console.log("Se algum estiver errado, me diga qual e eu corrijo.");

if (novasCredenciais.length) {
  console.log("\n========= ACESSOS DOS ALUNOS NOVOS =========");
  console.log("LOGIN              SENHA              NOME");
  for (const c of novasCredenciais) {
    console.log(`${c.username.padEnd(18)} ${c.senha.padEnd(18)} ${c.nome}`);
  }
  console.log("============================================");
}
