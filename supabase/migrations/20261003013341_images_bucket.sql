insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "Admins can upload images"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (
  bucket_id = 'images'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'::role
  )
);
