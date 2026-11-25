-- Fluir | Fundacao Supabase (somente SQL versionado; nao aplicado em producao).
-- Esta migration exige um projeto Supabase com Auth e Storage habilitados.
-- Nao transforma nem apaga usuarios do Spring. O vinculo legado e privilegiado.
begin;

create schema if not exists fluir_internal;
revoke all on schema fluir_internal from public, anon, authenticated;

create table public.fluir_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Pessoa' check (char_length(trim(display_name)) between 1 and 100),
  nickname text check (nickname is null or char_length(nickname) <= 100),
  avatar_path text,
  communication_tone text not null default 'calmo'
    check (communication_tone in ('calmo','direto','motivador','neutro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.fluir_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  app_role text not null default 'user' check (app_role in ('user','admin')),
  created_at timestamptz not null default now()
);
create table public.fluir_identity_links (
  auth_user_id uuid primary key references auth.users(id) on delete cascade,
  legacy_usuario_id integer not null unique references public.usuarios(id) on delete restrict,
  verified_at timestamptz not null default now(),
  verification_method text not null
    check (verification_method in ('legacy_password','admin_review','verified_import'))
);

create table public.fluir_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed boolean not null default false,
  payload jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 131072),
  updated_at timestamptz not null default now()
);

create table public.fluir_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 150),
  description text not null default '' check (char_length(description) <= 500),
  category text not null default '' check (char_length(category) <= 100),
  priority text not null default '' check (char_length(priority) <= 30),
  completed boolean not null default false,
  task_date date,
  time_label text check (time_label is null or char_length(time_label) <= 30),
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes between 0 and 1440),
  energy text check (energy is null or char_length(energy) <= 30),
  source text not null default 'manual' check (source in ('manual','onboarding-first')),
  legacy_tarefa_id integer unique references public.tarefas(id) on delete set null,
  client_key uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_key)
);
create index fluir_tasks_user_date_idx on public.fluir_tasks(user_id, task_date desc, created_at desc);
create unique index fluir_tasks_one_first_idx on public.fluir_tasks(user_id)
  where source = 'onboarding-first';

create table public.fluir_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 150),
  category text not null default '',
  weekly_frequency smallint check (weekly_frequency is null or weekly_frequency between 1 and 7),
  preferred_time text check (preferred_time is null or char_length(preferred_time) <= 40),
  source text not null default 'manual' check (source in ('manual','onboarding-first')),
  legacy_habito_id integer unique references public.habitos(id) on delete set null,
  created_at timestamptz not null default now()
);
create index fluir_habits_user_idx on public.fluir_habits(user_id, created_at desc);
create unique index fluir_habits_one_first_idx on public.fluir_habits(user_id)
  where source = 'onboarding-first';

-- Ponte de transicao para registros locais. Arquivos binarios nunca entram no JSON.
-- Modulos sensiveis terao tabelas especificas nas proximas fases de migracao.
create table public.fluir_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null check (module in (
    'water','sleep','diary','finances','nutrition','physicalHealth',
    'menstrualCycle','attachments','achievements','timeline','mood','energy'
  )),
  record_date date not null,
  payload jsonb not null
    check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 262144),
  client_key uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_key)
);
create index fluir_records_user_module_date_idx
  on public.fluir_records(user_id, module, record_date desc);

-- Perfil e papel sao criados pelo gatilho do Auth. user_metadata influencia
-- apenas display_name; nunca fornece app_role ou permissoes.
create function fluir_internal.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.fluir_profiles(user_id, display_name)
  values (
    new.id,
    left(coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Pessoa'
    ), 100)
  )
  on conflict (user_id) do nothing;

  insert into public.fluir_roles(user_id, app_role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function fluir_internal.handle_new_user() from public, anon, authenticated;
create trigger fluir_auth_user_created
  after insert on auth.users
  for each row execute function fluir_internal.handle_new_user();

-- Nao conceder escrita de papel ou vinculo legado ao navegador.
revoke all on public.fluir_profiles, public.fluir_roles, public.fluir_identity_links,
  public.fluir_onboarding, public.fluir_tasks, public.fluir_habits, public.fluir_records
  from public, anon, authenticated;
grant select, update on public.fluir_profiles to authenticated;
grant select on public.fluir_roles, public.fluir_identity_links to authenticated;
grant select, insert, update on public.fluir_onboarding to authenticated;
grant select, insert, update, delete on public.fluir_tasks,
  public.fluir_habits, public.fluir_records to authenticated;
grant all on public.fluir_profiles, public.fluir_roles, public.fluir_identity_links,
  public.fluir_onboarding, public.fluir_tasks, public.fluir_habits, public.fluir_records
  to service_role;

alter table public.fluir_profiles enable row level security;
alter table public.fluir_roles enable row level security;
alter table public.fluir_identity_links enable row level security;
alter table public.fluir_onboarding enable row level security;
alter table public.fluir_tasks enable row level security;
alter table public.fluir_habits enable row level security;
alter table public.fluir_records enable row level security;

create policy fluir_profiles_select on public.fluir_profiles for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_profiles_update on public.fluir_profiles for update
  to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy fluir_roles_select on public.fluir_roles for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_links_select on public.fluir_identity_links for select
  to authenticated using (auth_user_id = (select auth.uid()));

create policy fluir_onboarding_select on public.fluir_onboarding for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_onboarding_insert on public.fluir_onboarding for insert
  to authenticated with check (user_id = (select auth.uid()));
create policy fluir_onboarding_update on public.fluir_onboarding for update
  to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy fluir_tasks_select on public.fluir_tasks for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_tasks_insert on public.fluir_tasks for insert
  to authenticated with check (user_id = (select auth.uid()));
create policy fluir_tasks_update on public.fluir_tasks for update
  to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy fluir_tasks_delete on public.fluir_tasks for delete
  to authenticated using (user_id = (select auth.uid()));

create policy fluir_habits_select on public.fluir_habits for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_habits_insert on public.fluir_habits for insert
  to authenticated with check (user_id = (select auth.uid()));
create policy fluir_habits_update on public.fluir_habits for update
  to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy fluir_habits_delete on public.fluir_habits for delete
  to authenticated using (user_id = (select auth.uid()));

create policy fluir_records_select on public.fluir_records for select
  to authenticated using (user_id = (select auth.uid()));
create policy fluir_records_insert on public.fluir_records for insert
  to authenticated with check (user_id = (select auth.uid()));
create policy fluir_records_update on public.fluir_records for update
  to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy fluir_records_delete on public.fluir_records for delete
  to authenticated using (user_id = (select auth.uid()));

-- Onboarding e primeira tarefa/habito gravados atomicamente.
-- SECURITY INVOKER: nao contorna RLS.
create function public.fluir_complete_onboarding(p_payload jsonb)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  uid uuid := auth.uid();
  first_title text;
  first_habit text;
  weekly smallint;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object'
     or octet_length(p_payload::text) > 131072 then
    raise exception 'invalid onboarding payload' using errcode = '22023';
  end if;
  insert into public.fluir_onboarding(user_id, completed, payload, updated_at)
  values(uid, true, p_payload, now())
  on conflict (user_id) do update
    set completed = true, payload = excluded.payload, updated_at = now();

  first_title := left(trim(p_payload #>> '{primeiraTarefa,titulo}'), 150);
  if first_title is not null and first_title <> '' then
    insert into public.fluir_tasks(user_id,title,source)
    values(uid,first_title,'onboarding-first')
    on conflict do nothing;
  end if;
  first_habit := left(trim(p_payload #>> '{primeiroHabito,titulo}'), 150);
  if first_habit is not null and first_habit <> '' then
    weekly := case
      when (p_payload #>> '{primeiroHabito,frequenciaSemanal}') ~ '^[1-7]$'
      then (p_payload #>> '{primeiroHabito,frequenciaSemanal}')::smallint
      else 7 end;
    insert into public.fluir_habits(user_id,title,weekly_frequency,source)
    values(uid,first_habit,weekly,'onboarding-first')
    on conflict do nothing;
  end if;
  return true;
end;
$$;
revoke all on function public.fluir_complete_onboarding(jsonb) from public, anon;
grant execute on function public.fluir_complete_onboarding(jsonb) to authenticated;

-- Buckets privados: por usuario, nunca arquivos binarios em localStorage.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values
 ('fluir-avatars','fluir-avatars',false,2097152,array['image/jpeg','image/png','image/webp']),
 ('fluir-attachments','fluir-attachments',false,10485760,array[
  'image/jpeg','image/png','image/webp','application/pdf','text/plain'
 ])
on conflict (id) do nothing;

create policy fluir_avatars_read on storage.objects for select to authenticated
  using (bucket_id = 'fluir-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_avatars_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'fluir-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_avatars_update on storage.objects for update to authenticated
  using (bucket_id = 'fluir-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'fluir-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_avatars_delete on storage.objects for delete to authenticated
  using (bucket_id = 'fluir-avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy fluir_attachments_read on storage.objects for select to authenticated
  using (bucket_id = 'fluir-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_attachments_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'fluir-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_attachments_update on storage.objects for update to authenticated
  using (bucket_id = 'fluir-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'fluir-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy fluir_attachments_delete on storage.objects for delete to authenticated
  using (bucket_id = 'fluir-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Limite atomicamente aplicado para chamadas ao Gemini. Sem acesso de escrita do cliente.
create table public.fluir_ai_quota (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started timestamptz not null default now(),
  used integer not null default 0 check (used between 0 and 5)
);
revoke all on public.fluir_ai_quota from public, anon, authenticated;
grant select on public.fluir_ai_quota to authenticated;
grant all on public.fluir_ai_quota to service_role;
alter table public.fluir_ai_quota enable row level security;
create policy fluir_ai_quota_select on public.fluir_ai_quota
  for select to authenticated using (user_id = (select auth.uid()));

-- Executa com privilegio elevado apenas para atualizar a contagem do proprio auth.uid().
-- Sem parametros de user_id e sem acesso a dados de outros usuarios.
create function public.fluir_ai_reserve_call()
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  accepted boolean;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  insert into public.fluir_ai_quota(user_id, window_started, used)
  values (uid, clock_timestamp(), 1)
  on conflict (user_id) do update
    set used = case
        when public.fluir_ai_quota.window_started < clock_timestamp() - interval '1 minute'
        then 1 else public.fluir_ai_quota.used + 1 end,
      window_started = case
        when public.fluir_ai_quota.window_started < clock_timestamp() - interval '1 minute'
        then clock_timestamp() else public.fluir_ai_quota.window_started end
    where public.fluir_ai_quota.window_started < clock_timestamp() - interval '1 minute'
       or public.fluir_ai_quota.used < 5
  returning true into accepted;
  return coalesce(accepted, false);
end;
$$;
revoke all on function public.fluir_ai_reserve_call() from public, anon;
grant execute on function public.fluir_ai_reserve_call() to authenticated;

commit;
