-- Keep customer names to 80 characters. Longer names are cut instead of refused,
-- so a long name never makes sign up fail.
update public.profiles
set name = left(name, 80)
where length(name) > 80;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, left(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 80));
  return new;
end;
$$;
