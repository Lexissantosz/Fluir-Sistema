-- Executar somente em banco local/staging com migrations Fluir aplicadas.
-- pgTAP: npx supabase test db (nao rodar em producao).
begin;

select plan(20);

select has_table('public', 'fluir_profiles', 'perfis novos existem');
select has_table('public', 'fluir_tasks', 'tarefas novas existem');
select has_table('public', 'fluir_habits', 'habitos novos existem');
select has_table('public', 'fluir_records', 'registros privados existem');
select has_table('public', 'fluir_onboarding', 'onboarding por uuid existe');
select has_table('public', 'fluir_ai_quota', 'limite de uso da IA por usuario existe');
select has_function('public', 'fluir_complete_onboarding', array['jsonb'],
  'RPC transacional de onboarding existe');

select ok((select relrowsecurity from pg_class where oid = 'public.fluir_profiles'::regclass),
  'RLS nos perfis');
select ok((select relrowsecurity from pg_class where oid = 'public.fluir_roles'::regclass),
  'RLS nos papeis');
select ok((select relrowsecurity from pg_class where oid = 'public.fluir_tasks'::regclass),
  'RLS nas tarefas');
select ok((select relrowsecurity from pg_class where oid = 'public.fluir_records'::regclass),
  'RLS nos registros');

select ok(not has_table_privilege('anon', 'public.usuarios', 'SELECT'),
  'usuario e hash legado nao ficam publicos');
select ok(not has_table_privilege('anon', 'public.sessoes_login', 'SELECT'),
  'hash de sessoes legado nao fica publico');
select ok(not has_table_privilege('authenticated', 'public.fluir_roles', 'UPDATE'),
  'usuario comum nao pode elevar papel');

-- Testes de isolamento, transacao revertida ao final.
insert into auth.users(id) values
  ('00000000-0000-0000-0000-000000009991'),
  ('00000000-0000-0000-0000-000000009992');

insert into public.fluir_tasks(user_id, title)
values ('00000000-0000-0000-0000-000000009992', 'Somente da conta B');

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000009991',true);

select is((select count(*)::int from public.fluir_profiles), 1,
  'A ve somente seu perfil');
select is((select count(*)::int from public.fluir_profiles
    where user_id = '00000000-0000-0000-0000-000000009992'), 0,
  'A nao pode ler perfil de B');
select is((select count(*)::int from public.fluir_tasks
    where user_id = '00000000-0000-0000-0000-000000009992'), 0,
  'A nao pode ler tarefa de B');
select is((select count(*)::int from generate_series(1,5)
    where public.fluir_ai_reserve_call()), 5,
  'cinco chamadas de IA podem ser reservadas');
select ok(not public.fluir_ai_reserve_call(),
  'sexta chamada de IA bloqueada no mesmo minuto');
-- A insercao com usuario_id da conta B deve falhar por RLS.
select throws_ok(
  $$ insert into public.fluir_tasks(user_id,title)
       values ('00000000-0000-0000-0000-000000009992','Tentativa proibida') $$
);

reset role;
select * from finish();
rollback;
