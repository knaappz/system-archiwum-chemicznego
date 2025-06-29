BEGIN;

-- TWORZENIE GŁÓWNEJ TABELI Z PRÓBKAMI --
CREATE TABLE IF NOT EXISTS public.archiwum_tb (
    id serial PRIMARY KEY,
    grupa text,
    nazwa text,
    wydzial text,
    nr_partii text,
    nr_analizy numeric,
    okres text,
    data_archiwizacji date,
    data_waznosci date,
    ilosc text,
    lokalizacja text,
    dostepnosc boolean,
    uwagi text
);

-- TWORZENIE TABELI PRACOWNIKÓW --
CREATE TABLE IF NOT EXISTS public.pracownicy_tb (
    id serial PRIMARY KEY,
    imie varchar(100),
    nazwisko varchar(100),
    email varchar(255) NOT NULL UNIQUE,
    haslo text NOT NULL,
    rola text
);

-- TWORZENIE TABELI SUROWCÓW --
CREATE TABLE IF NOT EXISTS public.surowce_tb (
    id serial PRIMARY KEY,
    nazwa varchar(255) NOT NULL,
    wydzial varchar(255) NOT NULL
);

-- TWORZENIE TABELI WYROBÓW --
CREATE TABLE IF NOT EXISTS public.wyroby_tb (
    id serial PRIMARY KEY,
    nazwa varchar(255) NOT NULL,
    wydzial varchar(255) NOT NULL
);

-- TWORZENIE KONTA GŁÓWNEGO ADMINA PRZY STARCIE --
INSERT INTO
    public.pracownicy_tb (
        imie,
        nazwisko,
        email,
        haslo,
        rola
    )
VALUES (
        'admin',
        'admin',
        'admin@admin.pl',
        'archiwum',
        'admin'
    ) ON CONFLICT (email) DO NOTHING;

COMMIT;