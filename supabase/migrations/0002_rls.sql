-- =====================================================================
-- CT VH Futevôlei — RLS (Row Level Security)
--
-- O QUE ISSO FAZ, EM PORTUGUÊS:
--
-- A chave "anon" do Supabase vai dentro do APK e do JavaScript do site.
-- Ela é pública por natureza — qualquer pessoa consegue extraí-la.
-- Sem RLS, quem tiver essa chave lê e escreve o banco inteiro.
--
-- Com RLS ligada, o Postgres passa a perguntar, LINHA POR LINHA:
-- "esse usuário pode ver/alterar esta linha?". Quem responde são as
-- policies abaixo.
--
-- Isto é a segurança de verdade. Esconder um item do menu no React é
-- só aparência: hoje um aluno digita /arena/students na URL e vê tudo.
-- Com estas regras, ele até abre a tela, mas o banco devolve vazio.
--
-- Aplicar DEPOIS de 0001_schema.sql.
-- =====================================================================


-- Liga a tranca em todas as tabelas.
-- Atenção: com RLS ligada e NENHUMA policy, o padrão é negar tudo.
alter table public.profiles      enable row level security;
alter table public.turmas        enable row level security;
alter table public.aulas         enable row level security;
alter table public.aula_alunos   enable row level security;
alter table public.pagamentos    enable row level security;
alter table public.campeonatos   enable row level security;
alter table public.config        enable row level security;
alter table public.feed_posts    enable row level security;
alter table public.feed_seen     enable row level security;
alter table public.device_tokens enable row level security;
alter table public.avisos        enable row level security;


-- ---------------------------------------------------------------------
-- PROFILES — cada um vê o próprio cadastro; admin vê todos
-- ---------------------------------------------------------------------
create policy "ve o proprio perfil" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "edita o proprio perfil" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "admin cria perfil" on public.profiles
  for insert with check (public.is_admin());

create policy "admin apaga perfil" on public.profiles
  for delete using (public.is_admin());


-- ---------------------------------------------------------------------
-- TURMAS — todo mundo logado lê; só admin altera
-- ---------------------------------------------------------------------
create policy "todo logado le turmas" on public.turmas
  for select using (auth.uid() is not null);

create policy "admin gere turmas" on public.turmas
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- AULAS — a grade é pública para os alunos; só admin cria/edita
-- ---------------------------------------------------------------------
create policy "todo logado le aulas" on public.aulas
  for select using (auth.uid() is not null);

create policy "admin gere aulas" on public.aulas
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- AULA_ALUNOS — todos veem a lista do treino (já é assim hoje no
-- WhatsApp), mas o aluno só confirma a PRÓPRIA presença
-- ---------------------------------------------------------------------
create policy "todo logado le lista da aula" on public.aula_alunos
  for select using (auth.uid() is not null);

create policy "aluno confirma a si mesmo" on public.aula_alunos
  for update using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

create policy "entra na aula" on public.aula_alunos
  for insert with check (public.is_admin() or profile_id = auth.uid());

create policy "sai da aula" on public.aula_alunos
  for delete using (public.is_admin() or profile_id = auth.uid());


-- ---------------------------------------------------------------------
-- PAGAMENTOS — dado sensível. O aluno vê SÓ o dele e não altera nada.
-- ---------------------------------------------------------------------
create policy "ve os proprios pagamentos" on public.pagamentos
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "so admin mexe em pagamento" on public.pagamentos
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- CAMPEONATOS
-- ---------------------------------------------------------------------
create policy "todo logado le campeonatos" on public.campeonatos
  for select using (auth.uid() is not null);

create policy "admin gere campeonatos" on public.campeonatos
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- CONFIG
-- ---------------------------------------------------------------------
create policy "todo logado le config" on public.config
  for select using (auth.uid() is not null);

create policy "admin edita config" on public.config
  for update using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- FEED
-- ---------------------------------------------------------------------
create policy "todo logado le feed" on public.feed_posts
  for select using (auth.uid() is not null);

create policy "admin gere feed" on public.feed_posts
  for all using (public.is_admin()) with check (public.is_admin());

create policy "cada um marca o proprio visto" on public.feed_seen
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());


-- ---------------------------------------------------------------------
-- DEVICE_TOKENS — cada celular pertence a um usuário
-- ---------------------------------------------------------------------
create policy "cada um gere os proprios tokens" on public.device_tokens
  for all using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid());


-- ---------------------------------------------------------------------
-- AVISOS — todos leem o histórico; só admin dispara
-- ---------------------------------------------------------------------
create policy "todo logado le avisos" on public.avisos
  for select using (auth.uid() is not null);

create policy "admin cria aviso" on public.avisos
  for insert with check (public.is_admin());
