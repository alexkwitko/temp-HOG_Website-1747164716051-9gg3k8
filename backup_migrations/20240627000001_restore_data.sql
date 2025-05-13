--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

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
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only) FROM stdin;
925fb8ed-449c-489c-a504-aea05627c305	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==	200	2025-05-09 00:19:58	2025-05-09 00:19:58	100	postgres_cdc_rls	100000	100	100	f	\N	f	f
\.


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
41cf4cb6-f553-4f95-9e77-488bb800539c	postgres_cdc_rls	{"region": "us-east-1", "db_host": "byWpKtigmpoOmCMh0BKqjA==", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2025-05-09 00:19:58	2025-05-09 00:19:58
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2025-05-09 00:19:58
20220329161857	2025-05-09 00:19:58
20220410212326	2025-05-09 00:19:58
20220506102948	2025-05-09 00:19:58
20220527210857	2025-05-09 00:19:58
20220815211129	2025-05-09 00:19:58
20220815215024	2025-05-09 00:19:58
20220818141501	2025-05-09 00:19:58
20221018173709	2025-05-09 00:19:58
20221102172703	2025-05-09 00:19:58
20221223010058	2025-05-09 00:19:58
20230110180046	2025-05-09 00:19:58
20230810220907	2025-05-09 00:19:58
20230810220924	2025-05-09 00:19:58
20231024094642	2025-05-09 00:19:58
20240306114423	2025-05-09 00:19:58
20240418082835	2025-05-09 00:19:58
20240625211759	2025-05-09 00:19:58
20240704172020	2025-05-09 00:19:58
20240902173232	2025-05-09 00:19:58
20241106103258	2025-05-09 00:19:58
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-05-09 00:19:59
20211116045059	2025-05-09 00:19:59
20211116050929	2025-05-09 00:19:59
20211116051442	2025-05-09 00:19:59
20211116212300	2025-05-09 00:19:59
20211116213355	2025-05-09 00:19:59
20211116213934	2025-05-09 00:19:59
20211116214523	2025-05-09 00:19:59
20211122062447	2025-05-09 00:19:59
20211124070109	2025-05-09 00:19:59
20211202204204	2025-05-09 00:19:59
20211202204605	2025-05-09 00:19:59
20211210212804	2025-05-09 00:19:59
20211228014915	2025-05-09 00:19:59
20220107221237	2025-05-09 00:19:59
20220228202821	2025-05-09 00:19:59
20220312004840	2025-05-09 00:19:59
20220603231003	2025-05-09 00:19:59
20220603232444	2025-05-09 00:19:59
20220615214548	2025-05-09 00:19:59
20220712093339	2025-05-09 00:19:59
20220908172859	2025-05-09 00:19:59
20220916233421	2025-05-09 00:19:59
20230119133233	2025-05-09 00:19:59
20230128025114	2025-05-09 00:19:59
20230128025212	2025-05-09 00:19:59
20230227211149	2025-05-09 00:19:59
20230228184745	2025-05-09 00:19:59
20230308225145	2025-05-09 00:19:59
20230328144023	2025-05-09 00:19:59
20231018144023	2025-05-09 00:19:59
20231204144023	2025-05-09 00:19:59
20231204144024	2025-05-09 00:19:59
20231204144025	2025-05-09 00:19:59
20240108234812	2025-05-09 00:19:59
20240109165339	2025-05-09 00:19:59
20240227174441	2025-05-09 00:19:59
20240311171622	2025-05-09 00:20:00
20240321100241	2025-05-09 00:20:00
20240401105812	2025-05-09 00:20:00
20240418121054	2025-05-09 00:20:00
20240523004032	2025-05-09 00:20:00
20240618124746	2025-05-09 00:20:00
20240801235015	2025-05-09 00:20:00
20240805133720	2025-05-09 00:20:00
20240827160934	2025-05-09 00:20:00
20240919163303	2025-05-09 00:20:00
20240919163305	2025-05-09 00:20:00
20241019105805	2025-05-09 00:20:00
20241030150047	2025-05-09 00:20:00
20241108114728	2025-05-09 00:20:00
20241121104152	2025-05-09 00:20:00
20241130184212	2025-05-09 00:20:00
20241220035512	2025-05-09 00:20:00
20241220123912	2025-05-09 00:20:00
20241224161212	2025-05-09 00:20:00
20250107150512	2025-05-09 00:20:00
20250110162412	2025-05-09 00:20:00
20250123174212	2025-05-09 00:20:00
20250128220012	2025-05-09 00:20:00
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2025-05-09 00:19:48.572163+00
20210809183423_update_grants	2025-05-09 00:19:48.572163+00
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

