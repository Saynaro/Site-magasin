--
-- PostgreSQL database dump
--

\restrict Psh6TARMWgFLj2F2RCAW6n3HntX6nBc5fjGebYIzrO5hLR6zCEBugaQy2ZXeLwX

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
6	Promo 20% sur les MacBooks	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200	/product.html?id=101	t	2026-03-27 14:16:06.054
7	Nouveaux Macarons Artisanaux	https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=1200	/product.html?id=201	t	2026-03-27 14:16:06.054
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
12	smartphone	1
13	shoes	7
14	meal	4
15	headphones	1
16	pants	7
17	tv	1
18	bakery	4
19	hoodie	7
20	laptop	1
21	dessert	4
22	smartwatch	1
23	tshirt	7
24	fastfood	4
25	salad	4
26	speaker	1
27	jacket	7
28	pasta	4
29	camera	1
30	earbuds	1
31	accessories	1
32	snack	4
33	japanese	4
34	hat	7
35	smart_home	1
36	bag	7
37	drink	4
38	furniture	1
39	sport	7
40	gadgets	1
41	shirt	7
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
302	Veste en Jean Denim Vintage	9	2026-03-25 13:33:25.538	[{"label": "Matière", "value": "100% coton denim"}, {"label": "Style", "value": "Vintage / Délavé"}, {"label": "Fermeture", "value": "Boutons en métal"}, {"label": "Poches", "value": "4 (2 avant, 2 poitrine)"}, {"label": "Couleur", "value": "Bleu Indigo Délavé"}, {"label": "Lavage", "value": "40°C, retourner avant lavage"}, {"label": "Origine", "value": "Fabriqué en Turquie"}]	Veste robuste et stylée pour l'automne. Aspect délavé unique avec coutures renforcées. Un véritable classique de la mode urbaine.	https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800}	5900	veste-en-jean-denim-vintage-302	2026-03-27 14:16:06.017	[{"type": "text", "label": "Taille", "options": [{"value": "S"}, {"value": "M"}, {"value": "L"}, {"value": "XL"}]}, {"type": "color", "label": "Couleur", "options": [{"color": "#4a6fa5", "value": "Bleu délavé"}, {"color": "#1a1a1a", "value": "Noir"}]}]
101	MacBook Pro 16" M3 Max	2	2026-03-25 13:33:25.512	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max-101	2026-03-27 14:16:05.934	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
1018	MacBook Pro 16" M3 Max2	2	2026-03-25 13:33:25.528	[{"label": "Processeur", "value": "Apple M3 Max"}, {"label": "RAM", "value": "48 Go"}, {"label": "Stockage", "value": "1 To SSD"}, {"label": "Écran", "value": "16\\" Retina XDR, 3456x2234"}, {"label": "Autonomie", "value": "Jusqu'à 22h"}, {"label": "Poids", "value": "2.14 kg"}, {"label": "Ports", "value": "3x Thunderbolt 4, HDMI, SD"}, {"label": "Garantie", "value": "1 an constructeur"}]	L'ordinateur portable ultime pour les pros. Performances époustouflantes, écran Retina XDR éblouissant, et une autonomie record pour travailler partout sans contrainte.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800}	349900	macbook-pro-16-m3-max2	2026-03-26 18:59:44.958	[{"type": "color", "label": "Couleur", "options": [{"color": "#636366", "value": "Gris Sidéral"}, {"color": "#e0e0e0", "value": "Argent"}]}, {"type": "text", "label": "Mémoire RAM", "options": [{"value": "36 Go"}, {"value": "48 Go"}, {"value": "128 Go"}]}, {"type": "text", "label": "Stockage", "options": [{"value": "512 Go"}, {"value": "1 To"}, {"value": "2 To"}]}]
202	Café Grains Torréfaction Italienne	6	2026-03-25 13:33:25.534	[{"label": "Type de café", "value": "Pur Arabica"}, {"label": "Origine", "value": "Mélange Italie / Éthiopie"}, {"label": "Torréfaction", "value": "Italienne (intense)"}, {"label": "Notes", "value": "Cacao, Noisette"}, {"label": "Format", "value": "Grains entiers"}, {"label": "Poids", "value": "1 kg"}, {"label": "Intensité", "value": "9/10"}, {"label": "Compatible", "value": "Machine espresso, Cafetière filtre"}]	Sachet de 1kg pur Arabica. Parfait pour les machines à expresso, riche en arômes avec des notes intenses de cacao et noisette.	https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=800}	1590	caf-grains-torrfaction-italienne-202	2026-03-27 14:16:06.014	[{"type": "text", "label": "Volume", "options": [{"value": "500 g"}, {"value": "1 kg"}, {"value": "2 kg"}]}, {"type": "text", "label": "Mouture", "options": [{"value": "Grains entiers"}, {"value": "Mouture fine"}, {"value": "Mouture moyenne"}]}]
2009	MacBook Air M2	20	2026-03-27 14:13:31.914	[{"label": "Processeur", "value": "M2"}, {"label": "RAM", "value": "8 Go"}]	Ordinateur portable léger et performant avec puce Apple M2.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800}	129900	macbook-air-m2-2009	2026-03-27 14:16:05.957	[]
2010	Chocolate Donut	21	2026-03-27 14:13:31.917	[{"label": "Saveur", "value": "Chocolat"}]	Donut moelleux nappé de chocolat.	https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800}	299	chocolate-donut-2010	2026-03-27 14:16:05.96	[]
102	Casque Audio Sony WH-1000XM5	3	2026-03-25 13:33:25.53	[{"label": "Réduction de bruit", "value": "Active (ANC)"}, {"label": "Autonomie", "value": "30h (ANC activé)"}, {"label": "Connexion", "value": "Bluetooth 5.2 / Jack 3.5mm"}, {"label": "Codec", "value": "LDAC, AAC, SBC"}, {"label": "Poids", "value": "250 g"}, {"label": "Pliable", "value": "Oui"}, {"label": "Microphone", "value": "Intégré (8 micros)"}, {"label": "Garantie", "value": "1 an constructeur"}]	Le meilleur casque à réduction de bruit du marché. Plongez dans votre musique avec un confort inégalé et un son Hi-Res spectaculaire.	https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800}	39900	casque-audio-sony-wh-1000xm5-102	2026-03-27 14:16:05.962	[{"type": "color", "label": "Couleur", "options": [{"color": "#1a1a1a", "value": "Noir"}, {"color": "#b0a090", "value": "Platine"}]}, {"type": "text", "label": "Réduction de bruit", "options": [{"value": "ANC Actif"}, {"value": "Mode ambiance"}]}]
cmn7xtpg400008jud777iikw5	Iphone 17	1	2026-03-26 20:41:20.403	[]	Iphone 17	https://image2url.com/r2/default/images/1774557586975-44b4b0c3-1a5f-41e8-99ef-cad1d2d45edd.webp	{}	89999	iphone-17	2026-03-26 20:44:57.974	[]
cmn68acry000021ud12syyfbr	Apple iPhone 17 Pro	1	2026-03-25 15:58:40.942	[]	256GB, Blue Titanium	https://image2url.com/r2/default/images/1774474072046-0754ac8c-ebb3-4942-9eb0-b0117f9f79d8.png	{}	99998	apple-iphone-17-pro	2026-03-26 20:38:39.554	[]
2001	iPhone 15 Pro	12	2026-03-27 14:13:31.895	[{"label": "Stockage", "value": "256 Go"}, {"label": "Écran", "value": "6.1 OLED"}, {"label": "Caméra", "value": "48 MP"}]	Smartphone haut de gamme avec un design en titane, des performances ultra rapides et un appareil photo professionnel.	https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800}	119900	iphone-15-pro-2001	2026-03-27 14:16:05.94	[{"type": "color", "label": "Couleur", "options": [{"color": "#1c1c1e", "value": "Noir"}, {"color": "#3a4f7a", "value": "Bleu"}]}]
2002	Nike Air Force 1	13	2026-03-27 14:13:31.9	[{"label": "Matériau", "value": "Cuir"}, {"label": "Semelle", "value": "Caoutchouc"}]	Sneakers iconiques offrant confort et style intemporel.	https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800}	10999	nike-air-force-1-2002	2026-03-27 14:16:05.943	[{"type": "text", "label": "Taille", "options": [{"value": "40"}, {"value": "42"}, {"value": "44"}]}]
2003	Pizza Margherita	14	2026-03-27 14:13:31.902	[{"label": "Poids", "value": "500g"}, {"label": "Calories", "value": "1200 kcal"}]	Pizza classique italienne avec tomate, mozzarella et basilic frais.	https://images.unsplash.com/photo-1601924582975-7e8e7c5d5c68?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1601924582975-7e8e7c5d5c68?auto=format&fit=crop&q=80&w=800}	1299	pizza-margherita-2003	2026-03-27 14:16:05.945	[]
2004	Sony WH-1000XM5	15	2026-03-27 14:13:31.904	[{"label": "Autonomie", "value": "30h"}, {"label": "Bluetooth", "value": "5.2"}]	Casque sans fil avec réduction de bruit exceptionnelle.	https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&q=80&w=800}	39900	sony-wh-1000xm5-2004	2026-03-27 14:16:05.947	[]
2005	Levi’s 501 Jeans	16	2026-03-27 14:13:31.906	[{"label": "Matière", "value": "Denim"}]	Jean classique coupe droite, durable et confortable.	https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1582418702059-97ebafb35d09?auto=format&fit=crop&q=80&w=800}	8999	levis-501-jeans-2005	2026-03-27 14:16:05.949	[]
2006	Samsung 4K Smart TV	17	2026-03-27 14:13:31.908	[{"label": "Taille", "value": "55 pouces"}, {"label": "Résolution", "value": "4K"}]	Télévision 4K avec HDR et Smart TV intégrée.	https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800}	79900	samsung-4k-smart-tv-2006	2026-03-27 14:16:05.951	[]
2007	Croissant au beurre	18	2026-03-27 14:13:31.91	[{"label": "Type", "value": "Beurre"}]	Viennoiserie française croustillante et fondante.	https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800}	199	croissant-au-beurre-2007	2026-03-27 14:16:05.952	[]
2008	Adidas Hoodie	19	2026-03-27 14:13:31.912	[{"label": "Matière", "value": "Coton"}]	Sweat à capuche confortable pour un look casual.	https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800}	5999	adidas-hoodie-2008	2026-03-27 14:16:05.955	[]
2038	Slim Fit Shirt	41	2026-03-27 14:16:06.008	[{"label": "Coupe", "value": "Slim"}]	Chemise élégante coupe slim pour un style moderne.	https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800}	3499	slim-fit-shirt-2038	2026-03-27 14:16:06.008	[]
203	Miel de Montagne Artisanal	11	2026-03-25 13:33:25.542	[{"label": "Type", "value": "Miel de fleurs sauvages"}, {"label": "Origine", "value": "Alpes françaises (Hautes-Alpes)"}, {"label": "Poids", "value": "500 g"}, {"label": "Récolte", "value": "Manuelle / Artisanale"}, {"label": "Pasteurisé", "value": "Non"}, {"label": "Additifs", "value": "Aucun – 100% naturel"}, {"label": "Conservation", "value": "2 ans dans un endroit frais et sec"}, {"label": "Certifié Bio", "value": "Oui"}]	Pot de 500g de miel de fleurs sauvages. Récolté dans les Alpes de haute montagne. Saveur riche, 100% naturel sans additifs.	https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80	{https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80}	1250	miel-de-montagne-artisanal-203	2026-03-27 14:16:06.02	[{"type": "text", "label": "Volume", "options": [{"value": "250 g"}, {"value": "500 g"}, {"value": "1 kg"}]}, {"type": "text", "label": "Type", "options": [{"value": "Fleurs sauvages"}, {"value": "Acacia"}, {"value": "Lavande"}]}]
2012	Oversize T-Shirt	23	2026-03-27 14:13:31.924	[{"label": "Matière", "value": "Coton 100%"}]	T-shirt oversize tendance pour un look streetwear.	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800}	1999	oversize-t-shirt-2012	2026-03-27 14:16:05.968	[{"type": "text", "label": "Taille", "options": [{"value": "S"}, {"value": "M"}, {"value": "L"}]}]
2013	Cheeseburger	24	2026-03-27 14:13:31.926	[{"label": "Calories", "value": "850 kcal"}]	Burger savoureux avec steak, fromage fondu et sauce maison.	https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800}	899	cheeseburger-2013	2026-03-27 14:16:05.97	[]
2014	Dell XPS 13	20	2026-03-27 14:13:31.928	[{"label": "Écran", "value": "13.4 pouces"}, {"label": "RAM", "value": "16 Go"}]	Ultrabook compact avec écran InfinityEdge et performances solides.	https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800}	139900	dell-xps-13-2014	2026-03-27 14:16:05.972	[]
2015	Puma Running Shoes	13	2026-03-27 14:13:31.93	[{"label": "Usage", "value": "Running"}]	Chaussures de running légères avec amorti optimal.	https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=80&w=800}	7999	puma-running-shoes-2015	2026-03-27 14:16:05.974	[{"type": "text", "label": "Taille", "options": [{"value": "41"}, {"value": "42"}, {"value": "43"}]}]
2016	Caesar Salad	25	2026-03-27 14:13:31.932	[{"label": "Calories", "value": "600 kcal"}]	Salade fraîche avec poulet, parmesan et sauce Caesar.	https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800}	1099	caesar-salad-2016	2026-03-27 14:16:05.975	[]
2017	JBL Flip 6	26	2026-03-27 14:13:31.933	[{"label": "Autonomie", "value": "12h"}, {"label": "Étanchéité", "value": "IP67"}]	Enceinte Bluetooth portable avec son puissant et design étanche.	https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=800}	12999	jbl-flip-6-2017	2026-03-27 14:16:05.977	[]
2018	Denim Jacket	27	2026-03-27 14:13:31.934	[{"label": "Matière", "value": "Denim"}]	Veste en jean intemporelle pour toutes les saisons.	https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800}	6999	denim-jacket-2018	2026-03-27 14:16:05.978	[]
2019	Spaghetti Carbonara	28	2026-03-27 14:13:31.936	[{"label": "Origine", "value": "Italie"}]	Pâtes italiennes crémeuses avec lardons et parmesan.	https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?auto=format&fit=crop&q=80&w=800}	1399	spaghetti-carbonara-2019	2026-03-27 14:16:05.98	[]
2020	Canon EOS R50	29	2026-03-27 14:13:31.937	[{"label": "Capteur", "value": "24 MP"}, {"label": "Vidéo", "value": "4K"}]	Appareil photo hybride compact idéal pour photo et vidéo.	https://images.unsplash.com/photo-1519183071298-a2962be96d23?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1519183071298-a2962be96d23?auto=format&fit=crop&q=80&w=800}	89900	canon-eos-r50-2020	2026-03-27 14:16:05.982	[]
103	Montre Connectée Sport Pro	10	2026-03-25 13:33:25.54	[{"label": "Écran", "value": "OLED circulaire 1.4\\""}, {"label": "GPS", "value": "Intégré"}, {"label": "Étanchéité", "value": "50 m (5ATM)"}, {"label": "Autonomie", "value": "Jusqu'à 14 jours"}, {"label": "Capteurs", "value": "FC, SpO2, Altimètre, Baromètre"}, {"label": "Sports", "value": "+100 modes sportifs"}, {"label": "Compatibilité", "value": "iOS 14+ / Android 8+"}, {"label": "Poids", "value": "38 g (sans bracelet)"}]	Suivez vos performances sportives et votre santé. Écran OLED circulaire, GPS intégré, étanche jusqu'à 50 mètres. Jusqu'à 14 jours de batterie.	https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800}	24900	montre-connecte-sport-pro-103	2026-03-27 14:16:06.019	[{"type": "color", "label": "Couleur bracelet", "options": [{"color": "#1a1a1a", "value": "Noir"}, {"color": "#1e3a5f", "value": "Bleu Nuit"}, {"color": "#e07060", "value": "Corail"}]}, {"type": "text", "label": "Taille de boîtier", "options": [{"value": "42 mm"}, {"value": "46 mm"}]}]
2011	Apple Watch Series 9	22	2026-03-27 14:13:31.921	[{"label": "Autonomie", "value": "18h"}, {"label": "Étanchéité", "value": "Oui"}]	Montre connectée avancée avec suivi santé, sport et notifications intelligentes.	https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800}	45900	apple-watch-series-9-2011	2026-03-27 14:16:05.964	[{"type": "text", "label": "Taille", "options": [{"value": "41mm"}, {"value": "45mm"}]}]
2021	AirPods Pro 2	30	2026-03-27 14:16:05.984	[{"label": "Autonomie", "value": "6h"}]	Écouteurs sans fil avec réduction de bruit active et son immersif.	https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=800}	27900	airpods-pro-2-2021	2026-03-27 14:16:05.984	[]
2022	Gaming Mouse RGB	31	2026-03-27 14:16:05.985	[{"label": "DPI", "value": "16000"}]	Souris gaming avec capteur haute précision et éclairage RGB.	https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&q=80&w=800}	4999	gaming-mouse-rgb-2022	2026-03-27 14:16:05.985	[]
2023	Mechanical Keyboard	31	2026-03-27 14:16:05.987	[{"label": "Type", "value": "Mécanique"}]	Clavier mécanique avec switches tactiles pour une frappe précise.	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800}	8999	mechanical-keyboard-2023	2026-03-27 14:16:05.987	[]
2024	Protein Bar Chocolate	32	2026-03-27 14:16:05.989	[{"label": "Protéines", "value": "20g"}]	Barre protéinée au chocolat idéale après le sport.	https://images.unsplash.com/photo-1604908176997-4313e9cfa8f1?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1604908176997-4313e9cfa8f1?auto=format&fit=crop&q=80&w=800}	299	protein-bar-chocolate-2024	2026-03-27 14:16:05.989	[]
2025	Sushi Mix	33	2026-03-27 14:16:05.99	[{"label": "Pièces", "value": "12"}]	Assortiment de sushi frais avec saumon et thon.	https://images.unsplash.com/photo-1562158070-57d5a1e5f7f9?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1562158070-57d5a1e5f7f9?auto=format&fit=crop&q=80&w=800}	1899	sushi-mix-2025	2026-03-27 14:16:05.99	[]
2026	Leather Belt	31	2026-03-27 14:16:05.992	[{"label": "Matière", "value": "Cuir"}]	Ceinture en cuir élégante pour un look classique.	https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800}	2999	leather-belt-2026	2026-03-27 14:16:05.992	[]
2027	Baseball Cap	34	2026-03-27 14:16:05.993	[{"label": "Style", "value": "Casual"}]	Casquette tendance pour compléter votre tenue.	https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=800}	1999	baseball-cap-2027	2026-03-27 14:16:05.993	[]
2028	Winter Scarf	31	2026-03-27 14:16:05.995	[{"label": "Matière", "value": "Laine"}]	Écharpe chaude et douce pour l’hiver.	https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&q=80&w=800}	2499	winter-scarf-2028	2026-03-27 14:16:05.995	[]
2029	Smart LED Bulb	35	2026-03-27 14:16:05.996	[{"label": "Connectivité", "value": "WiFi"}]	Ampoule connectée avec contrôle via smartphone.	https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800}	1999	smart-led-bulb-2029	2026-03-27 14:16:05.996	[]
2030	Backpack Urban	36	2026-03-27 14:16:05.997	[{"label": "Capacité", "value": "20L"}]	Sac à dos moderne pour le quotidien.	https://images.unsplash.com/photo-1509762774605-f07235a08f1f?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1509762774605-f07235a08f1f?auto=format&fit=crop&q=80&w=800}	4999	backpack-urban-2030	2026-03-27 14:16:05.997	[]
2031	Orange Juice Fresh	37	2026-03-27 14:16:05.999	[{"label": "Volume", "value": "500ml"}]	Jus d’orange pressé frais et vitaminé.	https://images.unsplash.com/photo-1577801597644-d86a9e3d5a3b?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1577801597644-d86a9e3d5a3b?auto=format&fit=crop&q=80&w=800}	399	orange-juice-fresh-2031	2026-03-27 14:16:05.999	[]
2032	Espresso Coffee	37	2026-03-27 14:16:06.001	[{"label": "Type", "value": "Arabica"}]	Café espresso intense et aromatique.	https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800}	199	espresso-coffee-2032	2026-03-27 14:16:06.001	[]
2033	Gaming Chair	38	2026-03-27 14:16:06.002	[{"label": "Ergonomie", "value": "Oui"}]	Chaise ergonomique pour longues sessions de jeu.	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800}	199900	gaming-chair-2033	2026-03-27 14:16:06.002	[]
2034	Yoga Mat	39	2026-03-27 14:16:06.003	[{"label": "Épaisseur", "value": "6mm"}]	Tapis de yoga antidérapant et confortable.	https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800}	2999	yoga-mat-2034	2026-03-27 14:16:06.003	[]
2035	Bluetooth Tracker	40	2026-03-27 14:16:06.004	[{"label": "Portée", "value": "50m"}]	Localisez facilement vos objets avec ce tracker Bluetooth.	https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=800}	2499	bluetooth-tracker-2035	2026-03-27 14:16:06.004	[]
2036	Ice Cream Vanilla	21	2026-03-27 14:16:06.006	[{"label": "Saveur", "value": "Vanille"}]	Glace vanille onctueuse et rafraîchissante.	https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=800}	599	ice-cream-vanilla-2036	2026-03-27 14:16:06.006	[]
2037	Wireless Charger Pad	31	2026-03-27 14:16:06.007	[{"label": "Puissance", "value": "15W"}]	Chargeur sans fil rapide pour smartphones compatibles.	https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800}	1999	wireless-charger-pad-2037	2026-03-27 14:16:06.007	[]
2039	Trail Running Shoes	13	2026-03-27 14:16:06.009	[{"label": "Usage", "value": "Trail"}]	Chaussures robustes pour trail et terrains difficiles.	https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800}	11999	trail-running-shoes-2039	2026-03-27 14:16:06.009	[]
2040	Chocolate Cake	21	2026-03-27 14:16:06.011	[{"label": "Portions", "value": "6"}]	Gâteau au chocolat riche et fondant.	https://images.unsplash.com/photo-1605475128023-3b5c1b79d4a1?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1605475128023-3b5c1b79d4a1?auto=format&fit=crop&q=80&w=800}	1599	chocolate-cake-2040	2026-03-27 14:16:06.011	[]
201	Assortiment de Macarons Français	5	2026-03-25 13:33:25.532	[{"label": "Contenu", "value": "12 macarons variés"}, {"label": "Saveurs", "value": "Framboise, Pistache, Chocolat, Vanille, Citron, Caramel"}, {"label": "Poids net", "value": "200 g"}, {"label": "Conservation", "value": "5 jours au réfrigérateur"}, {"label": "Allergènes", "value": "Œufs, fruits à coques, gluten"}, {"label": "Origine", "value": "Fabriqué en France (Paris)"}, {"label": "Sans conservateurs", "value": "Oui"}]	Coffret premium de 12 macarons artisanaux : Framboise, Pistache, Chocolat, Vanille, Citron et Caramel beurre salé. Authentique recette de Paris.	https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800}	2450	assortiment-de-macarons-franais-201	2026-03-27 14:16:06.012	[{"type": "text", "label": "Quantité", "options": [{"value": "12 pièces"}, {"value": "24 pièces"}, {"value": "36 pièces"}]}, {"type": "text", "label": "Saveurs", "options": [{"value": "Assortiment"}, {"value": "Fruits rouges"}, {"value": "Chocolat"}]}]
301	T-Shirt Basique en Coton Bio	8	2026-03-25 13:33:25.536	[{"label": "Matière", "value": "100% coton biologique"}, {"label": "Coupe", "value": "Regular / Droite"}, {"label": "Couleur", "value": "Blanc"}, {"label": "Certification", "value": "GOTS (Textile Biologique)"}, {"label": "Lavage", "value": "30°C, ne pas sécher au sèche-linge"}, {"label": "Origine", "value": "Fabriqué au Portugal"}, {"label": "Emballage", "value": "Emballage recyclé"}]	T-Shirt blanc intemporel. Coupe droite, 100% coton biologique très doux. Fabriqué de manière éthique, le vêtement essentiel par excellence.	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800	{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800}	1999	t-shirt-basique-en-coton-bio-301	2026-03-27 14:16:06.015	[{"type": "text", "label": "Taille", "options": [{"value": "XS"}, {"value": "S"}, {"value": "M"}, {"value": "L"}, {"value": "XL"}]}, {"type": "color", "label": "Couleur", "options": [{"color": "#f5f5f5", "value": "Blanc"}, {"color": "#1a1a1a", "value": "Noir"}, {"color": "#888", "value": "Gris"}]}]
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.reviews (id, product_id, user_id, stars, text, created_at) FROM stdin;
87	101	3	5	Machine exceptionnelle, la puissance de la puce M3 Max est au rendez-vous !	2026-01-10 00:00:00
88	101	4	4	Très rapide, mais le prix reste un peu excessif pour un usage non professionnel.	2026-01-22 00:00:00
89	101	5	5	L'autonomie de la batterie est bluffante, je le recharge tous les 2 jours.	2026-02-05 00:00:00
90	101	6	5	Qualité d'écran inégalable. Parfait pour le montage vidéo XDR.	2026-02-17 00:00:00
91	101	7	4	Un peu lourd à transporter comparer au Macbook Air, mais la puissance compense.	2026-03-01 00:00:00
92	102	8	5	Réduction de bruit absolument magique dans les transports en commun.	2025-12-15 00:00:00
93	102	9	5	Qualité de fabrication superbe, et très confortable sur les oreilles.	2026-01-08 00:00:00
94	102	10	4	Excellent casque, mais l'étui de transport ne se plie plus comme la version précédente.	2026-01-30 00:00:00
95	102	3	5	Basses profondes et claires sans dénaturer la musique.	2026-02-12 00:00:00
96	102	4	3	Le micro pour les appels téléphoniques attrape un peu trop le vent dehors.	2026-03-05 00:00:00
97	103	5	5	Très précise pour le running et le vélo. Application compagnon super intuitive.	2026-01-14 00:00:00
98	103	6	4	Design élégant et sportif. Se raye facilement si on ne fait pas attention.	2026-01-27 00:00:00
99	103	7	5	Autonomie de folie, tient facile 2 semaines sans GPS activé!	2026-02-09 00:00:00
100	103	8	4	Dommage que toutes les applications tierces ne soient pas compatibles.	2026-02-22 00:00:00
101	103	9	5	Le suivi du sommeil est extrêmement précis et utile.	2026-03-10 00:00:00
102	201	10	5	Délicieux! Ils fondent dans la bouche avec une ganache parfaite.	2025-12-20 00:00:00
103	201	3	5	Parfait pour offrir. Emballage très soigné et macarons intacts à l'arrivée.	2026-01-05 00:00:00
104	201	4	4	Le goût pistache manque un peu de puissance, mais caramel beurre salé est divin.	2026-01-19 00:00:00
105	201	5	4	Un peu cher pour 12 macarons mais la qualité artisanale se sent tout de suite.	2026-02-03 00:00:00
106	201	6	5	Une tuerie internationale !	2026-03-08 00:00:00
107	202	7	5	Très bon café corsé ! Parfait pour l'espresso du matin.	2025-11-10 00:00:00
108	202	8	3	Grains un peu trop gras à mon goût pour ma machine broyeur.	2025-12-01 00:00:00
109	202	9	4	Arôme noisette/cacao subtile, très agréable sans amertume.	2026-01-15 00:00:00
110	202	10	5	Rapport qualité/prix imbattable pour de la torréfaction italienne locale.	2026-02-08 00:00:00
111	202	3	5	Déjà ma 5ème commande et toujours une qualité constante.	2026-03-12 00:00:00
112	203	4	5	Le meilleur miel naturel que j'ai pu goûter depuis mon enfance.	2025-10-20 00:00:00
113	203	5	5	Un parfum floral incroyable, idéal sur des tartines beurrées !	2025-11-15 00:00:00
114	203	6	4	Cristallise un peu vite, mais cela prouve qu'il est vraiment brut et sans additif.	2025-12-10 00:00:00
115	203	7	5	Texture onctueuse, on ressent vraiment les fleurs de montagne.	2026-01-18 00:00:00
116	203	8	5	Pot en verre très qualitatif, je recommande fortement.	2026-02-25 00:00:00
117	301	9	4	Coton de bonne facture et épais, mais attention ça taille un peu large.	2025-12-05 00:00:00
118	301	10	5	Idéal et basique. Se porte avec tout, très confortable et responsable.	2026-01-12 00:00:00
119	301	3	5	A survécu à 20 lavages sans se déformer ni boulocher. Excellent produit.	2026-01-28 00:00:00
120	301	4	4	Manches légèrement trop courtes pour les grands gabarits.	2026-02-14 00:00:00
121	301	5	5	Doux au contact de la peau, le coton bio change tout.	2026-03-05 00:00:00
122	302	6	5	Magnifique teinte vintage, le délavage rend super bien en vrai.	2025-11-20 00:00:00
123	302	7	4	La veste est bien lourde, on sent que la toile denim est solide.	2025-12-18 00:00:00
124	302	8	3	Boutons un peu durs à attacher les premiers jours.	2026-01-09 00:00:00
125	302	9	5	Un classique indémodable, se rajoute parfaitement au dessus d'un hoodie.	2026-02-01 00:00:00
126	302	10	5	Qualité au top, très chaude pour l'automne/printemps.	2026-03-15 00:00:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: khalid
--

COPY public.users (id, email, password, name, surname, avatar, adresse, role, created_at) FROM stdin;
1	khalid@gmail.com	$2b$10$cWVYepBYq8jnJ2y7N3/guOkHhFqV6sKG535Gfk3l.GkaS1CEWvQcC	Khalid	Sainaro	\N	\N	USER	2026-03-24 18:35:15
2	khalid.cizdoev777@gmail.com	$2b$10$dz3RHHF/7mV6te3UsYao/uZITluQCNrMGx2Vs.N6XUtsGaRuqYVmC	Khalid	Sainaro	\N	\N	ADMIN	2026-03-24 18:39:36
11	khalidsainaro@gmail.com	$2b$10$IbWSC6.gfKkIV75ba.I9FupphkjXQK4R5At1IJP5i.kb8628ZNv2.	Khalid	Sainaro	\N	\N	ADMIN	2026-03-25 15:34:16
12	testuser2@example.com	$2b$10$DEaQ.U2jozYYlV7lV76ngu9bRM9p8GFigxFAEgLmHY8Wc9K3OTwqe	Test	User	\N	\N	USER	2026-03-25 22:17:53
13	user@gmail.com	$2b$10$uDh33FpPTcbmiIOUcB0xEOyzp/Rv4mYmI5oHIdfXp3sefOQYToANi	Users	Test	\N	\N	USER	2026-03-26 19:06:01
3	lucas.u1@example.com	hashedpassword123	Lucas	M.	https://i.pravatar.cc/48?img=1	\N	USER	2026-03-25 13:33:26
4	sophie.u2@example.com	hashedpassword123	Sophie	B.	https://i.pravatar.cc/48?img=5	\N	USER	2026-03-25 13:33:26
5	antoine.u3@example.com	hashedpassword123	Antoine	R.	https://i.pravatar.cc/48?img=12	\N	USER	2026-03-25 13:33:26
6	camille.u4@example.com	hashedpassword123	Camille	D.	https://i.pravatar.cc/48?img=47	\N	USER	2026-03-25 13:33:26
7	nicolas.u5@example.com	hashedpassword123	Nicolas	P.	https://i.pravatar.cc/48?img=33	\N	USER	2026-03-25 13:33:26
8	julie.u6@example.com	hashedpassword123	Julie	F.	https://i.pravatar.cc/48?img=9	\N	USER	2026-03-25 13:33:26
9	thomas.u7@example.com	hashedpassword123	Thomas	G.	https://i.pravatar.cc/48?img=15	\N	USER	2026-03-25 13:33:26
10	emma.u8@example.com	hashedpassword123	Emma	L.	https://i.pravatar.cc/48?img=44	\N	USER	2026-03-25 13:33:26
\.


--
-- Name: Banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public."Banner_id_seq"', 7, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 59, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.categories_id_seq', 41, true);


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

SELECT pg_catalog.setval('public.reviews_id_seq', 126, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: khalid
--

SELECT pg_catalog.setval('public.users_id_seq', 29, true);


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

\unrestrict Psh6TARMWgFLj2F2RCAW6n3HntX6nBc5fjGebYIzrO5hLR6zCEBugaQy2ZXeLwX

