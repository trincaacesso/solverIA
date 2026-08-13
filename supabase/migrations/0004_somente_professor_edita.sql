-- =====================================================================
-- CT VH Futevôlei — só o professor edita. Aluno apenas consulta.
--
-- Este arquivo SUBSTITUI o 0003. Se você já rodou o 0003, tudo bem:
-- ele é reaplicado aqui. Se não rodou, também tudo bem — basta rodar
-- este. Pode rodar quantas vezes quiser.
--
-- O QUE MUDA:
--
-- Antes, o aluno podia editar o próprio cadastro (para corrigir
-- telefone), confirmar a própria presença e entrar/sair de uma aula.
-- Agora não pode nada disso — ele abre o app, vê a grade, a lista do
-- treino e os próprios dados, e só. Toda alteração passa pelo professor.
--
-- DUAS EXCEÇÕES, e por que elas existem:
--
--   device_tokens — é o "endereço" do celular, que o app grava sozinho
--     ao abrir. Sem isso o aparelho não recebe notificação. Não é dado
--     do CT: é registro técnico, invisível para o aluno.
--
--   feed_seen — a bolinha de "post novo" no menu. É marcador pessoal de
--     leitura, não altera nada do CT.
--
-- Se você quiser travar até essas duas, é só me falar — mas aí o push
-- para de funcionar e o contador de novidades some.
-- =====================================================================


-- ---------------------------------------------------------------------
-- PERFIS — o aluno lê o dele, o professor lê e escreve todos
-- ---------------------------------------------------------------------

-- consulta continua como estava
drop policy if exists "ve o proprio perfil" on public.profiles;
create policy "ve o proprio perfil" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- ESTA É A MUDANÇA: sai o "ou é o próprio dono", fica só o professor
drop policy if exists "edita o proprio perfil" on public.profiles;
drop policy if exists "so o professor edita perfil" on public.profiles;
create policy "so o professor edita perfil" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin cria perfil" on public.profiles;
create policy "admin cria perfil" on public.profiles
  for insert with check (public.is_admin());

drop policy if exists "admin apaga perfil" on public.profiles;
create policy "admin apaga perfil" on public.profiles
  for delete using (public.is_admin());


-- ---------------------------------------------------------------------
-- LISTA DO TREINO — todos veem, só o professor mexe
-- ---------------------------------------------------------------------
drop policy if exists "todo logado le lista da aula" on public.aula_alunos;
create policy "todo logado le lista da aula" on public.aula_alunos
  for select using (auth.uid() is not null);

-- saem as três que davam poder ao aluno
drop policy if exists "aluno confirma a si mesmo" on public.aula_alunos;
drop policy if exists "entra na aula" on public.aula_alunos;
drop policy if exists "sai da aula" on public.aula_alunos;

drop policy if exists "so o professor mexe na lista" on public.aula_alunos;
create policy "so o professor mexe na lista" on public.aula_alunos
  for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------
-- Trava extra nos campos do perfil (o que era o 0003)
--
-- Com as policies acima, o aluno já não consegue nenhum update. Este
-- gatilho é uma segunda camada: se algum dia uma policy for afrouxada
-- por engano, o cargo continua protegido. Segurança em camadas — a
-- falha de uma não vira a falha do sistema.
-- ---------------------------------------------------------------------
create or replace function public.protege_campos_do_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  new.role         := old.role;
  new.username     := old.username;
  new.turma        := old.turma;
  new.plan         := old.plan;
  new.status       := old.status;
  new.aulas_semana := old.aulas_semana;

  return new;
end;
$$;

drop trigger if exists profiles_protege_campos on public.profiles;
create trigger profiles_protege_campos
  before update on public.profiles
  for each row execute function public.protege_campos_do_perfil();
