-- Applied on Supabase production at version 20261125191453.
-- Legacy account-compatible data remains protected from browser roles.
begin;
create table if not exists public.fluir_legacy_onboarding_json (
  usuario_id integer primary key references public.usuarios(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload)='object' and octet_length(payload::text)<=131072),
  atualizado_em timestamptz not null default now()
);
alter table public.fluir_legacy_onboarding_json enable row level security;
revoke all on public.fluir_legacy_onboarding_json from public, anon, authenticated;
grant all on public.fluir_legacy_onboarding_json to service_role;
create table if not exists public.fluir_legacy_login_throttle (
  key_hash text primary key check(length(key_hash)=64),
  started_at timestamptz not null default now(),
  attempts integer not null default 0 check(attempts between 0 and 12)
);
alter table public.fluir_legacy_login_throttle enable row level security;
revoke all on public.fluir_legacy_login_throttle from public, anon, authenticated;
grant all on public.fluir_legacy_login_throttle to service_role;
create or replace function public.fluir_legacy_login_reserve(p_key_hash text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare accepted boolean;
begin
 if p_key_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid key'; end if;
 insert into public.fluir_legacy_login_throttle(key_hash,started_at,attempts)
 values(p_key_hash,clock_timestamp(),1)
 on conflict(key_hash) do update set
  attempts=case when public.fluir_legacy_login_throttle.started_at < clock_timestamp()-interval '15 minutes'
    then 1 else public.fluir_legacy_login_throttle.attempts+1 end,
  started_at=case when public.fluir_legacy_login_throttle.started_at < clock_timestamp()-interval '15 minutes'
    then clock_timestamp() else public.fluir_legacy_login_throttle.started_at end
 where public.fluir_legacy_login_throttle.started_at < clock_timestamp()-interval '15 minutes'
   or public.fluir_legacy_login_throttle.attempts < 12
 returning true into accepted;
 return coalesce(accepted,false);
end;
$$;
revoke all on function public.fluir_legacy_login_reserve(text) from public,anon,authenticated;
grant execute on function public.fluir_legacy_login_reserve(text) to service_role;
commit;
