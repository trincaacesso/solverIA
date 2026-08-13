import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

/**
 * A conexão é criada só no primeiro uso de verdade, e não quando o
 * arquivo é importado.
 *
 * MOTIVO: durante `next build`, o Next executa os componentes no
 * servidor para gerar o HTML de cada página. Se o cliente fosse criado
 * na importação, ele tentaria se conectar nesse momento — sem ninguém
 * logado e sem nada a consultar — e derrubaria o build inteiro com
 * "supabaseUrl is required" caso a variável de ambiente faltasse.
 *
 * Como todo acesso ao banco acontece dentro de useEffect e de cliques,
 * que só rodam no navegador, adiar a criação resolve: o build passa e o
 * erro (se houver) aparece na hora certa, com uma mensagem que ajuda.
 */
let cliente: SupabaseClient | null = null;

function getCliente(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !chave) {
    throw new Error(
      "Faltam as variáveis NEXT_PUBLIC_SUPABASE_URL e " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY. No seu PC elas ficam no arquivo " +
        ".env.local; na Vercel, em Settings > Environment Variables; e " +
        "no app, nos Secrets do GitHub (usados durante o build).",
    );
  }

  cliente = createClient(url, chave, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // não usamos link mágico por e-mail
      storage: hybridStorage,
      // chave nova de propósito: a antiga ("ctvh-auth") guardava o
      // formato do login falso e não é compatível
      storageKey: "ctvh-auth-v2",
    },
  });
  return cliente;
}

/**
 * Use normalmente: supabase.from(...), supabase.auth...
 *
 * O .bind() é necessário: o supabase-js usa campos privados de classe,
 * que só funcionam quando o método é chamado com o objeto original
 * como `this`. Sem o bind, `this` seria este Proxy e os acessos
 * privados falhariam.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_alvo, prop) => {
    const real = getCliente();
    const valor = Reflect.get(real, prop);
    return typeof valor === "function" ? valor.bind(real) : valor;
  },
});

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
