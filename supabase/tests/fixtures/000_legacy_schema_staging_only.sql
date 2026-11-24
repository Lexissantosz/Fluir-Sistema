-- Fixture de schema legado para banco Supabase staging VAZIO.
-- NUNCA executar no projeto Supabase de producao.
-- Sem hashes, tokens ou usuarios reais.
-- Ajustada para validar FK e autorizacao, nao substitui Flyway Java.
begin;
create table if not exists public.usuarios (
  id integer generated always as identity primary key,
  email text not null unique,
  nome text not null,
  senha text not null default 'FICTICIO_NAO_UTILIZAVEL'
);
create table if not exists public.tarefas (
  id integer generated always as identity primary key,
  usuario_id integer not null references public.usuarios(id) on delete cascade,
  titulo text not null
);
create table if not exists public.habitos (
  id integer generated always as identity primary key,
  usuario_id integer not null references public.usuarios(id) on delete cascade,
  titulo text not null
);
create table if not exists public.sessoes_login (
  token_hash text primary key,
  usuario_id integer not null references public.usuarios(id) on delete cascade
);
create table if not exists public.flyway_schema_history (
  installed_rank integer primary key,
  version text,
  description text
);
create table if not exists public.assistente_registros (
  id bigint generated always as identity primary key,
  usuario_id integer not null references public.usuarios(id) on delete cascade,
  tarefa_id integer references public.tarefas(id) on delete set null
);

do $staging$
declare tab text;
begin
  foreach tab in array array[
    'perfis_usuario', 'modulos_usuario', 'preferencias_agua', 'preferencias_alimentacao',
    'preferencias_anexos', 'preferencias_ciclo_menstrual', 'preferencias_diario',
    'preferencias_financas', 'preferencias_habitos', 'preferencias_saude_fisica',
    'preferencias_sono', 'preferencias_tarefas'
  ]
  loop
    execute format(
      'create table if not exists public.%I (id integer generated always as identity primary key, usuario_id integer not null unique references public.usuarios(id) on delete cascade)',
      tab
    );
  end loop;
end;
$staging$;
commit;
