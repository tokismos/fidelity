-- Local only: lets the app's test mode spin the prize wheel without the 3 day wait (see spin_wheel)
insert into public.app_settings (key, value) values ('test_spins', 'on');
