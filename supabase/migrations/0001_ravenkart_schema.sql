-- Ravenkart Supabase schema (initial)
-- Requires: Postgres (Supabase), auth.users

-- Extensions
create extension if not exists "pgcrypto";

-- Utility: enum-like constraints
create domain plan_type as text check (value in ('free','pro','enterprise'));
create domain subscription_status as text check (value in ('active','past_due','canceled','trialing'));
create domain theme_mode as text check (value in ('light','dark'));
create domain qr_mode as text check (value in ('full','minimal'));
create domain social_platform as text check (
  value in (
    'linkedin','x','instagram','tiktok','youtube','facebook','snapchat','telegram','pinterest','whatsapp'
  )
);
create domain member_role as text check (value in ('owner','admin','member'));
create domain user_role as text check (value in ('user','admin','super_admin'));

-- Helper tables and functions for role-based access
create table if not exists public.super_admin_emails (
  email text primary key
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.mark_super_admin_on_signup()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- If email is listed as super admin, upsert role
  if exists (select 1 from public.super_admin_emails e where lower(e.email) = lower(new.email)) then
    insert into public.user_roles(user_id, role)
    values (new.id, 'super_admin')
    on conflict (user_id) do update set role = excluded.role, updated_at = now();
  else
    insert into public.user_roles(user_id, role)
    values (new.id, 'user')
    on conflict (user_id) do nothing;
  end if;
  return new;
end
$$;

drop trigger if exists trg_mark_super_admin_on_signup on auth.users;
create trigger trg_mark_super_admin_on_signup
after insert on auth.users
for each row execute function public.mark_super_admin_on_signup();

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(ur.role in ('admin','super_admin'), false) from public.user_roles ur where ur.user_id = check_user_id;
$$;

create or replace function public.is_super_admin(check_user_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(ur.role = 'super_admin', false) from public.user_roles ur where ur.user_id = check_user_id;
$$;

-- Paid access helper
create or replace function public.has_paid_access(check_user_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select
    exists (
      select 1
      from public.subscriptions s
      where s.user_id = check_user_id
        and s.plan in ('pro')
        and s.status in ('active','trialing')
        and coalesce(s.current_period_end, now() + interval '100 years') > now()
    )
    or exists (
      select 1
      from public.subscriptions s
      join public.organization_members om on om.organization_id = s.organization_id
      where om.user_id = check_user_id
        and s.plan = 'enterprise'
        and s.status in ('active','trialing')
        and coalesce(s.current_period_end, now() + interval '100 years') > now()
    );
$$;

-- Profiles and settings
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  title text,
  company text,
  phone text,
  email text,
  website text,
  language_preference text not null default 'tr', -- default Turkish
  theme theme_mode not null default 'light',
  gradient_style text,
  gradient_start_color text,
  gradient_end_color text,
  slug text unique,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  crop jsonb,
  scale numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.company_logos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  platform social_platform not null,
  username text not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, platform)
);

-- QR Codes
create table if not exists public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  mode qr_mode not null,
  payload text not null, -- data encoded by the QR
  image_url text,        -- optional stored image (svg/png)
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Projects & Products
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  title text,
  link text,
  short_info text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Scan statistics for QR views
create table if not exists public.qr_scans (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  qr_code_id uuid references public.qr_codes (id) on delete set null,
  scanned_at timestamptz not null default now(),
  client_info jsonb -- user agent, ip (hashed), etc.
);

-- Card Scanner & Gallery (for admins and paid users)
create table if not exists public.scanner_folders (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scanner_cards (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  folder_id uuid references public.scanner_folders (id) on delete set null,
  image_url text not null,
  cropped_area jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- Organizations (Enterprise)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid not null references public.profiles (user_id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (user_id) on delete cascade,
  role member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

-- Subscriptions (user-level or organization-level)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (user_id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete cascade,
  plan plan_type not null,
  status subscription_status not null default 'active',
  seats integer,
  auto_renew boolean not null default true,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (plan = 'enterprise' and organization_id is not null) or (plan in ('free','pro') and user_id is not null)
  )
);

-- Admin features: bulk upload history and activity logs
create table if not exists public.admin_uploads (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.profiles (user_id) on delete cascade,
  template_file_url text,
  uploaded_at timestamptz not null default now(),
  user_count integer not null default 0,
  status text not null default 'processed'
);

create table if not exists public.admin_activities (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references public.profiles (user_id) on delete cascade,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Timestamps maintenance
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions
for each row execute function public.touch_updated_at();

-- RLS
alter table public.super_admin_emails enable row level security;
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.company_logos enable row level security;
alter table public.social_links enable row level security;
alter table public.qr_codes enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.qr_scans enable row level security;
alter table public.scanner_folders enable row level security;
alter table public.scanner_cards enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_uploads enable row level security;
alter table public.admin_activities enable row level security;

-- Policies
-- super_admin_emails: read-only to super_admins; insert/update/delete only by super_admins
create policy "super_admin_emails_read_super" on public.super_admin_emails
  for select using (public.is_super_admin(auth.uid()));
create policy "super_admin_emails_modify_super" on public.super_admin_emails
  for all using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));

-- user_roles: users can read their role; super_admin can read/modify all; admins can read all
create policy "user_roles_read_self" on public.user_roles
  for select using (user_id = auth.uid());
create policy "user_roles_read_admin" on public.user_roles
  for select using (public.is_admin(auth.uid()));
create policy "user_roles_modify_super" on public.user_roles
  for all using (public.is_super_admin(auth.uid())) with check (public.is_super_admin(auth.uid()));

-- profiles
create policy "profiles_read_own" on public.profiles for select using (user_id = auth.uid());
create policy "profiles_read_public" on public.profiles for select using (is_public = true);
create policy "profiles_update_own" on public.profiles for update using (user_id = auth.uid());
create policy "profiles_insert_self" on public.profiles for insert with check (user_id = auth.uid());
create policy "profiles_admin_all" on public.profiles for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- media and related by owner
create policy "photos_read_public" on public.profile_photos for select using (
  exists(select 1 from public.profiles pr where pr.user_id = profile_photos.user_id and pr.is_public = true)
);
create policy "photos_owner_all" on public.profile_photos for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "photos_admin_all" on public.profile_photos for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "logos_read_public" on public.company_logos for select using (
  exists(select 1 from public.profiles pr where pr.user_id = company_logos.user_id and pr.is_public = true)
);
create policy "logos_owner_all" on public.company_logos for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "logos_admin_all" on public.company_logos for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "social_links_read_public" on public.social_links for select using (
  exists(select 1 from public.profiles pr where pr.user_id = social_links.user_id and pr.is_public = true)
);
create policy "social_links_owner_all" on public.social_links for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "social_links_admin_all" on public.social_links for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "qr_codes_read_public" on public.qr_codes for select using (
  exists(select 1 from public.profiles pr where pr.user_id = qr_codes.user_id and pr.is_public = true)
);
create policy "qr_codes_owner_all" on public.qr_codes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "qr_codes_admin_all" on public.qr_codes for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "projects_read_public" on public.projects for select using (
  exists(select 1 from public.profiles pr where pr.user_id = projects.user_id and pr.is_public = true)
);
create policy "projects_owner_all" on public.projects for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "projects_admin_all" on public.projects for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "project_images_read_public" on public.project_images for select using (
  exists(select 1 from public.projects p join public.profiles pr on pr.user_id = p.user_id where p.id = project_id and pr.is_public = true)
);
create policy "project_images_owner_all" on public.project_images for all using (
  exists(select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
) with check (
  exists(select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
);
create policy "project_images_admin_all" on public.project_images for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- scans: owner can read scans; insert allowed by anon (public-facing) disabled; allow authenticated to insert with owner mapping in app using rpc or service role
create policy "qr_scans_owner_read" on public.qr_scans for select using (owner_user_id = auth.uid());
create policy "qr_scans_admin_read" on public.qr_scans for select using (public.is_admin(auth.uid()));

-- scanner folders/cards by owner
create policy "scanner_folders_owner_paid_all" on public.scanner_folders for all using (
  owner_user_id = auth.uid() and public.has_paid_access(auth.uid())
) with check (
  owner_user_id = auth.uid() and public.has_paid_access(auth.uid())
);
create policy "scanner_cards_owner_paid_all" on public.scanner_cards for all using (
  owner_user_id = auth.uid() and public.has_paid_access(auth.uid())
) with check (
  owner_user_id = auth.uid() and public.has_paid_access(auth.uid())
);
create policy "scanner_folders_admin_all" on public.scanner_folders for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "scanner_cards_admin_all" on public.scanner_cards for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- organizations and members
create policy "orgs_owner_admin_read" on public.organizations for select using (
  owner_user_id = auth.uid() or exists (
    select 1 from public.organization_members m where m.organization_id = id and m.user_id = auth.uid()
  ) or public.is_admin(auth.uid())
);
create policy "orgs_owner_admin_modify" on public.organizations for all using (
  owner_user_id = auth.uid() or public.is_admin(auth.uid())
) with check (
  owner_user_id = auth.uid() or public.is_admin(auth.uid())
);

create policy "org_members_read" on public.organization_members for select using (
  user_id = auth.uid() or public.is_admin(auth.uid()) or exists (
    select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = auth.uid()
  )
);
create policy "org_members_modify_owner_admin" on public.organization_members for all using (
  public.is_admin(auth.uid()) or exists (
    select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = auth.uid()
  )
) with check (
  public.is_admin(auth.uid()) or exists (
    select 1 from public.organizations o where o.id = organization_id and o.owner_user_id = auth.uid()
  )
);

-- subscriptions
create policy "subs_read_self_org" on public.subscriptions for select using (
  user_id = auth.uid() or public.is_admin(auth.uid()) or exists (
    select 1 from public.organization_members m where m.organization_id = subscriptions.organization_id and m.user_id = auth.uid()
  )
);
create policy "subs_modify_admin_owner" on public.subscriptions for all using (
  public.is_admin(auth.uid()) or user_id = auth.uid() or exists (
    select 1 from public.organizations o where o.id = subscriptions.organization_id and o.owner_user_id = auth.uid()
  )
) with check (
  public.is_admin(auth.uid()) or user_id = auth.uid() or exists (
    select 1 from public.organizations o where o.id = subscriptions.organization_id and o.owner_user_id = auth.uid()
  )
);

-- admin uploads & activities (admins and super admins)
create policy "admin_uploads_read_admin" on public.admin_uploads for select using (public.is_admin(auth.uid()) or admin_user_id = auth.uid());
create policy "admin_uploads_modify_admin" on public.admin_uploads for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "admin_activities_read_admin" on public.admin_activities for select using (public.is_admin(auth.uid()));
create policy "admin_activities_insert_admin" on public.admin_activities for insert with check (public.is_admin(auth.uid()));

-- Seeds
insert into public.super_admin_emails(email) values
  ('1erkinyagci@gmail.com')
on conflict do nothing;

insert into public.super_admin_emails(email) values
  ('1efeyagci@gmail.com')
on conflict do nothing;

