-- =====================================================================
-- Site dos PETs USP: banco de dados no Supabase (SPEC §7.3)
-- Como usar: no painel do Supabase, abra "SQL Editor", cole este arquivo
-- inteiro e clique em "Run". Rode só uma vez, num projeto novo.
--
-- Ajustes em relação ao rascunho da SPEC (revisão):
--  * funções e policies com o schema "public." escrito por extenso;
--  * a policy de update também tem "with check" (o CEPET não pode mover
--    um pedido para um estado que ele mesmo não poderia ver);
--  * o PET não pode criar pedido já com resposta preenchida;
--  * índices para as consultas mais comuns.
-- =====================================================================

-- ---------- Tabelas ----------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text not null,
  perfil text not null check (perfil in ('pet','cepet')),
  pet_slug text,                        -- obrigatório quando perfil = 'pet'
  created_at timestamptz default now(),
  check (perfil = 'cepet' or pet_slug is not null)
);

create table public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  pet_slug text not null,
  autor_id uuid not null references auth.users,
  tipo text not null,
  secao text not null,
  titulo text not null check (char_length(titulo) <= 120),
  descricao text not null,
  anexos jsonb not null default '[]',   -- [{ path, nome, tipo, tamanho }]
  status text not null default 'pendente'
    check (status in ('pendente','em_andamento','concluido','recusado')),
  resposta text,
  historico jsonb not null default '[]', -- [{ status, em, por }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index solicitacoes_pet_slug_idx on public.solicitacoes (pet_slug);
create index solicitacoes_created_at_idx on public.solicitacoes (created_at desc);

-- ---------- Funções auxiliares para as regras de acesso ----------
-- "security definer" deixa a função ler "profiles" sem cair na própria RLS.

create function public.meu_perfil() returns text language sql stable security definer
  set search_path = public as $$ select perfil from public.profiles where id = auth.uid() $$;

create function public.meu_pet() returns text language sql stable security definer
  set search_path = public as $$ select pet_slug from public.profiles where id = auth.uid() $$;

-- ---------- Regras de acesso (RLS) ----------

alter table public.profiles enable row level security;
alter table public.solicitacoes enable row level security;

create policy "ver o próprio perfil" on public.profiles for select
  using (id = auth.uid() or public.meu_perfil() = 'cepet');

create policy "PET vê os seus; CEPET vê todos" on public.solicitacoes for select
  using (pet_slug = public.meu_pet() or public.meu_perfil() = 'cepet');

create policy "PET cria pedido do próprio PET" on public.solicitacoes for insert
  with check (public.meu_perfil() = 'pet' and pet_slug = public.meu_pet()
              and autor_id = auth.uid() and status = 'pendente' and resposta is null);

create policy "só CEPET atualiza" on public.solicitacoes for update
  using (public.meu_perfil() = 'cepet')
  with check (public.meu_perfil() = 'cepet');

-- ---------- Storage: bucket privado "anexos" ----------
-- Caminho dos arquivos: "<pet_slug>/<id_pedido>/<arquivo>"

insert into storage.buckets (id, name, public) values ('anexos', 'anexos', false);

create policy "PET envia anexos do próprio PET" on storage.objects for insert
  with check (bucket_id = 'anexos' and (storage.foldername(name))[1] = public.meu_pet());

create policy "ler anexos" on storage.objects for select
  using (bucket_id = 'anexos'
         and ((storage.foldername(name))[1] = public.meu_pet() or public.meu_perfil() = 'cepet'));

-- =====================================================================
-- Criando as contas (o cadastro público fica desligado):
-- 1. Authentication → Sign In / Providers → desligue "Allow new users to sign up".
-- 2. Authentication → Users → "Add user" (e-mail + senha) para cada PET e
--    para cada membro do CEPETUSP. Copie o "User UID" criado.
-- 3. Crie a linha em "profiles" para cada conta, por exemplo:
--
-- insert into public.profiles (id, nome, perfil, pet_slug) values
--   ('<uid da conta do PET Computação>', 'PET Computação', 'pet', 'computacao'),
--   ('<uid de um membro do CEPETUSP>',   'Fulano (CEPETUSP)', 'cepet', null);
--
-- O pet_slug precisa ser igual ao slug do arquivo em src/content/pets/.
-- =====================================================================
