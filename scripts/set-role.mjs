/**
 * Define o cargo de um usuário — a única forma segura de promover
 * alguém a professor, já que o banco impede que o próprio usuário mude
 * o cargo (ver supabase/migrations/0003_protege_campos_do_perfil.sql).
 *
 *   node scripts/set-role.mjs                     lista os admins
 *   node scripts/set-role.mjs joao admin          promove
 *   node scripts/set-role.mjs joao aluno          rebaixa
 *   node scripts/set-role.mjs --so-o-vitorhugo    tira o admin de todo
 *                                                 mundo, menos vitorhugo
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const l of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const listarAdmins = async (rotulo) => {
  const { data } = await db.from("profiles").select("username").eq("role", "admin");
  const nomes = data?.map((a) => a.username).sort() ?? [];
  console.log(`${rotulo}: ${nomes.length ? nomes.join(", ") : "(nenhum)"}`);
  return nomes;
};

const [alvo, cargo] = process.argv.slice(2);

if (!alvo) {
  await listarAdmins("admins");
  process.exit(0);
}

if (alvo === "--so-o-vitorhugo") {
  await listarAdmins("antes ");
  const { error } = await db
    .from("profiles")
    .update({ role: "aluno" })
    .eq("role", "admin")
    .neq("username", "vitorhugo");
  if (error) {
    console.error("❌", error.message);
    process.exit(1);
  }
  await listarAdmins("depois");
  process.exit(0);
}

if (cargo !== "admin" && cargo !== "aluno") {
  console.error("❌ O cargo precisa ser 'admin' ou 'aluno'.");
  process.exit(1);
}

const { data, error } = await db
  .from("profiles")
  .update({ role: cargo })
  .eq("username", alvo)
  .select("username, full_name, role");

if (error) {
  console.error("❌", error.message);
  process.exit(1);
}
if (!data?.length) {
  console.error(`❌ Não existe usuário com o login "${alvo}".`);
  process.exit(1);
}

console.log(`✅ ${data[0].full_name} (${data[0].username}) agora é ${data[0].role}.`);
