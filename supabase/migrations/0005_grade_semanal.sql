-- =====================================================================
-- CT VH Futevôlei — grade semanal fixa
--
-- POR QUE ESTA TABELA EXISTE:
--
-- A tabela `aulas` guarda datas concretas (2026-08-06). Mas a grade do
-- CT se repete toda semana: "toda segunda às 15h tem Iniciante". Sem
-- uma grade recorrente, o professor recadastraria as mesmas 19 aulas
-- todo mês.
--
-- Aqui fica o molde; as aulas de cada semana são geradas a partir dele.
-- Aula extra ou cancelamento continuam sendo feitos direto em `aulas`,
-- sem mexer no molde.
--
-- Pode rodar quantas vezes quiser.
-- =====================================================================


-- Faltava esta turma: aparece nas listas de segunda e quarta, às 18h.
insert into public.turmas (nome, ordem) values ('Feminino Iniciante', 8)
on conflict (nome) do nothing;

-- O nome usado nas listas do WhatsApp é "Elite", não "Elite B".
insert into public.turmas (nome, ordem) values ('Elite', 9)
on conflict (nome) do nothing;


create table if not exists public.grade_semanal (
  id         uuid primary key default gen_random_uuid(),
  -- 0 = domingo ... 6 = sábado, igual ao getDay() do JavaScript,
  -- para não precisar converter no app
  dia_semana int  not null check (dia_semana between 0 and 6),
  hora       time not null,
  nome       text not null,
  nivel      text not null check (nivel in ('Iniciante','Intermediário','Avançado')),
  max_alunos int  not null default 8,
  -- true quando a turma treina em duplas (Elite). Muda como a lista é
  -- montada: os dois nomes da dupla ficam ligados.
  duplas     boolean not null default false,
  ativo      boolean not null default true,
  created_at timestamptz default now(),
  unique (dia_semana, hora, nome)
);

create index if not exists grade_semanal_dia_idx on public.grade_semanal (dia_semana, hora);


-- ---------------------------------------------------------------------
-- A grade real do CT, conforme as listas do WhatsApp
-- ---------------------------------------------------------------------
insert into public.grade_semanal (dia_semana, hora, nome, nivel, max_alunos, duplas) values
  -- Segunda
  (1, '15:00', 'Iniciante',          'Iniciante',     8,  false),
  (1, '16:00', 'Aprendiz',           'Intermediário', 8,  false),
  (1, '17:00', 'Feminino Avançado',  'Avançado',      8,  false),
  (1, '18:00', 'Feminino Iniciante', 'Iniciante',     8,  false),
  (1, '19:00', 'Elite',              'Avançado',      8,  true),
  (1, '20:00', 'Aprendiz',           'Intermediário', 8,  false),

  -- Terça (só três aulas, e a do meio é 18h30)
  (2, '17:00', 'Iniciante',          'Iniciante',     8,  false),
  (2, '18:30', 'Pré-Elite',          'Avançado',      12, false),
  (2, '20:00', 'Aprendiz',           'Intermediário', 8,  false),

  -- Quarta (igual à segunda)
  (3, '15:00', 'Iniciante',          'Iniciante',     8,  false),
  (3, '16:00', 'Aprendiz',           'Intermediário', 8,  false),
  (3, '17:00', 'Feminino Avançado',  'Avançado',      8,  false),
  (3, '18:00', 'Feminino Iniciante', 'Iniciante',     8,  false),
  (3, '19:00', 'Elite',              'Avançado',      8,  true),
  (3, '20:00', 'Aprendiz',           'Intermediário', 8,  false),

  -- Quinta
  (4, '17:00', 'Iniciante',          'Iniciante',     8,  false),
  (4, '18:00', 'Aprendiz',           'Intermediário', 8,  false),
  (4, '19:00', 'Pré-Elite',          'Avançado',      12, false),
  (4, '20:00', 'Aprendiz',           'Intermediário', 8,  false)
on conflict (dia_semana, hora, nome) do nothing;


-- ---------------------------------------------------------------------
-- Segurança: todo mundo logado lê a grade; só o professor altera
-- ---------------------------------------------------------------------
alter table public.grade_semanal enable row level security;

drop policy if exists "todo logado le a grade" on public.grade_semanal;
create policy "todo logado le a grade" on public.grade_semanal
  for select using (auth.uid() is not null);

drop policy if exists "so o professor edita a grade" on public.grade_semanal;
create policy "so o professor edita a grade" on public.grade_semanal
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- Observação por aluno na lista do treino
--
-- As listas trazem anotações: "Lucas (2-8)", "Yasmin Silva (gym)".
-- Não são parte do nome — são recado do professor. Ficam num campo
-- próprio para o nome continuar limpo e casável com o cadastro.
-- ---------------------------------------------------------------------
alter table public.aula_alunos add column if not exists observacao text;

-- Liga os dois nomes de uma dupla do Elite. Ambos apontam para o mesmo
-- valor, então a presença de cada um continua sendo individual.
alter table public.aula_alunos add column if not exists dupla_id uuid;
