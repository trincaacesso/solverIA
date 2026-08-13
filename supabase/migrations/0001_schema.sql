-- =====================================================================
-- CT VH Futevôlei — estrutura do banco
--
-- Como aplicar: painel do Supabase -> SQL Editor -> New query ->
-- colar este arquivo inteiro -> Run.
-- Depois rode 0002_rls.sql, que liga a segurança.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. PROFILES — espelho de auth.users com os dados do CT
--
-- O Supabase guarda login e senha na tabela interna auth.users, que a
-- gente não pode alterar. Tudo que é "do CT" (turma, plano, cargo)
-- vive aqui, ligado por id.
-- ---------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  full_name     text not null,
  role          text not null default 'aluno' check (role in ('admin','aluno')),
  turma         text default '—',
  phone         text,
  contact_email text,
  plan          text default 'Mensal'
                check (plan in ('Mensal','Trimestral','Semestral','Anual','Passe Livre','Avulso')),
  aulas_semana  int  default 2,
  status        text default 'Ativo' check (status in ('Ativo','Inadimplente','Inativo')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Responde "quem está logado é admin?".
--
-- security definer faz a função rodar ignorando as regras de segurança.
-- Isso é OBRIGATÓRIO aqui: sem isso, uma regra da tabela profiles que
-- consulta a própria tabela profiles entra em recursão infinita e o
-- Postgres derruba a consulta com "infinite recursion detected".
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Cria o profile automaticamente sempre que nasce um usuário.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role, turma)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', 'Aluno'),
    coalesce(new.raw_user_meta_data->>'role', 'aluno'),
    coalesce(new.raw_user_meta_data->>'turma', '—')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------
-- 2. TURMAS
-- ---------------------------------------------------------------------
create table public.turmas (
  id    uuid primary key default gen_random_uuid(),
  nome  text unique not null,
  ordem int default 0
);

insert into public.turmas (nome, ordem) values
  ('Iniciante', 1),
  ('Aprendiz', 2),
  ('Pré-Elite', 3),
  ('Elite B', 4),
  ('Feminino', 5),
  ('Feminino Avançado', 6),
  ('Misto Aprendiz', 7),
  ('—', 99);


-- ---------------------------------------------------------------------
-- 3. AULAS — espelha a interface ClassData de app/arena/calendar/page.tsx
-- ---------------------------------------------------------------------
create table public.aulas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  professor  text default 'A definir',
  nivel      text not null check (nivel in ('Iniciante','Intermediário','Avançado')),
  data       date not null,
  hora       time not null,
  max_alunos int  not null default 8,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create index aulas_data_idx on public.aulas (data);


-- ---------------------------------------------------------------------
-- 4. AULA_ALUNOS — quem está em cada aula e quem confirmou
--
-- profile_id nulo + nome_livre preenchido cobre os casos que já existem
-- hoje nas listas, como "Ericky e Biel" (dupla) e "Clarckson (1-8)".
-- ---------------------------------------------------------------------
create table public.aula_alunos (
  id          uuid primary key default gen_random_uuid(),
  aula_id     uuid not null references public.aulas(id) on delete cascade,
  profile_id  uuid references public.profiles(id) on delete set null,
  nome_livre  text,
  confirmado  boolean not null default false,
  presente    boolean,                      -- null = ainda não marcado
  marcado_em  timestamptz,
  created_at  timestamptz default now(),
  constraint aula_alunos_tem_nome
    check (profile_id is not null or nome_livre is not null),
  unique (aula_id, profile_id)
);

create index aula_alunos_aula_idx on public.aula_alunos (aula_id);


-- ---------------------------------------------------------------------
-- 5. PAGAMENTOS — espelha PaymentInfo de app/arena/report/page.tsx
-- competencia = primeiro dia do mês de referência (ex.: 2026-08-01)
-- ---------------------------------------------------------------------
create table public.pagamentos (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  competencia  date not null,
  valor        numeric(10,2),
  metodo       text default '—'
               check (metodo in ('—','Pix','Dinheiro','Cartão','Transferência')),
  dia_habitual int check (dia_habitual between 1 and 31),
  pago         boolean not null default false,
  pago_em      timestamptz,
  unique (profile_id, competencia)
);


-- ---------------------------------------------------------------------
-- 6. CAMPEONATOS (CEFFLASH)
-- rounds guarda o Round[] gerado por lib/bracket.ts, como JSON.
-- ---------------------------------------------------------------------
create table public.campeonatos (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  pairs_count int  not null,
  rounds      jsonb not null default '[]'::jsonb,
  created_by  uuid references public.profiles(id),
  created_at  timestamptz default now()
);


-- ---------------------------------------------------------------------
-- 7. CONFIG — linha única, espelha app/arena/settings/page.tsx
-- ---------------------------------------------------------------------
create table public.config (
  id             smallint primary key default 1 check (id = 1),
  arena_nome     text default 'CT VH',
  abre           time default '06:00',
  fecha          time default '22:00',
  max_por_aula   int  default 12,
  notif_email    boolean default true,
  notif_whatsapp boolean default true,
  updated_at     timestamptz default now()
);

insert into public.config (id) values (1);


-- ---------------------------------------------------------------------
-- 8. FEED — tira as URLs de dentro de lib/arena-feed.ts
-- ---------------------------------------------------------------------
create table public.feed_posts (
  id         uuid primary key default gen_random_uuid(),
  url        text unique not null,
  ordem      int default 0,
  created_at timestamptz default now()
);

-- Substitui o controle de "post já visto" que hoje vive no localStorage.
create table public.feed_seen (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.feed_posts(id) on delete cascade,
  seen_at    timestamptz default now(),
  primary key (profile_id, post_id)
);


-- ---------------------------------------------------------------------
-- 9. DEVICE_TOKENS — o "endereço" de cada celular, para o push saber
-- para onde mandar a notificação.
-- ---------------------------------------------------------------------
create table public.device_tokens (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token      text unique not null,
  platform   text not null check (platform in ('android','ios','web')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index device_tokens_profile_idx on public.device_tokens (profile_id);


-- ---------------------------------------------------------------------
-- 10. AVISOS — histórico do que o admin disparou
-- alvo: 'todos' | 'turma:<nome>' | 'user:<uuid>'
-- ---------------------------------------------------------------------
create table public.avisos (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  corpo      text not null,
  alvo       text not null default 'todos',
  enviados   int  default 0,
  falhas     int  default 0,
  criado_por uuid references public.profiles(id),
  criado_em  timestamptz default now()
);
