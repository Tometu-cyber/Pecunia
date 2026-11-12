-- Thème sombre par défaut pour les nouveaux profils (aligné sur le layout, qui est sombre sans cookie).
alter table public.profiles alter column theme set default 'dark';
