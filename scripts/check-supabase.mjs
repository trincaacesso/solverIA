/**
 * Diagnóstico do Supabase — diz o que já existe no banco e o que falta.
 *
 *   node scripts/check-supabase.mjs
 *
 * Não altera nada. Serve para saber em que pé está a migração antes de
 * rodar qualquer script que escreve.
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltou NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY no .env.local.");
  process.exit(1);
}

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABELAS = [
  "profiles", "turmas", "aulas", "aula_alunos", "pagamentos",
  "campeonatos", "config", "feed_posts", "feed_seen",
  "device_tokens", "avisos",
];

console.log(`\nProjeto: ${url}\n`);
console.log("TABELAS");

let faltando = 0;
for (const t of TABELAS) {
  const { count, error } = await db.from(t).select("*", { count: "exact", head: true });
  if (error) {
    faltando++;
    const naoExiste = /does not exist|schema cache|not find the table/i.test(error.message);
    console.log(`  ❌ ${t.padEnd(14)} ${naoExiste ? "NÃO EXISTE" : error.message}`);
  } else {
    console.log(`  ✅ ${t.padEnd(14)} ${count} linha(s)`);
  }
}

// ── usuários criados ─────────────────────────────────────────────────
const { data: lista, error: erroUsers } = await db.auth.admin.listUsers({ perPage: 200 });
if (erroUsers) {
  console.log(`\nUSUÁRIOS\n  ❌ ${erroUsers.message}`);
} else {
  const admins = [];
  for (const u of lista.users) {
    if (u.user_metadata?.role === "admin") admins.push(u.user_metadata.username ?? u.email);
  }
  console.log(`\nUSUÁRIOS\n  ${lista.users.length} conta(s) em auth.users`);
  if (admins.length) console.log(`  admin: ${admins.join(", ")}`);
}

// ── a chave pública está correta? ────────────────────────────────────
console.log("\nCHAVE PÚBLICA (NEXT_PUBLIC_SUPABASE_ANON_KEY)");
if (!anonKey) {
  console.log("  ❌ não definida");
} else if (anonKey.startsWith("sb_secret_")) {
  console.log("  🔴 É UMA CHAVE SECRETA. Ela vai dentro do APK e do site —");
  console.log("     qualquer pessoa conseguiria ler e apagar o banco inteiro.");
  console.log("     Troque pela chave que começa com sb_publishable_");
} else if (anonKey.startsWith("sb_publishable_")) {
  console.log("  ✅ chave publishable, formato correto");
} else if (anonKey.startsWith("eyJ")) {
  console.log("  ✅ chave anon no formato antigo (JWT) — funciona");
} else {
  console.log("  ⚠️  formato não reconhecido");
}

// ── RLS está mesmo ligada? teste real, com a chave pública ───────────
console.log("\nRLS (a tranca do banco)");
if (anonKey) {
  const publico = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await publico.from("profiles").select("id").limit(5);
  if (error) {
    console.log(`  ✅ sem login, o banco recusa: "${error.message}"`);
  } else if (data.length === 0) {
    console.log("  ✅ sem login, o banco devolve vazio");
  } else {
    console.log(`  🔴 SEM LOGIN, O BANCO DEVOLVEU ${data.length} PERFIL(IS).`);
    console.log("     A RLS não está protegendo. Rode 0002_rls.sql.");
  }
}

console.log(
  faltando === 0
    ? "\n→ Estrutura completa.\n"
    : `\n→ Faltam ${faltando} tabela(s). Rode 0001_schema.sql.\n`,
);
