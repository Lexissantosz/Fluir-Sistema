-- Aplicada previamente no Supabase remoto em 2026-11-24, migration version 20261124213356.
-- Esta copia permite reproduzir o estado seguro em ambientes de teste.
-- Nenhum dado legado foi alterado nem excluido.
begin;
do $fluir_security$
declare t text;
begin
  foreach t in array array[
    'assistente_registros', 'flyway_schema_history',
    'habitos','modulos_usuario','perfis_usuario',
    'preferencias_agua','preferencias_alimentacao','preferencias_anexos',
    'preferencias_ciclo_menstrual','preferencias_diario','preferencias_financas',
    'preferencias_habitos','preferencias_saude_fisica','preferencias_sono',
    'preferencias_tarefas','sessoes_login','tarefas','usuarios'
  ]
  loop
    execute format('revoke all privileges on table public.%I from public, anon, authenticated', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$fluir_security$;
revoke all privileges on all sequences in schema public from public, anon, authenticated;
commit;
