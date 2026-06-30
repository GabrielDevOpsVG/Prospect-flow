-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CAMPAIGNS TABLE
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  niche text,
  city text,
  state text,
  radius integer,
  channel text,
  status text default 'Rascunho',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COMPANIES TABLE
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade not null,
  name text not null,
  segment text,
  website text,
  phone text,
  email text,
  instagram text,
  linkedin text,
  address text,
  city text,
  state text,
  source text,
  validation_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONTACTS TABLE
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  role text,
  email text,
  phone text,
  linkedin text,
  confidence_score integer default 0,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADS TABLE (CRM)
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade not null,
  company_id uuid references companies(id) on delete cascade not null,
  contact_id uuid references contacts(id) on delete set null,
  status text default 'Novo', -- Novo, Validado, Mensagem preparada, Contatado, Respondeu, Interessado, Reunião marcada, Perdido
  notes text,
  last_interaction timestamp with time zone,
  next_action timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES TABLE
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade not null,
  lead_id uuid references leads(id) on delete cascade not null,
  channel text,
  subject text,
  body text,
  status text default 'pending',
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEMPLATES TABLE
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  channel text,
  tone text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INTEGRATIONS TABLE
create table if not exists integrations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  provider text not null,
  api_key_encrypted text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUDIT LOGS TABLE
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Habilitar RLS em todas as tabelas
alter table users enable row level security;
alter table campaigns enable row level security;
alter table companies enable row level security;
alter table contacts enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;
alter table templates enable row level security;
alter table integrations enable row level security;
alter table audit_logs enable row level security;

-- USERS: Usuário só pode ver/atualizar o próprio registro
create policy "Users can view own profile" on users for select using (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- Trigger para criar perfil de usuário automaticamente ao se registrar no Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CAMPAIGNS: Somente dono pode CRUD
create policy "Users can manage own campaigns" on campaigns for all using (auth.uid() = user_id);

-- COMPANIES: Só pode ver se a campanha for dele
create policy "Users can manage own companies" on companies for all using (
  campaign_id in (select id from campaigns where user_id = auth.uid())
);

-- CONTACTS: Só pode ver se a companhia for dele (via campanha)
create policy "Users can manage own contacts" on contacts for all using (
  company_id in (
    select id from companies where campaign_id in (select id from campaigns where user_id = auth.uid())
  )
);

-- LEADS: Só pode ver se a campanha for dele
create policy "Users can manage own leads" on leads for all using (
  campaign_id in (select id from campaigns where user_id = auth.uid())
);

-- MESSAGES: Só pode ver se a campanha for dele
create policy "Users can manage own messages" on messages for all using (
  campaign_id in (select id from campaigns where user_id = auth.uid())
);

-- TEMPLATES: Somente dono pode CRUD
create policy "Users can manage own templates" on templates for all using (auth.uid() = user_id);

-- INTEGRATIONS: Somente dono pode CRUD
create policy "Users can manage own integrations" on integrations for all using (auth.uid() = user_id);

-- AUDIT LOGS: Apenas leitura e inserção controlada pelo backend
create policy "Users can view own audit logs" on audit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own audit logs" on audit_logs for insert with check (auth.uid() = user_id);
