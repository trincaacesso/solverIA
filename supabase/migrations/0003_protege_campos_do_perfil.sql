-- =====================================================================
-- CT VH Futevôlei — trava os campos administrativos do perfil
--
-- O PROBLEMA QUE ISSO RESOLVE:
--
-- A policy "edita o proprio perfil" (0002) deixa cada pessoa alterar o
-- próprio cadastro — o que é desejável, para o aluno corrigir telefone
-- e e-mail. Só que "o próprio cadastro" inclui a coluna role. Um aluno
-- rodava um update em si mesmo e virava admin.
--
-- Uma policy de RLS não resolve isso sozinha: no update, o `using` só
-- enxerga a linha ANTIGA e o `with check` só a NOVA — não dá para
-- comparar as duas dentro da regra. Quem compara é um gatilho.
--
-- COMO FUNCIONA: antes de gravar, se quem está editando não for admin,
-- os campos administrativos voltam ao valor que já estavam. O aluno
-- continua editando telefone e e-mail normalmente; a alteração de cargo,
-- turma, plano e situação simplesmente não tem efeito.
--
-- Pode rodar quantas vezes quiser.
-- =====================================================================

create or replace function public.protege_campos_do_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- admin pode tudo
  if public.is_admin() then
    return new;
  end if;

  -- os demais não alteram o que é decisão do professor
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
