/**
 * Carga inicial do Supabase — cria os alunos do CT VH e o admin.
 *
 * COMO USAR
 *
 *   1) Ver o que SERIA criado, sem tocar no banco:
 *        node scripts/seed-supabase.mjs --dry-run
 *
 *   2) Criar de verdade:
 *        node scripts/seed-supabase.mjs
 *
 * PRECISA de um arquivo .env.local na raiz do projeto com:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
 *   ADMIN_PASSWORD=uma-senha-forte-que-voce-escolher
 *
 * A SUPABASE_SERVICE_ROLE_KEY ignora todas as regras de segurança do
 * banco. Ela existe só para este script rodar na sua máquina. Nunca a
 * coloque no código do site, na Vercel, nem no Git.
 *
 * POR QUE E-MAIL SE OS ALUNOS NÃO TÊM E-MAIL?
 * O Supabase exige e-mail para criar conta. Usamos um endereço interno
 * (ex.: ana.clara@ctvh.app) que nunca recebe mensagem nenhuma. O aluno
 * não vê isso: ele continua digitando só login e senha, e o app monta
 * o e-mail por baixo dos panos.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

// ── carrega o .env.local sem depender de biblioteca externa ───────────
try {
  for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim();
  }
} catch {
  if (!DRY_RUN) {
    console.error("❌ Não achei o arquivo .env.local na raiz do projeto.");
    console.error("   Crie ele com NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e ADMIN_PASSWORD.");
    process.exit(1);
  }
}

// ── lê o roster direto de lib/arena-students.ts ───────────────────────
// Assim a lista de alunos tem UMA fonte só: se você editar o arquivo do
// projeto, este script acompanha automaticamente.
function lerRoster() {
  const src = readFileSync(join(ROOT, "lib", "arena-students.ts"), "utf8");
  const entradas = [...src.matchAll(/\{\s*name:\s*"([^"]+)"\s*,\s*turma:\s*"([^"]+)"\s*\}/g)];
  if (entradas.length === 0) {
    console.error("❌ Não consegui ler o ROSTER de lib/arena-students.ts.");
    process.exit(1);
  }
  return entradas.map((m) => ({ name: m[1], turma: m[2] }));
}

/** "Gabriel Avelino (Caixa)" -> ["gabriel", "avelino"] */
function partesDoNome(nome) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // tira acentos
    .replace(/\(.*?\)/g, "")          // tira apelido entre parênteses
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Gera logins únicos.
 *
 * ESTE É O CONSERTO DE UM BUG REAL: hoje o login compara só o primeiro
 * nome, e há 7 nomes repetidos no cadastro (3 Daniel, 3 Ana, 2 Yasmin,
 * 2 Pedro, 2 Guilherme, 2 Enzo, 2 David). O código antigo devolve o
 * primeiro que casar, então Ana Clara digita a senha certa e entra na
 * conta da Ana Beatriz. Aqui, nome repetido ganha o sobrenome junto.
 */
function gerarUsuarios(roster) {
  const quantosPorPrimeiroNome = {};
  for (const e of roster) {
    const p = partesDoNome(e.name)[0];
    quantosPorPrimeiroNome[p] = (quantosPorPrimeiroNome[p] ?? 0) + 1;
  }

  const usados = new Set();

  return roster.map((e) => {
    const partes = partesDoNome(e.name);
    let username = partes[0];

    if (quantosPorPrimeiroNome[partes[0]] > 1 && partes[1]) {
      username = `${partes[0]}.${partes[1]}`;
    }
    // rede de segurança: se ainda assim repetir, vai somando sobrenomes
    let i = 2;
    while (usados.has(username)) {
      username = partes[i] ? `${username}.${partes[i]}` : `${username}${i}`;
      i++;
    }
    usados.add(username);

    return {
      username,
      email: `${username}@ctvh.app`,
      password: `${username.replace(/\./g, "")}123`,
      full_name: e.name,
      turma: e.turma,
      role: "aluno",
    };
  });
}

// ── monta a lista final ───────────────────────────────────────────────
const roster = lerRoster();
const usuarios = gerarUsuarios(roster);

const senhaAdmin = process.env.ADMIN_PASSWORD;
if (!DRY_RUN && (!senhaAdmin || senhaAdmin.length < 10)) {
  console.error("❌ Defina ADMIN_PASSWORD no .env.local com pelo menos 10 caracteres.");
  console.error("   A senha antiga do professor (a que estava escrita no código) vazou:");
  console.error("   ela está no histórico do Git e ia junto no JavaScript do site.");
  console.error("   Escolha uma nova, diferente de qualquer outra que você use.");
  process.exit(1);
}

usuarios.push({
  username: "vitorhugo",
  email: "vitorhugo@ctvh.app",
  password: senhaAdmin ?? "(definida no .env.local)",
  full_name: "Vitor Hugo",
  turma: "—",
  role: "admin",
});

// ── mostra os logins que serão criados ────────────────────────────────
const repetidos = usuarios.filter((u) => u.username.includes("."));
console.log(`\n${usuarios.length} contas (${roster.length} alunos + 1 admin)\n`);
console.log("Logins com sobrenome, porque o primeiro nome se repetia:");
for (const u of repetidos) console.log(`   ${u.full_name.padEnd(24)} -> ${u.username}`);

if (DRY_RUN) {
  console.log("\n--- LISTA COMPLETA (dry-run, nada foi criado) ---");
  for (const u of usuarios) {
    console.log(`${u.username.padEnd(18)} ${u.password.padEnd(18)} ${u.role.padEnd(6)} ${u.full_name}`);
  }
  console.log("\nRode sem --dry-run para criar de verdade.");
  process.exit(0);
}

// ── cria no Supabase ──────────────────────────────────────────────────
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltou NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local.");
  process.exit(1);
}

// import aqui embaixo (e não no topo) para o --dry-run rodar mesmo
// antes de instalar as dependências
const { createClient } = await import("@supabase/supabase-js");

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("\n--- CRIANDO CONTAS ---\n");

let criados = 0;
let jaExistiam = 0;
let erros = 0;
const credenciais = [];

for (const u of usuarios) {
  const { error } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true, // marca como confirmado sem enviar e-mail nenhum
    user_metadata: {
      username: u.username,
      full_name: u.full_name,
      role: u.role,
      turma: u.turma,
    },
  });

  if (!error) {
    criados++;
    // a senha do admin não entra na lista impressa: essa lista é feita
    // para ser copiada e distribuída aos alunos
    if (u.role !== "admin") {
      credenciais.push(`${u.username.padEnd(18)} ${u.password.padEnd(18)} ${u.full_name}`);
    }
    console.log(`✅ ${u.username}`);
  } else if (/already|exists|registered/i.test(error.message)) {
    jaExistiam++;
    console.log(`⏭️  ${u.username} (já existia, pulado)`);
  } else {
    erros++;
    console.log(`❌ ${u.username}: ${error.message}`);
  }
}

console.log(`\n${criados} criados · ${jaExistiam} já existiam · ${erros} com erro`);

if (credenciais.length) {
  console.log("\n=================== GUARDE ESTA LISTA ===================");
  console.log("É o que você entrega aos alunos. A senha do admin não\naparece aqui — é a que você pôs em ADMIN_PASSWORD.\n");
  console.log("LOGIN              SENHA              NOME");
  for (const linha of credenciais) console.log(linha);
  console.log("=========================================================");
}

if (erros > 0) {
  console.log("\n⚠️  Deu erro em alguma conta. O mais comum é 'Email confirmation required':");
  console.log("   no painel do Supabase, vá em Authentication -> Providers -> Email");
  console.log("   e DESLIGUE a opção 'Confirm email'. Depois rode o script de novo.");
  process.exit(1);
}
