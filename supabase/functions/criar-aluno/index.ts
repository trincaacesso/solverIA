/**
 * Cadastra um aluno novo, com login e senha.
 *
 * POR QUE ISSO RODA NO SERVIDOR:
 *
 * Criar conta exige a chave de administrador do banco, que ignora todas
 * as regras de segurança. Se ela ficasse dentro do app, qualquer pessoa
 * a extrairia do JavaScript e teria acesso total. Aqui ela vive só no
 * Supabase, e o app apenas pede o cadastro.
 *
 * A função confere que quem está pedindo é o professor antes de fazer
 * qualquer coisa.
 *
 * Publicar:  npx supabase functions deploy criar-aluno
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const responde = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

/** "João Almir" -> ["joao", "almir"] */
function partesDoNome(nome: string): string[] {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    // ── 1. quem está pedindo é o professor? ──────────────────────────
    const autorizacao = req.headers.get("Authorization") ?? "";
    const comoUsuario = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: autorizacao } } },
    );

    const {
      data: { user },
    } = await comoUsuario.auth.getUser();
    if (!user) return responde({ error: "Faça login novamente." }, 401);

    const { data: perfil } = await comoUsuario
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (perfil?.role !== "admin") {
      return responde({ error: "Só o professor pode cadastrar alunos." }, 403);
    }

    // ── 2. o que cadastrar ───────────────────────────────────────────
    const dados = await req.json();
    const nomeCompleto = String(dados.full_name ?? "").trim();
    if (!nomeCompleto) {
      return responde({ error: "Informe o nome do aluno." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // ── 3. um login que ainda não exista ─────────────────────────────
    // Mesma regra do cadastro inicial: primeiro nome, e sobrenome junto
    // quando já houver alguém com aquele primeiro nome. É o que evita
    // duas pessoas caindo na mesma conta.
    const partes = partesDoNome(nomeCompleto);
    if (partes.length === 0) {
      return responde({ error: "Nome inválido." }, 400);
    }

    const { data: existentes } = await admin.from("profiles").select("username");
    const usados = new Set((existentes ?? []).map((p) => p.username));

    let username = partes[0];
    if (usados.has(username) && partes[1]) username = `${partes[0]}.${partes[1]}`;
    let sufixo = 2;
    while (usados.has(username)) {
      username = `${partes[0]}${sufixo}`;
      sufixo++;
    }

    const senha = `${username.replace(/\./g, "")}123`;

    // ── 4. cria ──────────────────────────────────────────────────────
    const { data: criado, error: erroCriar } = await admin.auth.admin.createUser({
      email: `${username}@ctvh.app`,
      password: senha,
      email_confirm: true, // sem enviar e-mail: o endereço é interno
      user_metadata: {
        username,
        full_name: nomeCompleto,
        role: "aluno",
        turma: dados.turma ?? "—",
      },
    });

    if (erroCriar || !criado.user) {
      return responde({ error: erroCriar?.message ?? "Não consegui criar." }, 400);
    }

    // O gatilho do banco já criou o perfil; aqui completamos o resto.
    const complemento: Record<string, unknown> = {};
    for (const campo of ["phone", "contact_email", "plan", "aulas_semana", "status"]) {
      if (dados[campo] !== undefined && dados[campo] !== "") {
        complemento[campo] = dados[campo];
      }
    }
    if (Object.keys(complemento).length > 0) {
      await admin.from("profiles").update(complemento).eq("id", criado.user.id);
    }

    return responde({ ok: true, id: criado.user.id, username, senha });
  } catch (e) {
    return responde({ error: String(e) }, 500);
  }
});
