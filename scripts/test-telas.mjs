/**
 * Testa as consultas que as telas usam, com contas reais.
 *
 *   node scripts/test-telas.mjs
 *
 * Usa a chave pública — a mesma que vai dentro do app. O que passar
 * aqui funciona na tela; o que falhar aqui, falha lá também.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const { createClient } = await import("@supabase/supabase-js");

let passou = 0;
let falhou = 0;
function checa(desc, cond, detalhe = "") {
  if (cond) {
    console.log(`  ✅ ${desc}`);
    passou++;
  } else {
    console.log(`  ❌ ${desc}${detalhe ? ` — ${detalhe}` : ""}`);
    falhou++;
  }
}

async function entrar(username, senha) {
  const db = createClient(url, anon, { auth: { persistSession: false } });
  const { data } = await db.auth.signInWithPassword({
    email: `${username}@ctvh.app`,
    password: senha,
  });
  return { db, user: data?.user ?? null };
}

const CAMPOS_ALUNO =
  "id, username, full_name, role, turma, phone, contact_email, plan, aulas_semana, status";

// ── PROFESSOR ────────────────────────────────────────────────────────
console.log("\nTELA DE ALUNOS — como professor");
{
  const { db, user } = await entrar("vitorhugo", process.env.ADMIN_PASSWORD);
  checa("entra no sistema", !!user);

  const { data, error } = await db
    .from("profiles")
    .select(CAMPOS_ALUNO)
    .order("full_name");
  checa("a lista carrega", !error, error?.message);
  checa("traz os 66 alunos", data?.length === 66, `vieram ${data?.length}`);

  const comCampos = data?.[0];
  checa(
    "os campos da tela vêm preenchidos",
    !!comCampos?.full_name && !!comCampos?.username && !!comCampos?.plan,
    JSON.stringify(comCampos),
  );

  const { data: t } = await db.from("turmas").select("id, nome").order("ordem");
  checa("o menu de turmas carrega", (t?.length ?? 0) >= 10, `${t?.length} turmas`);
  checa(
    "inclui a turma Feminino Iniciante",
    t?.some((x) => x.nome === "Feminino Iniciante"),
  );

  // edição: grava e confere
  const alvo = data.find((a) => a.username === "alice");
  const novoTelefone = `319${Math.floor(10000000 + Math.random() * 89999999)}`;
  const { error: erroUpd } = await db
    .from("profiles")
    .update({ phone: novoTelefone, plan: "Trimestral" })
    .eq("id", alvo.id);
  checa("o professor consegue editar", !erroUpd, erroUpd?.message);

  const { data: depois } = await db
    .from("profiles")
    .select("phone, plan")
    .eq("id", alvo.id)
    .single();
  checa(
    "a alteração ficou salva",
    depois?.phone === novoTelefone && depois?.plan === "Trimestral",
    JSON.stringify(depois),
  );

  // desfaz para não deixar lixo
  await db.from("profiles").update({ phone: null, plan: "Mensal" }).eq("id", alvo.id);

  const { data: aulasSemana } = await db
    .from("aulas")
    .select("id, nome, data, hora")
    .order("data");
  checa("as 19 aulas da semana estão lá", aulasSemana?.length === 19, `${aulasSemana?.length}`);

  await db.auth.signOut();
}

// ── ALUNO ────────────────────────────────────────────────────────────
console.log("\nTELA DE ALUNOS — como aluno (não deve ver)");
{
  const { db, user } = await entrar("ana.clara", "anaclara123");
  checa("entra no sistema", !!user);

  const { data } = await db.from("profiles").select(CAMPOS_ALUNO);
  checa("enxerga só o próprio cadastro", data?.length === 1, `viu ${data?.length}`);

  const { data: outra } = await db
    .from("profiles")
    .select("id")
    .eq("username", "alice");
  checa("não enxerga o cadastro de outro aluno", (outra?.length ?? 0) === 0);

  const { data: aulasVistas } = await db.from("aulas").select("id");
  checa(
    "mas enxerga a grade de aulas (isso é permitido)",
    (aulasVistas?.length ?? 0) === 19,
    `viu ${aulasVistas?.length}`,
  );

  await db.auth.signOut();
}

console.log(`\n${passou} passaram · ${falhou} falharam\n`);
process.exit(falhou > 0 ? 1 : 0);
