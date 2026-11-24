-- Fluir | Contencao da exposicao do banco legado pelo Data API.
-- NUNCA aplicar automaticamente em producao antes de backup, revisao e aprovacao.
-- Banco atual: 19 usuarios legados, 0 usuarios Supabase Auth em 24/11/2026.
-- O backend Spring usa acesso de servidor; clientes do Supabase usam anon/authenticated.
-- Sem vinculos verificados, as tabelas legadas ficam inacessiveis pelo Data API.
begin;

-- Credenciais antigas, hashes de sessao e metadados Flyway NAO sao APIs de navegador.
revoke all privileges on table
  public.usuarios,
  public.sessoes_login,
  public.flyway_schema_history
from public, anon, authenticated;
grant all privileges on table
  public.usuarios,
  public.sessoes_login,
  public.flyway_schema_history
to service_role;

alter table public.usuarios enable row level security;
alter table public.sessoes_login enable row level security;
alter table public.flyway_schema_history enable row level security;

-- Tabelas com usuario_id integer mantem esquema e dados do Spring.
-- O acesso via Supabase usa exclusivamente o vinculo de identidade
-- criado APOS verificacao do titular por processo privilegiado.
-- O usuario nunca pode criar o proprio vinculo.
do $fluir$
declare
  tablename text;
  owner_expr text :=
    'exists (
       select 1 from public.fluir_identity_links link
       where link.auth_user_id = (select auth.uid())
         and link.legacy_usuario_id = usuario_id
     )';
begin
  foreach tablename in array array[
    'habitos', 'tarefas', 'perfis_usuario', 'modulos_usuario',
    'preferencias_agua', 'preferencias_tarefas', 'preferencias_habitos',
    'preferencias_sono', 'preferencias_financas', 'preferencias_diario',
    'preferencias_alimentacao', 'preferencias_saude_fisica',
    'preferencias_ciclo_menstrual', 'preferencias_anexos',
    'assistente_registros'
  ]
  loop
    execute format('revoke all privileges on table public.%I from public, anon, authenticated', tablename);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', tablename);
    execute format('grant all privileges on table public.%I to service_role', tablename);
    execute format('alter table public.%I enable row level security', tablename);

    execute format(
      'create policy fluir_legacy_select on public.%I
         for select to authenticated using (%s)',
      tablename, owner_expr
    );
    execute format(
      'create policy fluir_legacy_insert on public.%I
         for insert to authenticated with check (%s)',
      tablename, owner_expr
    );
    execute format(
      'create policy fluir_legacy_update on public.%I
         for update to authenticated using (%s) with check (%s)',
      tablename, owner_expr, owner_expr
    );
    execute format(
      'create policy fluir_legacy_delete on public.%I
         for delete to authenticated using (%s)',
      tablename, owner_expr
    );
  end loop;
end;
$fluir$;

-- Remover direitos anonimos sobre sequencias legadas.
-- USAGE de authenticated continua necessario para inserts autorizados via RLS.
revoke all privileges on all sequences in schema public from anon;
grant usage, select on all sequences in schema public to authenticated, service_role;

-- Nenhum DROP, TRUNCATE ou UPDATE de dados foi incluido.
-- Nao e seguro iniciar vinculo de identidade apenas pela igualdade de e-mail;
-- exige verificacao de titularidade e bloqueio de conta ja vinculada.
commit;
