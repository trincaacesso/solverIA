/**
 * Testa a segurança do banco de ponta a ponta, com contas reais.
 *
 *   node scripts/test-rls.mjs
 *
 * Usa a MESMA chave pública que vai dentro do app. Se um aluno
 * conseguir ler o que não deve aqui, conseguiria no app também.
 *
 * Não altera nada no banco.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const { createClient } = await import("@supabase/supabase-js");

const novoCliente = () =>
  createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

let passou = 0;
let falhou = 0;

function checa(descricao, condicao, detalhe = "") {
  if (condicao) {
    console.log(`  ✅ ${descricao}`);
    passou++;
  } else {
    console.log(`  ❌ ${descricao}${detalhe ? ` — ${detalhe}` : ""}`);
    falhou++;
  }
}

async function entrar(username, password) {
  const db = novoCliente();
  const { data, error } = await db.auth.signInWithPassword({
    email: `${username}@ctvh.app`,
    password,
  });
  return { db, user: data?.user ?? null, error };
}

// ── 1. Sem login, nada é visível ─────────────────────────────────────
console.log("\nSEM LOGIN");
{
  const db = novoCliente();
  const perfis = await db.from("profiles").select("id");
  const pag = await db.from("pagamentos").select("id");
  checa("não lê perfis", (perfis.data?.length ?? 0) === 0);
  checa("não lê pagamentos", (pag.data?.length ?? 0) === 0);
}

// ── 2. Aluno ─────────────────────────────────────────────────────────
console.log("\nALUNO (ana.clara)");
{
  const { db, user, error } = await entrar("ana.clara", "anaclara123");
  checa("consegue entrar", !!user, error?.message);

  if (user) {
    const { data: perfis } = await db
      .from("profiles").select("id, full_name, role, phone");
    checa(
      "enxerga só o próprio cadastro",
      perfis?.length === 1,
      `viu ${perfis?.length ?? 0} de 49`,
    );
    checa(
      "e o cadastro é o dela mesma",
      perfis?.[0]?.full_name === "Ana Clara",
      `veio "${perfis?.[0]?.full_name}"`,
    );
    checa("o cargo dela é aluno", perfis?.[0]?.role === "aluno");

    const { data: pag } = await db.from("pagamentos").select("id");
    checa("não enxerga pagamento de ninguém", (pag?.length ?? 0) === 0);

    // tentativa de escalar privilégio: virar admin sozinha
    const { error: erroUpd } = await db
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
    const { data: depois } = await db.from("profiles").select("role").eq("id", user.id);
    checa(
      "NÃO consegue se promover a admin",
      depois?.[0]?.role === "aluno",
      erroUpd ? `banco recusou: ${erroUpd.message}` : "o cargo mudou!",
    );

    // nem trocar de turma por conta própria
    await db.from("profiles").update({ turma: "Elite B" }).eq("id", user.id);
    const { data: turmaDepois } = await db
      .from("profiles").select("turma").eq("id", user.id);
    checa(
      "NÃO consegue mudar a própria turma",
      turmaDepois?.[0]?.turma !== "Elite B",
      `turma virou "${turmaDepois?.[0]?.turma}"`,
    );

    // aluno é somente leitura: nem o próprio telefone ele altera
    const telAntes = perfis?.[0]?.phone ?? null;
    const tel = `319${Math.floor(10000000 + Math.random() * 89999999)}`;
    await db.from("profiles").update({ phone: tel }).eq("id", user.id);
    const { data: telDepois } = await db
      .from("profiles").select("phone").eq("id", user.id);
    checa(
      "NÃO consegue editar nem o próprio telefone",
      telDepois?.[0]?.phone !== tel,
      `o telefone virou ${telDepois?.[0]?.phone}`,
    );

    // e não mexe na lista do treino
    const { data: listaAntes } = await db.from("aula_alunos").select("id").limit(1);
    if (listaAntes?.length) {
      await db.from("aula_alunos").update({ confirmado: true }).eq("id", listaAntes[0].id);
      const { data: conf } = await db
        .from("aula_alunos").select("confirmado").eq("id", listaAntes[0].id);
      checa("NÃO confirma presença sozinho", conf?.[0]?.confirmado !== true);
    } else {
      console.log("  ·  (sem aulas cadastradas ainda — pulei o teste de presença)");
    }

    const { data: turmas } = await db.from("turmas").select("id");
    checa("enxerga as turmas (isso é permitido)", (turmas?.length ?? 0) === 8);

    await db.auth.signOut();
  }
}

// ── 3. O bug dos nomes repetidos ─────────────────────────────────────
console.log("\nNOMES REPETIDOS (o bug antigo)");
{
  const a = await entrar("ana.clara", "anaclara123");
  const b = await entrar("ana.beatriz", "anabeatriz123");
  checa("Ana Clara entra na conta dela", !!a.user);
  checa("Ana Beatriz entra na conta dela", !!b.user);
  checa(
    "são contas DIFERENTES",
    !!a.user && !!b.user && a.user.id !== b.user.id,
  );

  const c = await entrar("ana", "ana123");
  checa("o login ambíguo 'ana' não existe mais", !c.user);

  await a.db.auth.signOut();
  await b.db.auth.signOut();
}

// ── 4. Admin ─────────────────────────────────────────────────────────
console.log("\nADMIN (vitorhugo)");
{
  const senha = process.env.ADMIN_PASSWORD;
  const { db, user, error } = await entrar("vitorhugo", senha);
  checa("consegue entrar", !!user, error?.message);

  if (user) {
    const { data: perfis } = await db.from("profiles").select("id");
    checa(
      "enxerga os 49 cadastros",
      perfis?.length === 49,
      `viu ${perfis?.length ?? 0}`,
    );
    await db.auth.signOut();
  }
}

// ── 5. Senha errada ──────────────────────────────────────────────────
console.log("\nSENHA ERRADA");
{
  const { user } = await entrar("ana.clara", "senha-errada");
  checa("é recusada", !user);
}

console.log(`\n${passou} passaram · ${falhou} falharam\n`);
process.exit(falhou > 0 ? 1 : 0);
