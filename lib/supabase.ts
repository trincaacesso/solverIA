import { createClient } from "@supabase/supabase-js";

/**
 * Conexão com o banco.
 *
 * A chave usada aqui é a pública (anon/publishable). Ela vai dentro do
 * JavaScript do site e do APK — isso é normal e esperado. Quem protege
 * os dados são as regras de RLS do banco, não o sigilo da chave:
 * sem login, o Postgres devolve vazio. Ver supabase/migrations/0002_rls.sql.
 */

const REMEMBER_KEY = "ctvh-remember";

/**
 * O supabase-js aceita só UM lugar para guardar a sessão, mas a tela de
 * login tem a opção "salvar login". Este adaptador decide na hora:
 *
 *   marcado    -> localStorage   (continua logado depois de fechar)
 *   desmarcado -> sessionStorage (cai o login ao fechar a aba)
 *
 * Os guards `typeof window === "undefined"` são obrigatórios: mesmo com
 * "use client", o Next executa este código no servidor durante o build,
 * onde localStorage não existe — sem eles, o build da Vercel quebra.
 */
const hybridStorage = {
  getItem: (key: string) =>
    typeof window === "undefined"
      ? null
      : (localStorage.getItem(key) ?? sessionStorage.getItem(key)),

  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    const remember = localStorage.getItem(REMEMBER_KEY) === "1";
    (remember ? localStorage : sessionStorage).setItem(key, value);
  },

  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

/** Precisa ser chamado ANTES do login, para o storage certo ser escolhido. */
export function setRemember(remember: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // não usamos link mágico por e-mail
      storage: hybridStorage,
      // chave nova de propósito: a antiga ("ctvh-auth") guardava o
      // formato do login falso e não é compatível
      storageKey: "ctvh-auth-v2",
    },
  },
);

/**
 * Os alunos não têm e-mail, mas o Supabase exige um para criar conta.
 * Usamos um endereço interno que nunca recebe mensagem nenhuma:
 *
 *   "ana.clara"  ->  "ana.clara@ctvh.app"
 *
 * O aluno não vê isso: continua digitando só login e senha.
 * Precisa bater com o que scripts/seed-supabase.mjs gerou.
 */
export function emailFromUsername(username: string): string {
  const u = username
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  return u.includes("@") ? u : `${u}@ctvh.app`;
}
