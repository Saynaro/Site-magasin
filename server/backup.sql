--
-- PostgreSQL database dump
--

\restrict QN1TvwzCo99dSsfICaFK8wntUflcMsmcKMEBmo7zcYT1zeIfNMVF1Yc8ySPFleH

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: khalid
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO khalid;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: khalid
--

COMMENT ON SCHEMA public IS '';


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: khalid
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO khalid;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: khalid
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO khalid;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banner; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public."Banner" (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    "imageUrl" character varying(512) NOT NULL,
    link character varying(255),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Banner" OWNER TO khalid;

--
-- Name: Banner_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public."Banner_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Banner_id_seq" OWNER TO khalid;

--
-- Name: Banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public."Banner_id_seq" OWNED BY public."Banner".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO khalid;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    variant jsonb
);


ALTER TABLE public.cart_items OWNER TO khalid;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO khalid;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    parent_id integer
);


ALTER TABLE public.categories OWNER TO khalid;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO khalid;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price integer NOT NULL,
    variant jsonb
);


ALTER TABLE public.order_items OWNER TO khalid;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO khalid;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "totalAmount" integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deliveryDate" timestamp(3) without time zone
);


ALTER TABLE public.orders OWNER TO khalid;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO khalid;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.products (
    id text NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    characteristics jsonb,
    description text NOT NULL,
    image character varying(512) NOT NULL,
    images text[],
    "priceCents" integer NOT NULL,
    slug character varying(255) NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    variants jsonb
);


ALTER TABLE public.products OWNER TO khalid;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id text NOT NULL,
    user_id integer NOT NULL,
    stars smallint NOT NULL,
    text text NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reviews OWNER TO khalid;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO khalid;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: khalid
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(50) NOT NULL,
    surname character varying(50) NOT NULL,
    avatar character varying(512),
    adresse character varying(255),
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO khalid;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: khalid
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO khalid;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: khalid
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Banner id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public."Banner" ALTER COLUMN id SET DEFAULT nextval('public."Banner_id_seq"'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public."Banner" (id, title, "imageUrl", link, "isActive", "createdAt") FROM stdin;
1	Promo 20% sur les MacBooks	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200	/product.html?id=101	t	2026-03-25 13:33:25.596
2	Nouveaux Macarons Artisanaux	https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=1200	/product.html?id=201	t	2026-03-25 13:33:25.598
3	Macaron sales!	https://example.com/images/banner1.jpg	/category/pasta	t	2026-03-25 19:12:36.442
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
660dc188-aa3a-4cf0-9778-d664bf2ea9d7	7f507b9644b195387014c54be312aeb60a049d40fd060637ef27b52518251bf6	2026-03-24 16:58:37.43808+00	20260322181756_init_shop	\N	\N	2026-03-24 16:58:37.422461+00	1
fec105c0-3708-4d5c-923d-12ae4fde568a	44a971c36e7fb07885c912a0ef255bd5903bdca1db3c193fe9dca5cc45866d1f	2026-03-24 16:58:37.441219+00	20260323194951_init	\N	\N	2026-03-24 16:58:37.439007+00	1
bb44e3e7-65e0-46a7-b283-b34a3b58c7f0	364149fe96cdf508792b70af23f526917361ea3c3984bf9ea6bfe5b6d501c3b4	2026-03-24 17:01:07.292023+00	20260324170107_init_new_schema	\N	\N	2026-03-24 17:01:07.231023+00	1
65534067-5372-4d51-bdfb-a327022797ac	795bfb1b34d77cb3a861b44c0c0b0b4bc2e9a1f83153b5b017a8a8048a22ec31	2026-03-25 14:08:03.358159+00	20260325140803_add_unique	\N	\N	2026-03-25 14:08:03.339989+00	1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.cart_items (id, user_id, product_id, quantity, variant) FROM stdin;
2	1	1018	1	{"Couleur": "Gris Sidéral", "Stockage": "1 To", "Mémoire RAM": "48 Go"}
59	11	203	1	{}
26	12	cmn68acry000021ud12syyfbr	1	{}
27	12	203	1	{}
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.categories (id, name, parent_id) FROM stdin;
1	Electronics	\N
2	macbook	1
3	casque audio	1
4	Food	\N
5	macarons	4
6	café	4
7	Clothing	\N
8	t-shirt	7
9	veste en jean	7
10	montre	1
11	miel	4
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.order_items (id, order_id, product_id, quantity, price, variant) FROM stdin;
1	1	1018	1	349900	{"Couleur": "Gris Sidéral", "Stockage": "1 To", "Mémoire RAM": "48 Go"}
2	2	cmn68acry000021ud12syyfbr	3	99987	{}
3	3	202	2	1590	{}
4	4	203	2	1250	{"Type": "Acacia", "Volume": "500 g"}
5	5	103	1	24900	{}
6	5	102	1	39900	{"Couleur": "Noir", "Réduction de bruit": "Mode ambiance"}
7	5	203	1	1250	{"Type": "Fleurs sauvages", "Volume": "250 g"}
8	5	201	1	2450	{}
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.orders (id, user_id, status, "totalAmount", created_at, "deliveryDate") FROM stdin;
1	11	SHIPPED	349900	2026-03-25 18:44:32	\N
2	11	PAID	299961	2026-03-25 23:05:43	\N
3	11	DELIVERED	3180	2026-03-25 23:18:53	\N
4	13	PAID	2500	2026-03-26 20:01:27	\N
5	13	CANCELLED	68500	2026-03-26 20:22:14	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.products (id, name, category_id, created_at, characteristics, description, image, images, "priceCents", slug, updated_at, variants) FROM stdin;
101	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.512	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-101	2026-03-25 13:33:25.512	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1012	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.52	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1012	2026-03-25 13:33:25.52	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1013	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.521	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1013	2026-03-25 13:33:25.521	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
302	Veste en Jean Denim Vintage	7	2026-03-25 13:33:25.538	[{"label": "Matière", "value": "100% coton denim"}, {"label": "Style", "value": "Vintage / Délavé"}, {"label": "Fermeture", "value": "Boutons en métal"}, {"label": "Poches", "value": "4 (2 avant, 2 poitrine)"}, {"label": "Couleur", "value": "Bleu Indigo Délavé"}, {"label": "Lavage", "value": "40°C, retourner avant lavage"}, {"label": "Origine", "value": "Fabriqué en Turquie"}]	Veste robuste et stylée pour l'automne. Aspect délavé unique avec coutures renforcées. Un véritable classique de la mode urbaine.	https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800}	5900	veste-en-jean-denim-vintage	2026-03-26 20:45:24.608	[{"type": "text", "label": "Taille", "options": [{"value": "S"}, {"value": "M"}, {"value": "L"}, {"value": "XL"}]}, {"type": "color", "label": "Couleur", "options": [{"color": "#4a6fa5", "value": "Bleu délavé"}, {"color": "#1a1a1a", "value": "Noir"}]}]
1014	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.523	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1014	2026-03-25 13:33:25.523	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1015	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.525	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1015	2026-03-25 13:33:25.525	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1016	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.526	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1016	2026-03-25 13:33:25.526	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1017	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.527	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-1017	2026-03-25 13:33:25.527	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
103	Montre Connectée Sport Pro	10	2026-03-25 13:33:25.54	[{"label": "Écran", "value": "OLED circulaire 1.4\\""}, {"label": "GPS", "value": "Intégré"}, {"label": "Étanchéité", "value": "50 m (5ATM)"}, {"label": "Autonomie", "value": "Jusqu'à 14 jours"}, {"label": "Capteurs", "value": "FC, SpO2, Altimètre, Baromètre"}, {"label": "Sports", "value": "+100 modes sportifs"}, {"label": "Compatibilité", "value": "iOS 14+ / Android 8+"}, {"label": "Poids", "value": "38 g (sans bracelet)"}]	Suivez vos performances sportives et votre santé. Écran OLED circulaire, GPS intégré, étanche jusqu'à 50 mètres. Jusqu'à 14 jours de batterie.	https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800}	24900	montre-connecte-sport-pro-103	2026-03-25 13:33:25.54	[{"type": "color", "label": "Couleur bracelet", "options": [{"color": "#1a1a1a", "value": "Noir"}, {"color": "#1e3a5f", "value": "Bleu Nuit"}, {"color": "#e07060", "value": "Corail"}]}, {"type": "text", "label": "Taille de boîtier", "options": [{"value": "42 mm"}, {"value": "46 mm"}]}]
102	Casque Audio Sony WH-1000XM5	3	2026-03-25 13:33:25.53	[{"label": "Réduction de bruit", "value": "Active (ANC)"}, {"label": "Autonomie", "value": "30h (ANC activé)"}, {"label": "Connexion", "value": "Bluetooth 5.2 / Jack 3.5mm"}, {"label": "Codec", "value": "LDAC, AAC, SBC"}, {"label": "Poids", "value": "250 g"}, {"label": "Pliable", "value": "Oui"}, {"label": "Microphone", "value": "Intégré (8 micros)"}, {"label": "Garantie", "value": "1 an constructeur"}]	Le meilleur casque à réduction de bruit du marché. Plongez dans votre musique avec un confort inégalé et un son Hi-Res spectaculaire.	https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800}	39900	casque-audio-sony-wh-1000xm5-102	2026-03-25 13:33:25.53	[{"type": "color", "label": "Couleur", "options": [{"color": "#1a1a1a", "value": "Noir"}, {"color": "#b0a090", "value": "Platine"}]}, {"type": "text", "label": "Réduction de bruit", "options": [{"value": "ANC Actif"}, {"value": "Mode ambiance"}]}]
201	Assortiment de Macarons Français	5	2026-03-25 13:33:25.532	[{"label": "Contenu", "value": "12 macarons variés"}, {"label": "Saveurs", "value": "Framboise, Pistache, Chocolat, Vanille, Citron, Caramel"}, {"label": "Poids net", "value": "200 g"}, {"label": "Conservation", "value": "5 jours au réfrigérateur"}, {"label": "Allergènes", "value": "Œufs, fruits à coques, gluten"}, {"label": "Origine", "value": "Fabriqué en France (Paris)"}, {"label": "Sans conservateurs", "value": "Oui"}]	Coffret premium de 12 macarons artisanaux : Framboise, Pistache, Chocolat, Vanille, Citron et Caramel beurre salé. Authentique recette de Paris.	https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800}	2450	assortiment-de-macarons-franais-201	2026-03-25 13:33:25.532	[{"type": "text", "label": "Quantité", "options": [{"value": "12 pièces"}, {"value": "24 pièces"}, {"value": "36 pièces"}]}, {"type": "text", "label": "Saveurs", "options": [{"value": "Assortiment"}, {"value": "Fruits rouges"}, {"value": "Chocolat"}]}]
202	Café Grains Torréfaction Italienne	6	2026-03-25 13:33:25.534	[{"label": "Type de café", "value": "Pur Arabica"}, {"label": "Origine", "value": "Mélange Italie / Éthiopie"}, {"label": "Torréfaction", "value": "Italienne (intense)"}, {"label": "Notes", "value": "Cacao, Noisette"}, {"label": "Format", "value": "Grains entiers"}, {"label": "Poids", "value": "1 kg"}, {"label": "Intensité", "value": "9/10"}, {"label": "Compatible", "value": "Machine espresso, Cafetière filtre"}]	Sachet de 1kg pur Arabica. Parfait pour les machines à expresso, riche en arômes avec des notes intenses de cacao et noisette.	https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800}	1590	caf-grains-torrfaction-italienne-202	2026-03-25 13:33:25.534	[{"type": "text", "label": "Volume", "options": [{"value": "500 g"}, {"value": "1 kg"}, {"value": "2 kg"}]}, {"type": "text", "label": "Mouture", "options": [{"value": "Grains entiers"}, {"value": "Mouture fine"}, {"value": "Mouture moyenne"}]}]
1018	MacBook Pro 16" M3 Max2	2	2026-03-25 13:33:25.528	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max2	2026-03-26 18:59:44.958	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
203	Miel de Montagne Artisanal	11	2026-03-25 13:33:25.542	[{"label": "Type", "value": "Miel de fleurs sauvages"}, {"label": "Origine", "value": "Alpes françaises (Hautes-Alpes)"}, {"label": "Poids", "value": "500 g"}, {"label": "Récolte", "value": "Manuelle / Artisanale"}, {"label": "Pasteurisé", "value": "Non"}, {"label": "Additifs", "value": "Aucun – 100% naturel"}, {"label": "Conservation", "value": "2 ans dans un endroit frais et sec"}, {"label": "Certifié Bio", "value": "Oui"}]	Pot de 500g de miel de fleurs sauvages. Récolté dans les Alpes de haute montagne. Saveur riche, 100% naturel sans additifs.	https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80	{https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80}	1250	miel-de-montagne-artisanal-203	2026-03-25 13:33:25.542	[{"type": "text", "label": "Volume", "options": [{"value": "250 g"}, {"value": "500 g"}, {"value": "1 kg"}]}, {"type": "text", "label": "Type", "options": [{"value": "Fleurs sauvages"}, {"value": "Acacia"}, {"value": "Lavande"}]}]
cmn7xtpg400008jud777iikw5	Iphone 17	1	2026-03-26 20:41:20.403	[]	Iphone 17	https://image2url.com/r2/default/images/1774557586975-44b4b0c3-1a5f-41e8-99ef-cad1d2d45edd.webp	{}	89999	iphone-17	2026-03-26 20:44:57.974	[]
301	T-Shirt Basique en Coton Bio	8	2026-03-25 13:33:25.536	[{"label": "Matière", "value": "100% coton biologique"}, {"label": "Coupe", "value": "Regular / Droite"}, {"label": "Couleur", "value": "Blanc"}, {"label": "Certification", "value": "GOTS (Textile Biologique)"}, {"label": "Lavage", "value": "30°C, ne pas sécher au sèche-linge"}, {"label": "Origine", "value": "Fabriqué au Portugal"}, {"label": "Emballage", "value": "Emballage recyclé"}]	T-Shirt blanc intemporel. Coupe droite, 100% coton biologique très doux. Fabriqué de manière éthique, le vêtement essentiel par excellence.	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800}	2000	t-shirt-basique-en-coton-bio	2026-03-25 21:50:23.025	[{"type": "text", "label": "Taille", "options": [{"value": "XS"}, {"value": "S"}, {"value": "M"}, {"value": "L"}, {"value": "XL"}]}, {"type": "color", "label": "Couleur", "options": [{"color": "#f5f5f5", "value": "Blanc"}, {"color": "#1a1a1a", "value": "Noir"}, {"color": "#888", "value": "Gris"}]}]
cmn68acry000021ud12syyfbr	Apple iPhone 17 Pro	1	2026-03-25 15:58:40.942	[]	256GB, Blue Titanium	https://image2url.com/r2/default/images/1774474072046-0754ac8c-ebb3-4942-9eb0-b0117f9f79d8.png	{}	99998	apple-iphone-17-pro	2026-03-26 20:38:39.554	[]
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.reviews (id, product_id, user_id, stars, text, created_at) FROM stdin;
1	101	3	5	Machine exceptionnelle, la puissance de la puce M3 Max est au rendez-vous !	2026-01-10 00:00:00
2	101	4	4	Très rapide, mais le prix reste un peu excessif pour un usage non professionnel.	2026-01-22 00:00:00
3	101	5	5	L'autonomie de la batterie est bluffante, je le recharge tous les 2 jours.	2026-02-05 00:00:00
4	101	6	5	Qualité d'écran inégalable. Parfait pour le montage vidéo XDR.	2026-02-17 00:00:00
5	101	7	4	Un peu lourd à transporter comparer au Macbook Air, mais la puissance compense.	2026-03-01 00:00:00
6	102	8	5	Réduction de bruit absolument magique dans les transports en commun.	2025-12-15 00:00:00
7	102	9	5	Qualité de fabrication superbe, et très confortable sur les oreilles.	2026-01-08 00:00:00
8	102	10	4	Excellent casque, mais l'étui de transport ne se plie plus comme la version précédente.	2026-01-30 00:00:00
9	102	3	5	Basses profondes et claires sans dénaturer la musique.	2026-02-12 00:00:00
10	102	4	3	Le micro pour les appels téléphoniques attrape un peu trop le vent dehors.	2026-03-05 00:00:00
11	103	5	5	Très précise pour le running et le vélo. Application compagnon super intuitive.	2026-01-14 00:00:00
12	103	6	4	Design élégant et sportif. Se raye facilement si on ne fait pas attention.	2026-01-27 00:00:00
13	103	7	5	Autonomie de folie, tient facile 2 semaines sans GPS activé!	2026-02-09 00:00:00
14	103	8	4	Dommage que toutes les applications tierces ne soient pas compatibles.	2026-02-22 00:00:00
15	103	9	5	Le suivi du sommeil est extrêmement précis et utile.	2026-03-10 00:00:00
16	201	10	5	Délicieux! Ils fondent dans la bouche avec une ganache parfaite.	2025-12-20 00:00:00
17	201	3	5	Parfait pour offrir. Emballage très soigné et macarons intacts à l'arrivée.	2026-01-05 00:00:00
18	201	4	4	Le goût pistache manque un peu de puissance, mais caramel beurre salé est divin.	2026-01-19 00:00:00
19	201	5	4	Un peu cher pour 12 macarons mais la qualité artisanale se sent tout de suite.	2026-02-03 00:00:00
20	201	6	5	Une tuerie internationale !	2026-03-08 00:00:00
21	202	7	5	Très bon café corsé ! Parfait pour l'espresso du matin.	2025-11-10 00:00:00
22	202	8	3	Grains un peu trop gras à mon goût pour ma machine broyeur.	2025-12-01 00:00:00
23	202	9	4	Arôme noisette/cacao subtile, très agréable sans amertume.	2026-01-15 00:00:00
24	202	10	5	Rapport qualité/prix imbattable pour de la torréfaction italienne locale.	2026-02-08 00:00:00
25	202	3	5	Déjà ma 5ème commande et toujours une qualité constante.	2026-03-12 00:00:00
26	203	4	5	Le meilleur miel naturel que j'ai pu goûter depuis mon enfance.	2025-10-20 00:00:00
27	203	5	5	Un parfum floral incroyable, idéal sur des tartines beurrées !	2025-11-15 00:00:00
28	203	6	4	Cristallise un peu vite, mais cela prouve qu'il est vraiment brut et sans additif.	2025-12-10 00:00:00
29	203	7	5	Texture onctueuse, on ressent vraiment les fleurs de montagne.	2026-01-18 00:00:00
30	203	8	5	Pot en verre très qualitatif, je recommande fortement.	2026-02-25 00:00:00
31	301	9	4	Coton de bonne facture et épais, mais attention ça taille un peu large.	2025-12-05 00:00:00
32	301	10	5	Idéal et basique. Se porte avec tout, très confortable et responsable.	2026-01-12 00:00:00
33	301	3	5	A survécu à 20 lavages sans se déformer ni boulocher. Excellent produit.	2026-01-28 00:00:00
34	301	4	4	Manches légèrement trop courtes pour les grands gabarits.	2026-02-14 00:00:00
35	301	5	5	Doux au contact de la peau, le coton bio change tout.	2026-03-05 00:00:00
36	302	6	5	Magnifique teinte vintage, le délavage rend super bien en vrai.	2025-11-20 00:00:00
37	302	7	4	La veste est bien lourde, on sent que la toile denim est solide.	2025-12-18 00:00:00
38	302	8	3	Boutons un peu durs à attacher les premiers jours.	2026-01-09 00:00:00
39	302	9	5	Un classique indémodable, se rajoute parfaitement au dessus d'un hoodie.	2026-02-01 00:00:00
40	302	10	5	Qualité au top, très chaude pour l'automne/printemps.	2026-03-15 00:00:00
41	1018	11	5	Этот макбук быстрее, чем мои мысли!	2026-03-25 19:01:49
42	203	13	5	Good product	2026-03-26 19:20:25
43	203	13	5	5 stars	2026-03-26 19:20:47
44	cmn68acry000021ud12syyfbr	13	5	iphone 15	2026-03-26 19:42:58
45	203	13	5	hello	2026-03-26 19:51:03
46	201	13	5	test	2026-03-26 20:12:04
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.users (id, email, password, name, surname, avatar, adresse, role, created_at) FROM stdin;
1	khalid@gmail.com	$2b$10$cWVYepBYq8jnJ2y7N3/guOkHhFqV6sKG535Gfk3l.GkaS1CEWvQcC	Khalid	Sainaro	\N	\N	USER	2026-03-24 18:35:15
3	lucas.u1@example.com	hashedpassword123	Lucas	M.	https://i.pravatar.cc/48?img=1	\N	USER	2026-03-25 13:33:26
4	sophie.u2@example.com	hashedpassword123	Sophie	B.	https://i.pravatar.cc/48?img=5	\N	USER	2026-03-25 13:33:26
5	antoine.u3@example.com	hashedpassword123	Antoine	R.	https://i.pravatar.cc/48?img=12	\N	USER	2026-03-25 13:33:26
6	camille.u4@example.com	hashedpassword123	Camille	D.	https://i.pravatar.cc/48?img=47	\N	USER	2026-03-25 13:33:26
7	nicolas.u5@example.com	hashedpassword123	Nicolas	P.	https://i.pravatar.cc/48?img=33	\N	USER	2026-03-25 13:33:26
8	julie.u6@example.com	hashedpassword123	Julie	F.	https://i.pravatar.cc/48?img=9	\N	USER	2026-03-25 13:33:26
9	thomas.u7@example.com	hashedpassword123	Thomas	G.	https://i.pravatar.cc/48?img=15	\N	USER	2026-03-25 13:33:26
10	emma.u8@example.com	hashedpassword123	Emma	L.	https://i.pravatar.cc/48?img=44	\N	USER	2026-03-25 13:33:26
2	khalid.cizdoev777@gmail.com	$2b$10$dz3RHHF/7mV6te3UsYao/uZITluQCNrMGx2Vs.N6XUtsGaRuqYVmC	Khalid	Sainaro	\N	\N	ADMIN	2026-03-24 18:39:36
11	khalidsainaro@gmail.com	$2b$10$IbWSC6.gfKkIV75ba.I9FupphkjXQK4R5At1IJP5i.kb8628ZNv2.	Khalid	Sainaro	\N	\N	ADMIN	2026-03-25 15:34:16
12	testuser2@example.com	$2b$10$DEaQ.U2jozYYlV7lV76ngu9bRM9p8GFigxFAEgLmHY8Wc9K3OTwqe	Test	User	\N	\N	USER	2026-03-25 22:17:53
13	user@gmail.com	$2b$10$uDh33FpPTcbmiIOUcB0xEOyzp/Rv4mYmI5oHIdfXp3sefOQYToANi	Users	Test	\N	\N	USER	2026-03-26 19:06:01
\.


--
-- Name: Banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public."Banner_id_seq"', 3, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 59, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.categories_id_seq', 11, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.order_items_id_seq', 8, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.orders_id_seq', 5, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.reviews_id_seq', 46, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items_user_id_product_id_key; Type: INDEX; Schema: public; Owner: khalid
--

CREATE UNIQUE INDEX cart_items_user_id_product_id_key ON public.cart_items USING btree (user_id, product_id);


--
-- Name: categories_name_key; Type: INDEX; Schema: public; Owner: khalid
--

CREATE UNIQUE INDEX categories_name_key ON public.categories USING btree (name);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: khalid
--

CREATE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: khalid
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: khalid
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: khalid
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: khalid
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict QN1TvwzCo99dSsfICaFK8wntUflcMsmcKMEBmo7zcYT1zeIfNMVF1Yc8ySPFleH

