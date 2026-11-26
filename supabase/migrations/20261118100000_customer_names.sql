-- Customer name on profiles, given at sign up, so the store owner sees a name instead of an email.
-- Store owners already read their customers profiles ("Store owners can view their customers profiles").
alter table public.profiles add column name text;

-- Names already given at sign up
update public.profiles p
set name = nullif(trim(u.raw_user_meta_data ->> 'name'), '')
from auth.users u
where u.id = p.id;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, nullif(trim(new.raw_user_meta_data ->> 'name'), ''));
  return new;
end;
$$;
