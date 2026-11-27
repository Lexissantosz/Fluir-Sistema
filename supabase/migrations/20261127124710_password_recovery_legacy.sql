-- Password recovery for the legacy API. Never expose tokens or hashes via Data API.
begin;
create table public.fluir_password_recovery (
  usuario_id integer primary key references public.usuarios(id) on delete cascade,
  code_hash text not null check (code_hash ~ '^[0-9a-f]{64}$'),
  requested_at timestamptz not null default clock_timestamp(),
  expires_at timestamptz not null,
  used_at timestamptz
);
alter table public.fluir_password_recovery enable row level security;
revoke all on public.fluir_password_recovery from public,anon,authenticated;
grant select,insert,update,delete on public.fluir_password_recovery to service_role;
create function public.fluir_password_recovery_issue(p_email text,p_hash text)
returns boolean language plpgsql set search_path='' as $$
declare uid integer; accepted boolean;
begin
  if p_hash !~ '^[0-9a-f]{64}$' then return false; end if;
  select u.id into uid from public.usuarios u where u.email=p_email
    and not exists(select 1 from public.fluir_identity_links l where l.legacy_usuario_id=u.id)
    for update;
  if uid is null then return false; end if;
  insert into public.fluir_password_recovery(usuario_id,code_hash,requested_at,expires_at,used_at)
  values(uid,p_hash,clock_timestamp(),clock_timestamp()+interval '15 minutes',null)
  on conflict(usuario_id) do update set code_hash=excluded.code_hash,requested_at=excluded.requested_at,
    expires_at=excluded.expires_at,used_at=null
    where public.fluir_password_recovery.requested_at <= clock_timestamp()-interval '90 seconds'
  returning true into accepted;
  return coalesce(accepted,false);
end;
$$;
create function public.fluir_password_recovery_consume(p_email text,p_hash text,p_password_hash text)
returns boolean language plpgsql set search_path='' as $$
declare uid integer; accepted boolean;
begin
  if p_hash !~ '^[0-9a-f]{64}$' or length(p_password_hash)<>60 or left(p_password_hash,4) not in ('$2a$','$2b$','$2y$') then return false; end if;
  select u.id into uid from public.usuarios u where u.email=p_email
    and not exists(select 1 from public.fluir_identity_links l where l.legacy_usuario_id=u.id)
    for update;
  if uid is null then return false; end if;
  update public.fluir_password_recovery set used_at=clock_timestamp()
    where usuario_id=uid and code_hash=p_hash and used_at is null and expires_at>clock_timestamp()
    returning true into accepted;
  if accepted is distinct from true then return false; end if;
  update public.usuarios set senha=p_password_hash where id=uid;
  delete from public.sessoes_login where usuario_id=uid;
  return true;
end;
$$;
revoke all on function public.fluir_password_recovery_issue(text,text) from public,anon,authenticated;
revoke all on function public.fluir_password_recovery_consume(text,text,text) from public,anon,authenticated;
grant execute on function public.fluir_password_recovery_issue(text,text) to service_role;
grant execute on function public.fluir_password_recovery_consume(text,text,text) to service_role;
commit;
