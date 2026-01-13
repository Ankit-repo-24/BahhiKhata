--
-- PostgreSQL database schema (Neon compatible)
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Extension: pgcrypto
--
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

--
-- Table: expense_types
--
CREATE TABLE public.expense_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.expense_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.expense_types_id_seq OWNED BY public.expense_types.id;

ALTER TABLE ONLY public.expense_types
    ALTER COLUMN id SET DEFAULT nextval('public.expense_types_id_seq'::regclass);

ALTER TABLE ONLY public.expense_types
    ADD CONSTRAINT expense_types_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.expense_types
    ADD CONSTRAINT expense_types_name_key UNIQUE (name);

--
-- Table: users
--
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

--
-- Table: expenses
--
CREATE TABLE public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    amount numeric(10,2) NOT NULL CHECK (amount > 0),
    category text NOT NULL,
    expense_date date NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    expense_type_id integer NOT NULL
);

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);

CREATE INDEX idx_expenses_type ON public.expenses (expense_type_id);

--
-- Foreign Keys
--
ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT fk_expense_type
    FOREIGN KEY (expense_type_id)
    REFERENCES public.expense_types(id)
    ON DELETE RESTRICT;
