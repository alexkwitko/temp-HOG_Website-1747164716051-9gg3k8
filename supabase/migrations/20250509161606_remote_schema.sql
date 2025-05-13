create sequence if not exists "public"."home_page_config_id_seq";

alter table "public"."attribute_types" drop constraint "attribute_types_name_key";

alter table "public"."attribute_values" drop constraint "attribute_values_attribute_type_id_fkey";

alter table "public"."attribute_values" drop constraint "attribute_values_attribute_type_id_value_key";

alter table "public"."collection_products" drop constraint "collection_products_collection_id_fkey";

alter table "public"."collection_products" drop constraint "collection_products_collection_id_product_id_key";

alter table "public"."collection_products" drop constraint "collection_products_product_id_fkey";

alter table "public"."collections" drop constraint "collections_slug_key";

alter table "public"."customers" drop constraint "customers_email_key";

alter table "public"."product_images" drop constraint "product_images_product_id_fkey";

alter table "public"."product_variant_attributes" drop constraint "product_variant_attributes_attribute_value_id_fkey";

alter table "public"."product_variant_attributes" drop constraint "product_variant_attributes_product_variant_id_attribute_val_key";

alter table "public"."product_variant_attributes" drop constraint "product_variant_attributes_product_variant_id_fkey";

alter table "public"."product_variants" drop constraint "product_variants_product_id_fkey";

alter table "public"."attribute_types" drop constraint "attribute_types_pkey";

alter table "public"."attribute_values" drop constraint "attribute_values_pkey";

alter table "public"."collection_products" drop constraint "collection_products_pkey";

alter table "public"."collections" drop constraint "collections_pkey";

alter table "public"."customers" drop constraint "customers_pkey";

alter table "public"."product_images" drop constraint "product_images_pkey";

alter table "public"."product_variant_attributes" drop constraint "product_variant_attributes_pkey";

alter table "public"."product_variants" drop constraint "product_variants_pkey";

alter table "public"."profiles" drop constraint "profiles_pkey";

drop index if exists "public"."attribute_types_name_key";

drop index if exists "public"."attribute_types_pkey";

drop index if exists "public"."attribute_values_attribute_type_id_value_key";

drop index if exists "public"."attribute_values_pkey";

drop index if exists "public"."collection_products_collection_id_product_id_key";

drop index if exists "public"."collection_products_pkey";

drop index if exists "public"."collections_pkey";

drop index if exists "public"."collections_slug_key";

drop index if exists "public"."customers_email_key";

drop index if exists "public"."customers_pkey";

drop index if exists "public"."product_images_pkey";

drop index if exists "public"."product_variant_attributes_pkey";

drop index if exists "public"."product_variant_attributes_product_variant_id_attribute_val_key";

drop index if exists "public"."product_variants_pkey";

drop index if exists "public"."profiles_pkey";

drop table "public"."attribute_types";

drop table "public"."attribute_values";

drop table "public"."collection_products";

drop table "public"."collections";

drop table "public"."customers";

drop table "public"."product_images";

drop table "public"."product_variant_attributes";

drop table "public"."product_variants";

drop table "public"."profiles";

create table "public"."about_sections" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "title" text not null,
    "subtitle" text,
    "description" text,
    "achievements" jsonb default '[]'::jsonb,
    "button_text" text,
    "button_url" text,
    "button_bg" text default 'bg-yellow-500'::text,
    "button_text_color" text default 'text-black'::text,
    "button_hover" text default 'hover:bg-yellow-400'::text,
    "button_padding_x" text default 'px-6'::text,
    "button_padding_y" text default 'py-2'::text,
    "button_font" text default 'text-base'::text,
    "button_mobile_width" text default 'w-full'::text,
    "button_desktop_width" text default 'sm:w-auto'::text,
    "image_id" uuid,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "image_url" text,
    "image_text" text,
    "image_text_color" text default 'text-white'::text,
    "image_text_size" text default 'text-xl'::text,
    "image_hover_effect" text default 'scale'::text,
    "image_size" text default 'medium'::text
);


alter table "public"."about_sections" enable row level security;

create table "public"."blog_posts" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "excerpt" text,
    "content" text not null,
    "image_id" uuid,
    "author" text,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."blog_posts" enable row level security;

create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "color" text not null,
    "icon" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."categories" enable row level security;

create table "public"."contact_settings" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "value" text not null,
    "label" text,
    "type" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."contact_settings" enable row level security;

create table "public"."cta_config" (
    "id" uuid not null default gen_random_uuid(),
    "heading" text not null default 'Start Your Journey Today'::text,
    "subheading" text not null default 'Join House of Grappling and experience the most effective martial art in the world.'::text,
    "primary_button_text" text default 'Get Started'::text,
    "primary_button_url" text default '/contact'::text,
    "secondary_button_text" text default 'View Schedule'::text,
    "secondary_button_url" text default '/schedule'::text,
    "background_color" text default '#1A1A1A'::text,
    "text_color" text default '#FFFFFF'::text,
    "button_primary_color" text default '#FFFFFF'::text,
    "button_primary_text_color" text default '#1A1A1A'::text,
    "button_secondary_color" text default '#333333'::text,
    "button_secondary_text_color" text default '#FFFFFF'::text,
    "background_image_url" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."cta_config" enable row level security;

create table "public"."featured_products_config" (
    "id" uuid not null default gen_random_uuid(),
    "heading" text default 'Featured Products'::text,
    "subheading" text default 'Shop our selection of high-quality products'::text,
    "featured_product_ids" uuid[] default ARRAY[]::uuid[],
    "background_color" text default '#ffffff'::text,
    "text_color" text default '#000000'::text,
    "button_text" text default 'Shop Now'::text,
    "button_url" text default '/shop'::text,
    "button_color" text default '#000000'::text,
    "button_text_color" text default '#ffffff'::text,
    "button_bg_color" text default '#000000'::text,
    "button_hover_color" text default '#222222'::text,
    "button_alignment" text default 'center'::text,
    "columns_layout" text default '3'::text,
    "enable_special_promotion" boolean default false,
    "promoted_product_id" uuid,
    "promotion_badge_text" text default 'Featured'::text,
    "promotion_badge_color" text default '#ff0000'::text,
    "promotion_badge_text_color" text default '#ffffff'::text,
    "show_preview" boolean default true,
    "max_display_count" integer default 3,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."featured_programs_config" (
    "id" uuid not null default uuid_generate_v4(),
    "heading" text default 'Featured Programs'::text,
    "subheading" text default 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.'::text,
    "featured_program_ids" text[] default '{}'::text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."featured_programs_config" enable row level security;

create table "public"."features" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "icon_name" text not null,
    "order" integer not null default 0,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."hero_config" (
    "id" text not null,
    "text_background_settings" jsonb default '{"color": "rgba(0,0,0,0.7)", "enabled": false, "opacity": 70}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."hero_slides" (
    "id" uuid not null default gen_random_uuid(),
    "title" text,
    "subtitle" text,
    "description" text,
    "text_color" text default '#FFFFFF'::text,
    "image_url" text,
    "image_id" text,
    "image_opacity" integer default 100,
    "text_background" jsonb default '{"size": "md", "color": "rgba(0,0,0,0.7)", "enabled": false, "opacity": 70, "padding": "16px"}'::jsonb,
    "text_position" jsonb default '{"vertical": "center", "horizontal": "center"}'::jsonb,
    "button_text" text,
    "button_url" text,
    "button_active" boolean default true,
    "button_bg" text default '#000000'::text,
    "button_text_color" text default '#FFFFFF'::text,
    "button_hover" text default '#222222'::text,
    "button_padding_x" text default '16px'::text,
    "button_padding_y" text default '8px'::text,
    "button_font" text default 'inherit'::text,
    "button_mobile_width" text default '100%'::text,
    "button_desktop_width" text default 'auto'::text,
    "secondary_button_text" text,
    "secondary_button_url" text,
    "secondary_button_active" boolean default false,
    "secondary_button_bg" text default '#FFFFFF'::text,
    "secondary_button_text_color" text default '#000000'::text,
    "secondary_button_hover" text default '#F5F5F5'::text,
    "secondary_button_padding_x" text default '16px'::text,
    "secondary_button_padding_y" text default '8px'::text,
    "secondary_button_font" text default 'inherit'::text,
    "secondary_button_mobile_width" text default '100%'::text,
    "secondary_button_desktop_width" text default 'auto'::text,
    "order" integer default 0,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."home_components" (
    "id" uuid not null default gen_random_uuid(),
    "component_type" text,
    "title" text,
    "description" text,
    "config" jsonb default '{}'::jsonb,
    "order" integer default 0,
    "is_active" boolean default true,
    "background_color" text default '#FFFFFF'::text,
    "text_color" text default '#000000'::text,
    "image_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."home_page_components" (
    "id" text not null,
    "component_type" text,
    "name" text,
    "order" integer default 0,
    "is_active" boolean default true,
    "background_color" text default '#FFFFFF'::text,
    "text_color" text default '#000000'::text,
    "border_color" text default 'transparent'::text,
    "border_width" integer default 0,
    "border_radius" integer default 0,
    "padding" text default '0px'::text,
    "margin" text default '0px'::text,
    "width" text default '100%'::text,
    "height" text default 'auto'::text,
    "vertical_align" text default 'center'::text,
    "horizontal_align" text default 'center'::text,
    "palette_override" text,
    "text_background_enabled" boolean default false,
    "text_background_color" text default 'rgba(0,0,0,0.7)'::text,
    "text_background_opacity" integer default 70,
    "config" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."home_page_config" (
    "id" integer not null default nextval('home_page_config_id_seq'::regclass),
    "palette_id" text,
    "use_site_palette" boolean default true,
    "color_mode" text default 'uniform'::text
);


create table "public"."home_sections" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "title" text not null,
    "subtitle" text,
    "description" text,
    "button_text" text,
    "button_url" text,
    "button_bg" text default 'bg-yellow-500'::text,
    "button_text_color" text default 'text-black'::text,
    "button_hover" text default 'hover:bg-yellow-400'::text,
    "button_padding_x" text default 'px-6'::text,
    "button_padding_y" text default 'py-2'::text,
    "button_font" text default 'text-base'::text,
    "button_mobile_width" text default 'w-full'::text,
    "button_desktop_width" text default 'sm:w-auto'::text,
    "secondary_button_text" text,
    "secondary_button_url" text,
    "secondary_button_bg" text default 'bg-white/10'::text,
    "secondary_button_text_color" text default 'text-white'::text,
    "secondary_button_hover" text default 'hover:bg-white/20'::text,
    "secondary_button_padding_x" text default 'px-6'::text,
    "secondary_button_padding_y" text default 'py-2'::text,
    "secondary_button_font" text default 'text-base'::text,
    "secondary_button_mobile_width" text default 'w-full'::text,
    "secondary_button_desktop_width" text default 'sm:w-auto'::text,
    "image_id" uuid,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "image_hover_effect" text default 'scale'::text
);


alter table "public"."home_sections" enable row level security;

create table "public"."icons_reference" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "display_name" text not null,
    "category" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."image_dimensions" (
    "id" uuid not null default gen_random_uuid(),
    "section" text not null,
    "key" text not null,
    "height" text not null,
    "width" text not null,
    "object_fit" text not null default 'contain'::text,
    "object_position" text not null default 'center'::text,
    "pixel_width" integer,
    "pixel_height" integer,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."image_dimensions" enable row level security;

create table "public"."image_sizes" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "size" integer not null,
    "label" text not null,
    "is_preset" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."image_sizes" enable row level security;

create table "public"."images" (
    "id" uuid not null default gen_random_uuid(),
    "url" text not null,
    "alt_text" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."images" enable row level security;

create table "public"."instructors" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "title" text not null,
    "bio" text not null,
    "image_id" uuid,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "image_hover_effect" text default 'scale'::text,
    "image_size" text default 'medium'::text,
    "bio_summary" text
);


alter table "public"."instructors" enable row level security;

create table "public"."insurance_providers" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "logo_id" uuid,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."insurance_providers" enable row level security;

create table "public"."location_section" (
    "id" uuid not null default gen_random_uuid(),
    "heading" text not null default 'Conveniently Located in the Heart of Your City'::text,
    "address_line1" text not null default '8801 Colorado Bend'::text,
    "address_line2" text,
    "city" text not null default 'Lantana'::text,
    "state" text not null default 'TX'::text,
    "zip" text not null default '76226'::text,
    "hours_weekday" text not null default 'Monday - Friday: 9:00 AM - 9:00 PM'::text,
    "hours_saturday" text not null default 'Saturday: 8:00 AM - 5:00 PM'::text,
    "hours_sunday" text not null default 'Sunday: 10:00 AM - 3:00 PM'::text,
    "button_text" text not null default 'Get Directions'::text,
    "button_url" text not null default '/contact'::text,
    "map_embed_url" text not null default 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.7232048623!2d-97.13213392367207!3d33.10241177279283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c33edb88f811f%3A0xdcfac8a1ffe9f412!2s8801%20Colorado%20Bend%2C%20Lantana%2C%20TX%2076226!5e0!3m2!1sen!2sus!4v1683245678901!5m2!1sen!2sus'::text,
    "use_custom_image" boolean not null default false,
    "image_url" text,
    "bg_color" text not null default 'bg-neutral-900'::text,
    "text_color" text not null default 'text-neutral-50'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."location_section" enable row level security;

create table "public"."menu_items" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "url" text not null,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."menu_items" enable row level security;

create table "public"."methodology" (
    "id" text not null,
    "title" text not null,
    "description" text not null,
    "icon_name" text not null,
    "order" integer not null,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."methodology" enable row level security;

create table "public"."page_stats" (
    "id" uuid not null default gen_random_uuid(),
    "page" text not null,
    "label" text not null,
    "value" text not null,
    "bg_color" text not null default 'bg-blue-100'::text,
    "text_color" text not null default 'text-blue-800'::text,
    "description" text,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."page_stats" enable row level security;

create table "public"."programs" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "slug" text not null,
    "excerpt" text,
    "content" text not null,
    "image_id" uuid,
    "status" text not null default 'draft'::text,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "order" integer default 0,
    "image_hover_effect" text default 'scale'::text,
    "image_size" text default 'medium'::text,
    "image_url" text,
    "icon" text,
    "icon_color" text default '#111827'::text,
    "background_color" text default '#f9fafb'::text,
    "text_color" text default '#111827'::text,
    "border_color" text default '#e5e7eb'::text,
    "border_width" integer default 1,
    "border_radius" integer default 8,
    "shadow_size" text default 'md'::text,
    "padding" text default 'medium'::text,
    "card_width" text default 'medium'::text,
    "card_height" text default 'auto'::text,
    "button_text" text default 'Learn More'::text,
    "button_color" text default '#111827'::text,
    "button_text_color" text default '#ffffff'::text,
    "button_border_radius" integer default 4,
    "button_hover_color" text default '#374151'::text,
    "animation_type" text default 'none'::text,
    "hover_effect" text default 'none'::text,
    "level" text,
    "duration" integer,
    "is_featured" boolean default false,
    "layout_style" text default 'standard'::text,
    "content_alignment" text default 'center'::text,
    "image_position" text default 'top'::text,
    "display_priority" integer default 10,
    "is_active" boolean default true,
    "show_button" boolean default true,
    "use_icon" boolean default false,
    "title_alignment" text default 'center'::text,
    "category_id" uuid
);


alter table "public"."programs" enable row level security;

create table "public"."schedule_classes" (
    "id" uuid not null default gen_random_uuid(),
    "day" text not null,
    "title" text not null,
    "category_id" uuid,
    "instructor" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "start_time" text not null,
    "end_time" text not null,
    "is_closed" boolean default false
);


alter table "public"."schedule_classes" enable row level security;

create table "public"."schema_migrations" (
    "version" text not null,
    "name" text not null,
    "applied_at" timestamp with time zone default now()
);


create table "public"."section_image_sizes" (
    "id" uuid not null default gen_random_uuid(),
    "section" text not null,
    "key" text not null,
    "size_name" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."section_image_sizes" enable row level security;

create table "public"."settings" (
    "id" uuid not null default gen_random_uuid(),
    "section_id" uuid,
    "key" text not null,
    "value" text,
    "label" text not null,
    "description" text,
    "type" text not null,
    "placeholder" text,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."settings" enable row level security;

create table "public"."settings_categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "icon" text not null,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."settings_categories" enable row level security;

create table "public"."settings_sections" (
    "id" uuid not null default gen_random_uuid(),
    "category_id" uuid,
    "name" text not null,
    "order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."settings_sections" enable row level security;

create table "public"."site_config" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "value" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "description" text
);


create table "public"."site_content" (
    "id" uuid not null default gen_random_uuid(),
    "section" text not null,
    "key" text not null,
    "title" text not null,
    "subtitle" text,
    "description" text,
    "url" text,
    "button_text" text,
    "button_url" text,
    "button_bg" text,
    "button_text_color" text,
    "button_hover" text,
    "button_padding_x" text,
    "button_padding_y" text,
    "button_font" text,
    "button_mobile_width" text,
    "button_desktop_width" text,
    "secondary_button_text" text,
    "secondary_button_url" text,
    "secondary_button_bg" text,
    "secondary_button_text_color" text,
    "secondary_button_hover" text,
    "secondary_button_padding_x" text,
    "secondary_button_padding_y" text,
    "secondary_button_font" text,
    "secondary_button_mobile_width" text,
    "secondary_button_desktop_width" text,
    "menu_button_text" text,
    "menu_button_url" text,
    "menu_button_bg" text default 'bg-yellow-500'::text,
    "menu_button_text_color" text default 'text-black'::text,
    "menu_button_hover" text default 'hover:bg-yellow-400'::text,
    "menu_button_padding_x" text default 'px-6'::text,
    "menu_button_padding_y" text default 'py-2'::text,
    "menu_button_font" text default 'text-base'::text,
    "menu_button_mobile_width" text default 'w-full'::text,
    "menu_button_desktop_width" text default 'sm:w-auto'::text,
    "content_order" integer not null default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "image_id" uuid,
    "width" text default '200'::text,
    "image_size" text default 'medium'::text,
    "image_hover_effect" text default 'scale'::text,
    "show_logo_text" boolean default true,
    "logo_text_title" text default 'Academy Logo'::text,
    "logo_text_title_size" text default 'text-2xl'::text,
    "logo_text_title_weight" text default 'font-bold'::text,
    "logo_text_subtitle" text default 'Martial Arts'::text,
    "logo_text_subtitle_size" text default 'text-sm'::text,
    "logo_width" text default '200'::text,
    "footer_width" text default '200'::text,
    "logo_scroll_scale" text default '75'::text
);


alter table "public"."site_content" enable row level security;

create table "public"."site_images" (
    "id" uuid not null default gen_random_uuid(),
    "section" text not null,
    "key" text not null,
    "url" text not null,
    "alt_text" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."site_images" enable row level security;

create table "public"."site_settings" (
    "key" text not null,
    "value" text,
    "site_name" text,
    "site_description" text,
    "contact_email" text,
    "social_links_json" jsonb default '{"twitter": "", "youtube": "", "facebook": "", "instagram": ""}'::jsonb,
    "business_hours_json" jsonb default '{"friday": {"open": "08:00", "close": "21:00", "closed": false}, "monday": {"open": "08:00", "close": "21:00", "closed": false}, "sunday": {"open": "09:00", "close": "17:00", "closed": true}, "tuesday": {"open": "08:00", "close": "21:00", "closed": false}, "saturday": {"open": "09:00", "close": "17:00", "closed": false}, "thursday": {"open": "08:00", "close": "21:00", "closed": false}, "wednesday": {"open": "08:00", "close": "21:00", "closed": false}}'::jsonb,
    "color_palette_settings_json" jsonb default '{"text": "#1a1a1a", "links": "#0070f3", "accent": "#0070f3", "buttons": "#0070f3", "primary": "#1a1a1a", "headings": "#1a1a1a", "secondary": "#ffffff", "background": "#ffffff", "buttonText": "#ffffff"}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."special_schedule_classes" (
    "id" uuid not null default gen_random_uuid(),
    "special_schedule_id" uuid not null,
    "start_time" text not null,
    "end_time" text not null,
    "title" text not null,
    "category_id" uuid,
    "instructor" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."special_schedule_classes" enable row level security;

create table "public"."special_schedules" (
    "id" uuid not null default gen_random_uuid(),
    "date" date not null,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "is_closed" boolean default false
);


alter table "public"."special_schedules" enable row level security;

create table "public"."why_choose_cards" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "icon_name" text,
    "image_url" text,
    "image_id" uuid,
    "button_text" text,
    "button_url" text,
    "button_bg" text,
    "button_text_color" text,
    "card_bg" text,
    "card_text_color" text,
    "use_icon" boolean default true,
    "order" integer not null default 0,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."products" drop column "base_price";

alter table "public"."products" drop column "category";

alter table "public"."products" drop column "is_featured";

alter table "public"."products" add column "image_id" uuid;

alter table "public"."products" add column "is_active" boolean default true;

alter table "public"."products" add column "price" numeric(10,2);

alter sequence "public"."home_page_config_id_seq" owned by "public"."home_page_config"."id";

drop sequence if exists "public"."attribute_types_id_seq";

drop sequence if exists "public"."attribute_values_id_seq";

drop sequence if exists "public"."collection_products_id_seq";

drop sequence if exists "public"."collections_id_seq";

drop sequence if exists "public"."product_images_id_seq";

drop sequence if exists "public"."product_variant_attributes_id_seq";

drop sequence if exists "public"."product_variants_id_seq";

CREATE INDEX about_sections_image_id_idx ON public.about_sections USING btree (image_id);

CREATE UNIQUE INDEX about_sections_key_key ON public.about_sections USING btree (key);

CREATE INDEX about_sections_order_idx ON public.about_sections USING btree ("order");

CREATE UNIQUE INDEX about_sections_pkey ON public.about_sections USING btree (id);

CREATE INDEX blog_posts_image_id_idx ON public.blog_posts USING btree (image_id);

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE INDEX blog_posts_published_at_idx ON public.blog_posts USING btree (published_at DESC NULLS LAST);

CREATE UNIQUE INDEX class_categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX contact_settings_key_key ON public.contact_settings USING btree (key);

CREATE UNIQUE INDEX contact_settings_pkey ON public.contact_settings USING btree (id);

CREATE UNIQUE INDEX cta_config_pkey ON public.cta_config USING btree (id);

CREATE UNIQUE INDEX featured_products_config_temp_pkey ON public.featured_products_config USING btree (id);

CREATE UNIQUE INDEX featured_programs_config_pkey ON public.featured_programs_config USING btree (id);

CREATE UNIQUE INDEX features_pkey ON public.features USING btree (id);

CREATE UNIQUE INDEX hero_config_pkey ON public.hero_config USING btree (id);

CREATE UNIQUE INDEX hero_slides_pkey ON public.hero_slides USING btree (id);

CREATE UNIQUE INDEX home_components_pkey ON public.home_components USING btree (id);

CREATE UNIQUE INDEX home_page_components_pkey ON public.home_page_components USING btree (id);

CREATE UNIQUE INDEX home_page_config_pkey ON public.home_page_config USING btree (id);

CREATE INDEX home_sections_image_id_idx ON public.home_sections USING btree (image_id);

CREATE UNIQUE INDEX home_sections_key_key ON public.home_sections USING btree (key);

CREATE INDEX home_sections_order_idx ON public.home_sections USING btree ("order");

CREATE UNIQUE INDEX home_sections_pkey ON public.home_sections USING btree (id);

CREATE UNIQUE INDEX icons_reference_name_key ON public.icons_reference USING btree (name);

CREATE UNIQUE INDEX icons_reference_pkey ON public.icons_reference USING btree (id);

CREATE UNIQUE INDEX image_dimensions_pkey ON public.image_dimensions USING btree (id);

CREATE INDEX image_dimensions_section_key_idx ON public.image_dimensions USING btree (section, key);

CREATE UNIQUE INDEX image_dimensions_section_key_key ON public.image_dimensions USING btree (section, key);

CREATE UNIQUE INDEX image_sizes_name_key ON public.image_sizes USING btree (name);

CREATE UNIQUE INDEX image_sizes_pkey ON public.image_sizes USING btree (id);

CREATE UNIQUE INDEX images_pkey ON public.images USING btree (id);

CREATE INDEX instructors_image_id_idx ON public.instructors USING btree (image_id);

CREATE INDEX instructors_order_idx ON public.instructors USING btree ("order");

CREATE UNIQUE INDEX instructors_pkey ON public.instructors USING btree (id);

CREATE INDEX insurance_providers_order_idx ON public.insurance_providers USING btree ("order");

CREATE UNIQUE INDEX insurance_providers_pkey ON public.insurance_providers USING btree (id);

CREATE UNIQUE INDEX location_section_pkey ON public.location_section USING btree (id);

CREATE INDEX menu_items_order_idx ON public.menu_items USING btree ("order");

CREATE UNIQUE INDEX menu_items_pkey ON public.menu_items USING btree (id);

CREATE UNIQUE INDEX methodology_pkey ON public.methodology USING btree (id);

CREATE INDEX page_stats_order_idx ON public.page_stats USING btree ("order");

CREATE INDEX page_stats_page_idx ON public.page_stats USING btree (page);

CREATE UNIQUE INDEX page_stats_pkey ON public.page_stats USING btree (id);

CREATE INDEX programs_category_id_idx ON public.programs USING btree (category_id);

CREATE UNIQUE INDEX schedule_classes_pkey ON public.schedule_classes USING btree (id);

CREATE UNIQUE INDEX schema_migrations_pkey ON public.schema_migrations USING btree (version);

CREATE UNIQUE INDEX section_image_sizes_pkey ON public.section_image_sizes USING btree (id);

CREATE UNIQUE INDEX section_image_sizes_section_key_key ON public.section_image_sizes USING btree (section, key);

CREATE UNIQUE INDEX settings_categories_pkey ON public.settings_categories USING btree (id);

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);

CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree (id);

CREATE UNIQUE INDEX settings_sections_pkey ON public.settings_sections USING btree (id);

CREATE UNIQUE INDEX site_config_key_key ON public.site_config USING btree (key);

CREATE UNIQUE INDEX site_config_pkey ON public.site_config USING btree (id);

CREATE INDEX site_content_image_id_idx ON public.site_content USING btree (image_id);

CREATE UNIQUE INDEX site_content_pkey ON public.site_content USING btree (id);

CREATE INDEX site_content_section_key_idx ON public.site_content USING btree (section, key);

CREATE UNIQUE INDEX site_content_section_key_key ON public.site_content USING btree (section, key);

CREATE INDEX site_content_section_order_idx ON public.site_content USING btree (section, content_order);

CREATE UNIQUE INDEX site_images_pkey ON public.site_images USING btree (id);

CREATE INDEX site_images_section_key_idx ON public.site_images USING btree (section, key);

CREATE UNIQUE INDEX site_images_section_key_key ON public.site_images USING btree (section, key);

CREATE UNIQUE INDEX site_settings_pkey ON public.site_settings USING btree (key);

CREATE UNIQUE INDEX special_schedule_classes_pkey ON public.special_schedule_classes USING btree (id);

CREATE INDEX special_schedules_date_idx ON public.special_schedules USING btree (date);

CREATE UNIQUE INDEX special_schedules_pkey ON public.special_schedules USING btree (id);

CREATE INDEX treatments_order_idx ON public.programs USING btree ("order");

CREATE UNIQUE INDEX treatments_pkey ON public.programs USING btree (id);

CREATE INDEX treatments_slug_idx ON public.programs USING btree (slug);

CREATE UNIQUE INDEX treatments_slug_key ON public.programs USING btree (slug);

CREATE INDEX treatments_status_idx ON public.programs USING btree (status);

CREATE UNIQUE INDEX why_choose_cards_pkey ON public.why_choose_cards USING btree (id);

alter table "public"."about_sections" add constraint "about_sections_pkey" PRIMARY KEY using index "about_sections_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."categories" add constraint "class_categories_pkey" PRIMARY KEY using index "class_categories_pkey";

alter table "public"."contact_settings" add constraint "contact_settings_pkey" PRIMARY KEY using index "contact_settings_pkey";

alter table "public"."cta_config" add constraint "cta_config_pkey" PRIMARY KEY using index "cta_config_pkey";

alter table "public"."featured_products_config" add constraint "featured_products_config_temp_pkey" PRIMARY KEY using index "featured_products_config_temp_pkey";

alter table "public"."featured_programs_config" add constraint "featured_programs_config_pkey" PRIMARY KEY using index "featured_programs_config_pkey";

alter table "public"."features" add constraint "features_pkey" PRIMARY KEY using index "features_pkey";

alter table "public"."hero_config" add constraint "hero_config_pkey" PRIMARY KEY using index "hero_config_pkey";

alter table "public"."hero_slides" add constraint "hero_slides_pkey" PRIMARY KEY using index "hero_slides_pkey";

alter table "public"."home_components" add constraint "home_components_pkey" PRIMARY KEY using index "home_components_pkey";

alter table "public"."home_page_components" add constraint "home_page_components_pkey" PRIMARY KEY using index "home_page_components_pkey";

alter table "public"."home_page_config" add constraint "home_page_config_pkey" PRIMARY KEY using index "home_page_config_pkey";

alter table "public"."home_sections" add constraint "home_sections_pkey" PRIMARY KEY using index "home_sections_pkey";

alter table "public"."icons_reference" add constraint "icons_reference_pkey" PRIMARY KEY using index "icons_reference_pkey";

alter table "public"."image_dimensions" add constraint "image_dimensions_pkey" PRIMARY KEY using index "image_dimensions_pkey";

alter table "public"."image_sizes" add constraint "image_sizes_pkey" PRIMARY KEY using index "image_sizes_pkey";

alter table "public"."images" add constraint "images_pkey" PRIMARY KEY using index "images_pkey";

alter table "public"."instructors" add constraint "instructors_pkey" PRIMARY KEY using index "instructors_pkey";

alter table "public"."insurance_providers" add constraint "insurance_providers_pkey" PRIMARY KEY using index "insurance_providers_pkey";

alter table "public"."location_section" add constraint "location_section_pkey" PRIMARY KEY using index "location_section_pkey";

alter table "public"."menu_items" add constraint "menu_items_pkey" PRIMARY KEY using index "menu_items_pkey";

alter table "public"."methodology" add constraint "methodology_pkey" PRIMARY KEY using index "methodology_pkey";

alter table "public"."page_stats" add constraint "page_stats_pkey" PRIMARY KEY using index "page_stats_pkey";

alter table "public"."programs" add constraint "treatments_pkey" PRIMARY KEY using index "treatments_pkey";

alter table "public"."schedule_classes" add constraint "schedule_classes_pkey" PRIMARY KEY using index "schedule_classes_pkey";

alter table "public"."schema_migrations" add constraint "schema_migrations_pkey" PRIMARY KEY using index "schema_migrations_pkey";

alter table "public"."section_image_sizes" add constraint "section_image_sizes_pkey" PRIMARY KEY using index "section_image_sizes_pkey";

alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index "settings_pkey";

alter table "public"."settings_categories" add constraint "settings_categories_pkey" PRIMARY KEY using index "settings_categories_pkey";

alter table "public"."settings_sections" add constraint "settings_sections_pkey" PRIMARY KEY using index "settings_sections_pkey";

alter table "public"."site_config" add constraint "site_config_pkey" PRIMARY KEY using index "site_config_pkey";

alter table "public"."site_content" add constraint "site_content_pkey" PRIMARY KEY using index "site_content_pkey";

alter table "public"."site_images" add constraint "site_images_pkey" PRIMARY KEY using index "site_images_pkey";

alter table "public"."site_settings" add constraint "site_settings_pkey" PRIMARY KEY using index "site_settings_pkey";

alter table "public"."special_schedule_classes" add constraint "special_schedule_classes_pkey" PRIMARY KEY using index "special_schedule_classes_pkey";

alter table "public"."special_schedules" add constraint "special_schedules_pkey" PRIMARY KEY using index "special_schedules_pkey";

alter table "public"."why_choose_cards" add constraint "why_choose_cards_pkey" PRIMARY KEY using index "why_choose_cards_pkey";

alter table "public"."about_sections" add constraint "about_sections_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."about_sections" validate constraint "about_sections_image_id_fkey";

alter table "public"."about_sections" add constraint "about_sections_key_key" UNIQUE using index "about_sections_key_key";

alter table "public"."blog_posts" add constraint "blog_posts_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."blog_posts" validate constraint "blog_posts_image_id_fkey";

alter table "public"."contact_settings" add constraint "contact_settings_key_key" UNIQUE using index "contact_settings_key_key";

alter table "public"."home_sections" add constraint "home_sections_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."home_sections" validate constraint "home_sections_image_id_fkey";

alter table "public"."home_sections" add constraint "home_sections_key_key" UNIQUE using index "home_sections_key_key";

alter table "public"."icons_reference" add constraint "icons_reference_name_key" UNIQUE using index "icons_reference_name_key";

alter table "public"."image_dimensions" add constraint "image_dimensions_section_key_key" UNIQUE using index "image_dimensions_section_key_key";

alter table "public"."image_sizes" add constraint "image_sizes_name_key" UNIQUE using index "image_sizes_name_key";

alter table "public"."instructors" add constraint "instructors_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."instructors" validate constraint "instructors_image_id_fkey";

alter table "public"."insurance_providers" add constraint "insurance_providers_logo_id_fkey" FOREIGN KEY (logo_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."insurance_providers" validate constraint "insurance_providers_logo_id_fkey";

alter table "public"."programs" add constraint "programs_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) not valid;

alter table "public"."programs" validate constraint "programs_category_id_fkey";

alter table "public"."programs" add constraint "treatments_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."programs" validate constraint "treatments_image_id_fkey";

alter table "public"."programs" add constraint "treatments_slug_key" UNIQUE using index "treatments_slug_key";

alter table "public"."programs" add constraint "treatments_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'hidden'::text]))) not valid;

alter table "public"."programs" validate constraint "treatments_status_check";

alter table "public"."schedule_classes" add constraint "schedule_classes_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE not valid;

alter table "public"."schedule_classes" validate constraint "schedule_classes_category_id_fkey";

alter table "public"."section_image_sizes" add constraint "section_image_sizes_section_key_key" UNIQUE using index "section_image_sizes_section_key_key";

alter table "public"."section_image_sizes" add constraint "section_image_sizes_size_name_fkey" FOREIGN KEY (size_name) REFERENCES image_sizes(name) ON DELETE CASCADE not valid;

alter table "public"."section_image_sizes" validate constraint "section_image_sizes_size_name_fkey";

alter table "public"."settings" add constraint "settings_key_key" UNIQUE using index "settings_key_key";

alter table "public"."settings" add constraint "settings_section_id_fkey" FOREIGN KEY (section_id) REFERENCES settings_sections(id) ON DELETE CASCADE not valid;

alter table "public"."settings" validate constraint "settings_section_id_fkey";

alter table "public"."settings_sections" add constraint "settings_sections_category_id_fkey" FOREIGN KEY (category_id) REFERENCES settings_categories(id) ON DELETE CASCADE not valid;

alter table "public"."settings_sections" validate constraint "settings_sections_category_id_fkey";

alter table "public"."site_config" add constraint "site_config_key_key" UNIQUE using index "site_config_key_key";

alter table "public"."site_content" add constraint "site_content_image_id_fkey" FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL not valid;

alter table "public"."site_content" validate constraint "site_content_image_id_fkey";

alter table "public"."site_content" add constraint "site_content_section_key_key" UNIQUE using index "site_content_section_key_key";

alter table "public"."site_images" add constraint "site_images_section_key_key" UNIQUE using index "site_images_section_key_key";

alter table "public"."special_schedule_classes" add constraint "special_schedule_classes_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL not valid;

alter table "public"."special_schedule_classes" validate constraint "special_schedule_classes_category_id_fkey";

alter table "public"."special_schedule_classes" add constraint "special_schedule_classes_special_schedule_id_fkey" FOREIGN KEY (special_schedule_id) REFERENCES special_schedules(id) ON DELETE CASCADE not valid;

alter table "public"."special_schedule_classes" validate constraint "special_schedule_classes_special_schedule_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_table_exists(table_name_param text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = table_name_param
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$function$
;

create or replace view "public"."classes" as  SELECT programs.id,
    programs.title,
    programs.created_at,
    programs.updated_at
   FROM programs;


CREATE OR REPLACE FUNCTION public.cleanup_image_dimensions()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Delete old image_dimensions entry if it exists
  DELETE FROM image_dimensions 
  WHERE section = NEW.section 
    AND key = NEW.key 
    AND (
      height != NEW.height OR 
      width != NEW.width OR 
      object_fit != NEW.object_fit OR 
      object_position != NEW.object_position
    );
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_old_site_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If updating an existing record
  IF (TG_OP = 'UPDATE') THEN
    -- Delete old image from storage if URL changed
    IF NEW.url != OLD.url THEN
      -- The actual storage cleanup will be handled by the application
      -- Here we just ensure the old record is properly updated
      NEW.updated_at = now();
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_site_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Delete old site_image entry if it exists
  DELETE FROM site_images 
  WHERE section = NEW.section 
    AND key = NEW.key 
    AND url != NEW.url;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_unused_images()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only delete the image if it's not used anywhere
  IF OLD.image_id IS NOT NULL AND OLD.image_id != NEW.image_id THEN
    IF NOT EXISTS (
      SELECT 1 FROM hero_slides WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM programs WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM instructors WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM blog_posts WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM home_sections WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM about_sections WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM treatments WHERE image_id = OLD.image_id
      UNION ALL
      SELECT 1 FROM insurance_providers WHERE logo_id = OLD.image_id
    ) THEN
      DELETE FROM images WHERE id = OLD.image_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
      BEGIN
        EXECUTE sql;
      END;
      $function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_image_referenced(image_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check all tables that reference images
  RETURN EXISTS (
    SELECT 1 FROM hero_slides WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM programs WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM instructors WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM blog_posts WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM navigation_content WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM footer_content WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM home_sections WHERE image_id = $1
    UNION ALL
    SELECT 1 FROM about_sections WHERE image_id = $1
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."about_sections" to "anon";

grant insert on table "public"."about_sections" to "anon";

grant references on table "public"."about_sections" to "anon";

grant select on table "public"."about_sections" to "anon";

grant trigger on table "public"."about_sections" to "anon";

grant truncate on table "public"."about_sections" to "anon";

grant update on table "public"."about_sections" to "anon";

grant delete on table "public"."about_sections" to "authenticated";

grant insert on table "public"."about_sections" to "authenticated";

grant references on table "public"."about_sections" to "authenticated";

grant select on table "public"."about_sections" to "authenticated";

grant trigger on table "public"."about_sections" to "authenticated";

grant truncate on table "public"."about_sections" to "authenticated";

grant update on table "public"."about_sections" to "authenticated";

grant delete on table "public"."about_sections" to "service_role";

grant insert on table "public"."about_sections" to "service_role";

grant references on table "public"."about_sections" to "service_role";

grant select on table "public"."about_sections" to "service_role";

grant trigger on table "public"."about_sections" to "service_role";

grant truncate on table "public"."about_sections" to "service_role";

grant update on table "public"."about_sections" to "service_role";

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."contact_settings" to "anon";

grant insert on table "public"."contact_settings" to "anon";

grant references on table "public"."contact_settings" to "anon";

grant select on table "public"."contact_settings" to "anon";

grant trigger on table "public"."contact_settings" to "anon";

grant truncate on table "public"."contact_settings" to "anon";

grant update on table "public"."contact_settings" to "anon";

grant delete on table "public"."contact_settings" to "authenticated";

grant insert on table "public"."contact_settings" to "authenticated";

grant references on table "public"."contact_settings" to "authenticated";

grant select on table "public"."contact_settings" to "authenticated";

grant trigger on table "public"."contact_settings" to "authenticated";

grant truncate on table "public"."contact_settings" to "authenticated";

grant update on table "public"."contact_settings" to "authenticated";

grant delete on table "public"."contact_settings" to "service_role";

grant insert on table "public"."contact_settings" to "service_role";

grant references on table "public"."contact_settings" to "service_role";

grant select on table "public"."contact_settings" to "service_role";

grant trigger on table "public"."contact_settings" to "service_role";

grant truncate on table "public"."contact_settings" to "service_role";

grant update on table "public"."contact_settings" to "service_role";

grant delete on table "public"."cta_config" to "anon";

grant insert on table "public"."cta_config" to "anon";

grant references on table "public"."cta_config" to "anon";

grant select on table "public"."cta_config" to "anon";

grant trigger on table "public"."cta_config" to "anon";

grant truncate on table "public"."cta_config" to "anon";

grant update on table "public"."cta_config" to "anon";

grant delete on table "public"."cta_config" to "authenticated";

grant insert on table "public"."cta_config" to "authenticated";

grant references on table "public"."cta_config" to "authenticated";

grant select on table "public"."cta_config" to "authenticated";

grant trigger on table "public"."cta_config" to "authenticated";

grant truncate on table "public"."cta_config" to "authenticated";

grant update on table "public"."cta_config" to "authenticated";

grant delete on table "public"."cta_config" to "service_role";

grant insert on table "public"."cta_config" to "service_role";

grant references on table "public"."cta_config" to "service_role";

grant select on table "public"."cta_config" to "service_role";

grant trigger on table "public"."cta_config" to "service_role";

grant truncate on table "public"."cta_config" to "service_role";

grant update on table "public"."cta_config" to "service_role";

grant delete on table "public"."featured_products_config" to "anon";

grant insert on table "public"."featured_products_config" to "anon";

grant references on table "public"."featured_products_config" to "anon";

grant select on table "public"."featured_products_config" to "anon";

grant trigger on table "public"."featured_products_config" to "anon";

grant truncate on table "public"."featured_products_config" to "anon";

grant update on table "public"."featured_products_config" to "anon";

grant delete on table "public"."featured_products_config" to "authenticated";

grant insert on table "public"."featured_products_config" to "authenticated";

grant references on table "public"."featured_products_config" to "authenticated";

grant select on table "public"."featured_products_config" to "authenticated";

grant trigger on table "public"."featured_products_config" to "authenticated";

grant truncate on table "public"."featured_products_config" to "authenticated";

grant update on table "public"."featured_products_config" to "authenticated";

grant delete on table "public"."featured_products_config" to "service_role";

grant insert on table "public"."featured_products_config" to "service_role";

grant references on table "public"."featured_products_config" to "service_role";

grant select on table "public"."featured_products_config" to "service_role";

grant trigger on table "public"."featured_products_config" to "service_role";

grant truncate on table "public"."featured_products_config" to "service_role";

grant update on table "public"."featured_products_config" to "service_role";

grant delete on table "public"."featured_programs_config" to "anon";

grant insert on table "public"."featured_programs_config" to "anon";

grant references on table "public"."featured_programs_config" to "anon";

grant select on table "public"."featured_programs_config" to "anon";

grant trigger on table "public"."featured_programs_config" to "anon";

grant truncate on table "public"."featured_programs_config" to "anon";

grant update on table "public"."featured_programs_config" to "anon";

grant delete on table "public"."featured_programs_config" to "authenticated";

grant insert on table "public"."featured_programs_config" to "authenticated";

grant references on table "public"."featured_programs_config" to "authenticated";

grant select on table "public"."featured_programs_config" to "authenticated";

grant trigger on table "public"."featured_programs_config" to "authenticated";

grant truncate on table "public"."featured_programs_config" to "authenticated";

grant update on table "public"."featured_programs_config" to "authenticated";

grant delete on table "public"."featured_programs_config" to "service_role";

grant insert on table "public"."featured_programs_config" to "service_role";

grant references on table "public"."featured_programs_config" to "service_role";

grant select on table "public"."featured_programs_config" to "service_role";

grant trigger on table "public"."featured_programs_config" to "service_role";

grant truncate on table "public"."featured_programs_config" to "service_role";

grant update on table "public"."featured_programs_config" to "service_role";

grant delete on table "public"."features" to "anon";

grant insert on table "public"."features" to "anon";

grant references on table "public"."features" to "anon";

grant select on table "public"."features" to "anon";

grant trigger on table "public"."features" to "anon";

grant truncate on table "public"."features" to "anon";

grant update on table "public"."features" to "anon";

grant delete on table "public"."features" to "authenticated";

grant insert on table "public"."features" to "authenticated";

grant references on table "public"."features" to "authenticated";

grant select on table "public"."features" to "authenticated";

grant trigger on table "public"."features" to "authenticated";

grant truncate on table "public"."features" to "authenticated";

grant update on table "public"."features" to "authenticated";

grant delete on table "public"."features" to "service_role";

grant insert on table "public"."features" to "service_role";

grant references on table "public"."features" to "service_role";

grant select on table "public"."features" to "service_role";

grant trigger on table "public"."features" to "service_role";

grant truncate on table "public"."features" to "service_role";

grant update on table "public"."features" to "service_role";

grant delete on table "public"."hero_config" to "anon";

grant insert on table "public"."hero_config" to "anon";

grant references on table "public"."hero_config" to "anon";

grant select on table "public"."hero_config" to "anon";

grant trigger on table "public"."hero_config" to "anon";

grant truncate on table "public"."hero_config" to "anon";

grant update on table "public"."hero_config" to "anon";

grant delete on table "public"."hero_config" to "authenticated";

grant insert on table "public"."hero_config" to "authenticated";

grant references on table "public"."hero_config" to "authenticated";

grant select on table "public"."hero_config" to "authenticated";

grant trigger on table "public"."hero_config" to "authenticated";

grant truncate on table "public"."hero_config" to "authenticated";

grant update on table "public"."hero_config" to "authenticated";

grant delete on table "public"."hero_config" to "service_role";

grant insert on table "public"."hero_config" to "service_role";

grant references on table "public"."hero_config" to "service_role";

grant select on table "public"."hero_config" to "service_role";

grant trigger on table "public"."hero_config" to "service_role";

grant truncate on table "public"."hero_config" to "service_role";

grant update on table "public"."hero_config" to "service_role";

grant delete on table "public"."hero_slides" to "anon";

grant insert on table "public"."hero_slides" to "anon";

grant references on table "public"."hero_slides" to "anon";

grant select on table "public"."hero_slides" to "anon";

grant trigger on table "public"."hero_slides" to "anon";

grant truncate on table "public"."hero_slides" to "anon";

grant update on table "public"."hero_slides" to "anon";

grant delete on table "public"."hero_slides" to "authenticated";

grant insert on table "public"."hero_slides" to "authenticated";

grant references on table "public"."hero_slides" to "authenticated";

grant select on table "public"."hero_slides" to "authenticated";

grant trigger on table "public"."hero_slides" to "authenticated";

grant truncate on table "public"."hero_slides" to "authenticated";

grant update on table "public"."hero_slides" to "authenticated";

grant delete on table "public"."hero_slides" to "service_role";

grant insert on table "public"."hero_slides" to "service_role";

grant references on table "public"."hero_slides" to "service_role";

grant select on table "public"."hero_slides" to "service_role";

grant trigger on table "public"."hero_slides" to "service_role";

grant truncate on table "public"."hero_slides" to "service_role";

grant update on table "public"."hero_slides" to "service_role";

grant delete on table "public"."home_components" to "anon";

grant insert on table "public"."home_components" to "anon";

grant references on table "public"."home_components" to "anon";

grant select on table "public"."home_components" to "anon";

grant trigger on table "public"."home_components" to "anon";

grant truncate on table "public"."home_components" to "anon";

grant update on table "public"."home_components" to "anon";

grant delete on table "public"."home_components" to "authenticated";

grant insert on table "public"."home_components" to "authenticated";

grant references on table "public"."home_components" to "authenticated";

grant select on table "public"."home_components" to "authenticated";

grant trigger on table "public"."home_components" to "authenticated";

grant truncate on table "public"."home_components" to "authenticated";

grant update on table "public"."home_components" to "authenticated";

grant delete on table "public"."home_components" to "service_role";

grant insert on table "public"."home_components" to "service_role";

grant references on table "public"."home_components" to "service_role";

grant select on table "public"."home_components" to "service_role";

grant trigger on table "public"."home_components" to "service_role";

grant truncate on table "public"."home_components" to "service_role";

grant update on table "public"."home_components" to "service_role";

grant delete on table "public"."home_page_components" to "anon";

grant insert on table "public"."home_page_components" to "anon";

grant references on table "public"."home_page_components" to "anon";

grant select on table "public"."home_page_components" to "anon";

grant trigger on table "public"."home_page_components" to "anon";

grant truncate on table "public"."home_page_components" to "anon";

grant update on table "public"."home_page_components" to "anon";

grant delete on table "public"."home_page_components" to "authenticated";

grant insert on table "public"."home_page_components" to "authenticated";

grant references on table "public"."home_page_components" to "authenticated";

grant select on table "public"."home_page_components" to "authenticated";

grant trigger on table "public"."home_page_components" to "authenticated";

grant truncate on table "public"."home_page_components" to "authenticated";

grant update on table "public"."home_page_components" to "authenticated";

grant delete on table "public"."home_page_components" to "service_role";

grant insert on table "public"."home_page_components" to "service_role";

grant references on table "public"."home_page_components" to "service_role";

grant select on table "public"."home_page_components" to "service_role";

grant trigger on table "public"."home_page_components" to "service_role";

grant truncate on table "public"."home_page_components" to "service_role";

grant update on table "public"."home_page_components" to "service_role";

grant delete on table "public"."home_page_config" to "anon";

grant insert on table "public"."home_page_config" to "anon";

grant references on table "public"."home_page_config" to "anon";

grant select on table "public"."home_page_config" to "anon";

grant trigger on table "public"."home_page_config" to "anon";

grant truncate on table "public"."home_page_config" to "anon";

grant update on table "public"."home_page_config" to "anon";

grant delete on table "public"."home_page_config" to "authenticated";

grant insert on table "public"."home_page_config" to "authenticated";

grant references on table "public"."home_page_config" to "authenticated";

grant select on table "public"."home_page_config" to "authenticated";

grant trigger on table "public"."home_page_config" to "authenticated";

grant truncate on table "public"."home_page_config" to "authenticated";

grant update on table "public"."home_page_config" to "authenticated";

grant delete on table "public"."home_page_config" to "service_role";

grant insert on table "public"."home_page_config" to "service_role";

grant references on table "public"."home_page_config" to "service_role";

grant select on table "public"."home_page_config" to "service_role";

grant trigger on table "public"."home_page_config" to "service_role";

grant truncate on table "public"."home_page_config" to "service_role";

grant update on table "public"."home_page_config" to "service_role";

grant delete on table "public"."home_sections" to "anon";

grant insert on table "public"."home_sections" to "anon";

grant references on table "public"."home_sections" to "anon";

grant select on table "public"."home_sections" to "anon";

grant trigger on table "public"."home_sections" to "anon";

grant truncate on table "public"."home_sections" to "anon";

grant update on table "public"."home_sections" to "anon";

grant delete on table "public"."home_sections" to "authenticated";

grant insert on table "public"."home_sections" to "authenticated";

grant references on table "public"."home_sections" to "authenticated";

grant select on table "public"."home_sections" to "authenticated";

grant trigger on table "public"."home_sections" to "authenticated";

grant truncate on table "public"."home_sections" to "authenticated";

grant update on table "public"."home_sections" to "authenticated";

grant delete on table "public"."home_sections" to "service_role";

grant insert on table "public"."home_sections" to "service_role";

grant references on table "public"."home_sections" to "service_role";

grant select on table "public"."home_sections" to "service_role";

grant trigger on table "public"."home_sections" to "service_role";

grant truncate on table "public"."home_sections" to "service_role";

grant update on table "public"."home_sections" to "service_role";

grant delete on table "public"."icons_reference" to "anon";

grant insert on table "public"."icons_reference" to "anon";

grant references on table "public"."icons_reference" to "anon";

grant select on table "public"."icons_reference" to "anon";

grant trigger on table "public"."icons_reference" to "anon";

grant truncate on table "public"."icons_reference" to "anon";

grant update on table "public"."icons_reference" to "anon";

grant delete on table "public"."icons_reference" to "authenticated";

grant insert on table "public"."icons_reference" to "authenticated";

grant references on table "public"."icons_reference" to "authenticated";

grant select on table "public"."icons_reference" to "authenticated";

grant trigger on table "public"."icons_reference" to "authenticated";

grant truncate on table "public"."icons_reference" to "authenticated";

grant update on table "public"."icons_reference" to "authenticated";

grant delete on table "public"."icons_reference" to "service_role";

grant insert on table "public"."icons_reference" to "service_role";

grant references on table "public"."icons_reference" to "service_role";

grant select on table "public"."icons_reference" to "service_role";

grant trigger on table "public"."icons_reference" to "service_role";

grant truncate on table "public"."icons_reference" to "service_role";

grant update on table "public"."icons_reference" to "service_role";

grant delete on table "public"."image_dimensions" to "anon";

grant insert on table "public"."image_dimensions" to "anon";

grant references on table "public"."image_dimensions" to "anon";

grant select on table "public"."image_dimensions" to "anon";

grant trigger on table "public"."image_dimensions" to "anon";

grant truncate on table "public"."image_dimensions" to "anon";

grant update on table "public"."image_dimensions" to "anon";

grant delete on table "public"."image_dimensions" to "authenticated";

grant insert on table "public"."image_dimensions" to "authenticated";

grant references on table "public"."image_dimensions" to "authenticated";

grant select on table "public"."image_dimensions" to "authenticated";

grant trigger on table "public"."image_dimensions" to "authenticated";

grant truncate on table "public"."image_dimensions" to "authenticated";

grant update on table "public"."image_dimensions" to "authenticated";

grant delete on table "public"."image_dimensions" to "service_role";

grant insert on table "public"."image_dimensions" to "service_role";

grant references on table "public"."image_dimensions" to "service_role";

grant select on table "public"."image_dimensions" to "service_role";

grant trigger on table "public"."image_dimensions" to "service_role";

grant truncate on table "public"."image_dimensions" to "service_role";

grant update on table "public"."image_dimensions" to "service_role";

grant delete on table "public"."image_sizes" to "anon";

grant insert on table "public"."image_sizes" to "anon";

grant references on table "public"."image_sizes" to "anon";

grant select on table "public"."image_sizes" to "anon";

grant trigger on table "public"."image_sizes" to "anon";

grant truncate on table "public"."image_sizes" to "anon";

grant update on table "public"."image_sizes" to "anon";

grant delete on table "public"."image_sizes" to "authenticated";

grant insert on table "public"."image_sizes" to "authenticated";

grant references on table "public"."image_sizes" to "authenticated";

grant select on table "public"."image_sizes" to "authenticated";

grant trigger on table "public"."image_sizes" to "authenticated";

grant truncate on table "public"."image_sizes" to "authenticated";

grant update on table "public"."image_sizes" to "authenticated";

grant delete on table "public"."image_sizes" to "service_role";

grant insert on table "public"."image_sizes" to "service_role";

grant references on table "public"."image_sizes" to "service_role";

grant select on table "public"."image_sizes" to "service_role";

grant trigger on table "public"."image_sizes" to "service_role";

grant truncate on table "public"."image_sizes" to "service_role";

grant update on table "public"."image_sizes" to "service_role";

grant delete on table "public"."images" to "anon";

grant insert on table "public"."images" to "anon";

grant references on table "public"."images" to "anon";

grant select on table "public"."images" to "anon";

grant trigger on table "public"."images" to "anon";

grant truncate on table "public"."images" to "anon";

grant update on table "public"."images" to "anon";

grant delete on table "public"."images" to "authenticated";

grant insert on table "public"."images" to "authenticated";

grant references on table "public"."images" to "authenticated";

grant select on table "public"."images" to "authenticated";

grant trigger on table "public"."images" to "authenticated";

grant truncate on table "public"."images" to "authenticated";

grant update on table "public"."images" to "authenticated";

grant delete on table "public"."images" to "service_role";

grant insert on table "public"."images" to "service_role";

grant references on table "public"."images" to "service_role";

grant select on table "public"."images" to "service_role";

grant trigger on table "public"."images" to "service_role";

grant truncate on table "public"."images" to "service_role";

grant update on table "public"."images" to "service_role";

grant delete on table "public"."instructors" to "anon";

grant insert on table "public"."instructors" to "anon";

grant references on table "public"."instructors" to "anon";

grant select on table "public"."instructors" to "anon";

grant trigger on table "public"."instructors" to "anon";

grant truncate on table "public"."instructors" to "anon";

grant update on table "public"."instructors" to "anon";

grant delete on table "public"."instructors" to "authenticated";

grant insert on table "public"."instructors" to "authenticated";

grant references on table "public"."instructors" to "authenticated";

grant select on table "public"."instructors" to "authenticated";

grant trigger on table "public"."instructors" to "authenticated";

grant truncate on table "public"."instructors" to "authenticated";

grant update on table "public"."instructors" to "authenticated";

grant delete on table "public"."instructors" to "service_role";

grant insert on table "public"."instructors" to "service_role";

grant references on table "public"."instructors" to "service_role";

grant select on table "public"."instructors" to "service_role";

grant trigger on table "public"."instructors" to "service_role";

grant truncate on table "public"."instructors" to "service_role";

grant update on table "public"."instructors" to "service_role";

grant delete on table "public"."insurance_providers" to "anon";

grant insert on table "public"."insurance_providers" to "anon";

grant references on table "public"."insurance_providers" to "anon";

grant select on table "public"."insurance_providers" to "anon";

grant trigger on table "public"."insurance_providers" to "anon";

grant truncate on table "public"."insurance_providers" to "anon";

grant update on table "public"."insurance_providers" to "anon";

grant delete on table "public"."insurance_providers" to "authenticated";

grant insert on table "public"."insurance_providers" to "authenticated";

grant references on table "public"."insurance_providers" to "authenticated";

grant select on table "public"."insurance_providers" to "authenticated";

grant trigger on table "public"."insurance_providers" to "authenticated";

grant truncate on table "public"."insurance_providers" to "authenticated";

grant update on table "public"."insurance_providers" to "authenticated";

grant delete on table "public"."insurance_providers" to "service_role";

grant insert on table "public"."insurance_providers" to "service_role";

grant references on table "public"."insurance_providers" to "service_role";

grant select on table "public"."insurance_providers" to "service_role";

grant trigger on table "public"."insurance_providers" to "service_role";

grant truncate on table "public"."insurance_providers" to "service_role";

grant update on table "public"."insurance_providers" to "service_role";

grant delete on table "public"."location_section" to "anon";

grant insert on table "public"."location_section" to "anon";

grant references on table "public"."location_section" to "anon";

grant select on table "public"."location_section" to "anon";

grant trigger on table "public"."location_section" to "anon";

grant truncate on table "public"."location_section" to "anon";

grant update on table "public"."location_section" to "anon";

grant delete on table "public"."location_section" to "authenticated";

grant insert on table "public"."location_section" to "authenticated";

grant references on table "public"."location_section" to "authenticated";

grant select on table "public"."location_section" to "authenticated";

grant trigger on table "public"."location_section" to "authenticated";

grant truncate on table "public"."location_section" to "authenticated";

grant update on table "public"."location_section" to "authenticated";

grant delete on table "public"."location_section" to "service_role";

grant insert on table "public"."location_section" to "service_role";

grant references on table "public"."location_section" to "service_role";

grant select on table "public"."location_section" to "service_role";

grant trigger on table "public"."location_section" to "service_role";

grant truncate on table "public"."location_section" to "service_role";

grant update on table "public"."location_section" to "service_role";

grant delete on table "public"."menu_items" to "anon";

grant insert on table "public"."menu_items" to "anon";

grant references on table "public"."menu_items" to "anon";

grant select on table "public"."menu_items" to "anon";

grant trigger on table "public"."menu_items" to "anon";

grant truncate on table "public"."menu_items" to "anon";

grant update on table "public"."menu_items" to "anon";

grant delete on table "public"."menu_items" to "authenticated";

grant insert on table "public"."menu_items" to "authenticated";

grant references on table "public"."menu_items" to "authenticated";

grant select on table "public"."menu_items" to "authenticated";

grant trigger on table "public"."menu_items" to "authenticated";

grant truncate on table "public"."menu_items" to "authenticated";

grant update on table "public"."menu_items" to "authenticated";

grant delete on table "public"."menu_items" to "service_role";

grant insert on table "public"."menu_items" to "service_role";

grant references on table "public"."menu_items" to "service_role";

grant select on table "public"."menu_items" to "service_role";

grant trigger on table "public"."menu_items" to "service_role";

grant truncate on table "public"."menu_items" to "service_role";

grant update on table "public"."menu_items" to "service_role";

grant delete on table "public"."methodology" to "anon";

grant insert on table "public"."methodology" to "anon";

grant references on table "public"."methodology" to "anon";

grant select on table "public"."methodology" to "anon";

grant trigger on table "public"."methodology" to "anon";

grant truncate on table "public"."methodology" to "anon";

grant update on table "public"."methodology" to "anon";

grant delete on table "public"."methodology" to "authenticated";

grant insert on table "public"."methodology" to "authenticated";

grant references on table "public"."methodology" to "authenticated";

grant select on table "public"."methodology" to "authenticated";

grant trigger on table "public"."methodology" to "authenticated";

grant truncate on table "public"."methodology" to "authenticated";

grant update on table "public"."methodology" to "authenticated";

grant delete on table "public"."methodology" to "service_role";

grant insert on table "public"."methodology" to "service_role";

grant references on table "public"."methodology" to "service_role";

grant select on table "public"."methodology" to "service_role";

grant trigger on table "public"."methodology" to "service_role";

grant truncate on table "public"."methodology" to "service_role";

grant update on table "public"."methodology" to "service_role";

grant delete on table "public"."page_stats" to "anon";

grant insert on table "public"."page_stats" to "anon";

grant references on table "public"."page_stats" to "anon";

grant select on table "public"."page_stats" to "anon";

grant trigger on table "public"."page_stats" to "anon";

grant truncate on table "public"."page_stats" to "anon";

grant update on table "public"."page_stats" to "anon";

grant delete on table "public"."page_stats" to "authenticated";

grant insert on table "public"."page_stats" to "authenticated";

grant references on table "public"."page_stats" to "authenticated";

grant select on table "public"."page_stats" to "authenticated";

grant trigger on table "public"."page_stats" to "authenticated";

grant truncate on table "public"."page_stats" to "authenticated";

grant update on table "public"."page_stats" to "authenticated";

grant delete on table "public"."page_stats" to "service_role";

grant insert on table "public"."page_stats" to "service_role";

grant references on table "public"."page_stats" to "service_role";

grant select on table "public"."page_stats" to "service_role";

grant trigger on table "public"."page_stats" to "service_role";

grant truncate on table "public"."page_stats" to "service_role";

grant update on table "public"."page_stats" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."programs" to "anon";

grant insert on table "public"."programs" to "anon";

grant references on table "public"."programs" to "anon";

grant select on table "public"."programs" to "anon";

grant trigger on table "public"."programs" to "anon";

grant truncate on table "public"."programs" to "anon";

grant update on table "public"."programs" to "anon";

grant delete on table "public"."programs" to "authenticated";

grant insert on table "public"."programs" to "authenticated";

grant references on table "public"."programs" to "authenticated";

grant select on table "public"."programs" to "authenticated";

grant trigger on table "public"."programs" to "authenticated";

grant truncate on table "public"."programs" to "authenticated";

grant update on table "public"."programs" to "authenticated";

grant delete on table "public"."programs" to "service_role";

grant insert on table "public"."programs" to "service_role";

grant references on table "public"."programs" to "service_role";

grant select on table "public"."programs" to "service_role";

grant trigger on table "public"."programs" to "service_role";

grant truncate on table "public"."programs" to "service_role";

grant update on table "public"."programs" to "service_role";

grant delete on table "public"."schedule_classes" to "anon";

grant insert on table "public"."schedule_classes" to "anon";

grant references on table "public"."schedule_classes" to "anon";

grant select on table "public"."schedule_classes" to "anon";

grant trigger on table "public"."schedule_classes" to "anon";

grant truncate on table "public"."schedule_classes" to "anon";

grant update on table "public"."schedule_classes" to "anon";

grant delete on table "public"."schedule_classes" to "authenticated";

grant insert on table "public"."schedule_classes" to "authenticated";

grant references on table "public"."schedule_classes" to "authenticated";

grant select on table "public"."schedule_classes" to "authenticated";

grant trigger on table "public"."schedule_classes" to "authenticated";

grant truncate on table "public"."schedule_classes" to "authenticated";

grant update on table "public"."schedule_classes" to "authenticated";

grant delete on table "public"."schedule_classes" to "service_role";

grant insert on table "public"."schedule_classes" to "service_role";

grant references on table "public"."schedule_classes" to "service_role";

grant select on table "public"."schedule_classes" to "service_role";

grant trigger on table "public"."schedule_classes" to "service_role";

grant truncate on table "public"."schedule_classes" to "service_role";

grant update on table "public"."schedule_classes" to "service_role";

grant delete on table "public"."schema_migrations" to "anon";

grant insert on table "public"."schema_migrations" to "anon";

grant references on table "public"."schema_migrations" to "anon";

grant select on table "public"."schema_migrations" to "anon";

grant trigger on table "public"."schema_migrations" to "anon";

grant truncate on table "public"."schema_migrations" to "anon";

grant update on table "public"."schema_migrations" to "anon";

grant delete on table "public"."schema_migrations" to "authenticated";

grant insert on table "public"."schema_migrations" to "authenticated";

grant references on table "public"."schema_migrations" to "authenticated";

grant select on table "public"."schema_migrations" to "authenticated";

grant trigger on table "public"."schema_migrations" to "authenticated";

grant truncate on table "public"."schema_migrations" to "authenticated";

grant update on table "public"."schema_migrations" to "authenticated";

grant delete on table "public"."schema_migrations" to "service_role";

grant insert on table "public"."schema_migrations" to "service_role";

grant references on table "public"."schema_migrations" to "service_role";

grant select on table "public"."schema_migrations" to "service_role";

grant trigger on table "public"."schema_migrations" to "service_role";

grant truncate on table "public"."schema_migrations" to "service_role";

grant update on table "public"."schema_migrations" to "service_role";

grant delete on table "public"."section_image_sizes" to "anon";

grant insert on table "public"."section_image_sizes" to "anon";

grant references on table "public"."section_image_sizes" to "anon";

grant select on table "public"."section_image_sizes" to "anon";

grant trigger on table "public"."section_image_sizes" to "anon";

grant truncate on table "public"."section_image_sizes" to "anon";

grant update on table "public"."section_image_sizes" to "anon";

grant delete on table "public"."section_image_sizes" to "authenticated";

grant insert on table "public"."section_image_sizes" to "authenticated";

grant references on table "public"."section_image_sizes" to "authenticated";

grant select on table "public"."section_image_sizes" to "authenticated";

grant trigger on table "public"."section_image_sizes" to "authenticated";

grant truncate on table "public"."section_image_sizes" to "authenticated";

grant update on table "public"."section_image_sizes" to "authenticated";

grant delete on table "public"."section_image_sizes" to "service_role";

grant insert on table "public"."section_image_sizes" to "service_role";

grant references on table "public"."section_image_sizes" to "service_role";

grant select on table "public"."section_image_sizes" to "service_role";

grant trigger on table "public"."section_image_sizes" to "service_role";

grant truncate on table "public"."section_image_sizes" to "service_role";

grant update on table "public"."section_image_sizes" to "service_role";

grant delete on table "public"."settings" to "anon";

grant insert on table "public"."settings" to "anon";

grant references on table "public"."settings" to "anon";

grant select on table "public"."settings" to "anon";

grant trigger on table "public"."settings" to "anon";

grant truncate on table "public"."settings" to "anon";

grant update on table "public"."settings" to "anon";

grant delete on table "public"."settings" to "authenticated";

grant insert on table "public"."settings" to "authenticated";

grant references on table "public"."settings" to "authenticated";

grant select on table "public"."settings" to "authenticated";

grant trigger on table "public"."settings" to "authenticated";

grant truncate on table "public"."settings" to "authenticated";

grant update on table "public"."settings" to "authenticated";

grant delete on table "public"."settings" to "service_role";

grant insert on table "public"."settings" to "service_role";

grant references on table "public"."settings" to "service_role";

grant select on table "public"."settings" to "service_role";

grant trigger on table "public"."settings" to "service_role";

grant truncate on table "public"."settings" to "service_role";

grant update on table "public"."settings" to "service_role";

grant delete on table "public"."settings_categories" to "anon";

grant insert on table "public"."settings_categories" to "anon";

grant references on table "public"."settings_categories" to "anon";

grant select on table "public"."settings_categories" to "anon";

grant trigger on table "public"."settings_categories" to "anon";

grant truncate on table "public"."settings_categories" to "anon";

grant update on table "public"."settings_categories" to "anon";

grant delete on table "public"."settings_categories" to "authenticated";

grant insert on table "public"."settings_categories" to "authenticated";

grant references on table "public"."settings_categories" to "authenticated";

grant select on table "public"."settings_categories" to "authenticated";

grant trigger on table "public"."settings_categories" to "authenticated";

grant truncate on table "public"."settings_categories" to "authenticated";

grant update on table "public"."settings_categories" to "authenticated";

grant delete on table "public"."settings_categories" to "service_role";

grant insert on table "public"."settings_categories" to "service_role";

grant references on table "public"."settings_categories" to "service_role";

grant select on table "public"."settings_categories" to "service_role";

grant trigger on table "public"."settings_categories" to "service_role";

grant truncate on table "public"."settings_categories" to "service_role";

grant update on table "public"."settings_categories" to "service_role";

grant delete on table "public"."settings_sections" to "anon";

grant insert on table "public"."settings_sections" to "anon";

grant references on table "public"."settings_sections" to "anon";

grant select on table "public"."settings_sections" to "anon";

grant trigger on table "public"."settings_sections" to "anon";

grant truncate on table "public"."settings_sections" to "anon";

grant update on table "public"."settings_sections" to "anon";

grant delete on table "public"."settings_sections" to "authenticated";

grant insert on table "public"."settings_sections" to "authenticated";

grant references on table "public"."settings_sections" to "authenticated";

grant select on table "public"."settings_sections" to "authenticated";

grant trigger on table "public"."settings_sections" to "authenticated";

grant truncate on table "public"."settings_sections" to "authenticated";

grant update on table "public"."settings_sections" to "authenticated";

grant delete on table "public"."settings_sections" to "service_role";

grant insert on table "public"."settings_sections" to "service_role";

grant references on table "public"."settings_sections" to "service_role";

grant select on table "public"."settings_sections" to "service_role";

grant trigger on table "public"."settings_sections" to "service_role";

grant truncate on table "public"."settings_sections" to "service_role";

grant update on table "public"."settings_sections" to "service_role";

grant delete on table "public"."site_config" to "anon";

grant insert on table "public"."site_config" to "anon";

grant references on table "public"."site_config" to "anon";

grant select on table "public"."site_config" to "anon";

grant trigger on table "public"."site_config" to "anon";

grant truncate on table "public"."site_config" to "anon";

grant update on table "public"."site_config" to "anon";

grant delete on table "public"."site_config" to "authenticated";

grant insert on table "public"."site_config" to "authenticated";

grant references on table "public"."site_config" to "authenticated";

grant select on table "public"."site_config" to "authenticated";

grant trigger on table "public"."site_config" to "authenticated";

grant truncate on table "public"."site_config" to "authenticated";

grant update on table "public"."site_config" to "authenticated";

grant delete on table "public"."site_config" to "service_role";

grant insert on table "public"."site_config" to "service_role";

grant references on table "public"."site_config" to "service_role";

grant select on table "public"."site_config" to "service_role";

grant trigger on table "public"."site_config" to "service_role";

grant truncate on table "public"."site_config" to "service_role";

grant update on table "public"."site_config" to "service_role";

grant delete on table "public"."site_content" to "anon";

grant insert on table "public"."site_content" to "anon";

grant references on table "public"."site_content" to "anon";

grant select on table "public"."site_content" to "anon";

grant trigger on table "public"."site_content" to "anon";

grant truncate on table "public"."site_content" to "anon";

grant update on table "public"."site_content" to "anon";

grant delete on table "public"."site_content" to "authenticated";

grant insert on table "public"."site_content" to "authenticated";

grant references on table "public"."site_content" to "authenticated";

grant select on table "public"."site_content" to "authenticated";

grant trigger on table "public"."site_content" to "authenticated";

grant truncate on table "public"."site_content" to "authenticated";

grant update on table "public"."site_content" to "authenticated";

grant delete on table "public"."site_content" to "service_role";

grant insert on table "public"."site_content" to "service_role";

grant references on table "public"."site_content" to "service_role";

grant select on table "public"."site_content" to "service_role";

grant trigger on table "public"."site_content" to "service_role";

grant truncate on table "public"."site_content" to "service_role";

grant update on table "public"."site_content" to "service_role";

grant delete on table "public"."site_images" to "anon";

grant insert on table "public"."site_images" to "anon";

grant references on table "public"."site_images" to "anon";

grant select on table "public"."site_images" to "anon";

grant trigger on table "public"."site_images" to "anon";

grant truncate on table "public"."site_images" to "anon";

grant update on table "public"."site_images" to "anon";

grant delete on table "public"."site_images" to "authenticated";

grant insert on table "public"."site_images" to "authenticated";

grant references on table "public"."site_images" to "authenticated";

grant select on table "public"."site_images" to "authenticated";

grant trigger on table "public"."site_images" to "authenticated";

grant truncate on table "public"."site_images" to "authenticated";

grant update on table "public"."site_images" to "authenticated";

grant delete on table "public"."site_images" to "service_role";

grant insert on table "public"."site_images" to "service_role";

grant references on table "public"."site_images" to "service_role";

grant select on table "public"."site_images" to "service_role";

grant trigger on table "public"."site_images" to "service_role";

grant truncate on table "public"."site_images" to "service_role";

grant update on table "public"."site_images" to "service_role";

grant delete on table "public"."site_settings" to "anon";

grant insert on table "public"."site_settings" to "anon";

grant references on table "public"."site_settings" to "anon";

grant select on table "public"."site_settings" to "anon";

grant trigger on table "public"."site_settings" to "anon";

grant truncate on table "public"."site_settings" to "anon";

grant update on table "public"."site_settings" to "anon";

grant delete on table "public"."site_settings" to "authenticated";

grant insert on table "public"."site_settings" to "authenticated";

grant references on table "public"."site_settings" to "authenticated";

grant select on table "public"."site_settings" to "authenticated";

grant trigger on table "public"."site_settings" to "authenticated";

grant truncate on table "public"."site_settings" to "authenticated";

grant update on table "public"."site_settings" to "authenticated";

grant delete on table "public"."site_settings" to "service_role";

grant insert on table "public"."site_settings" to "service_role";

grant references on table "public"."site_settings" to "service_role";

grant select on table "public"."site_settings" to "service_role";

grant trigger on table "public"."site_settings" to "service_role";

grant truncate on table "public"."site_settings" to "service_role";

grant update on table "public"."site_settings" to "service_role";

grant delete on table "public"."special_schedule_classes" to "anon";

grant insert on table "public"."special_schedule_classes" to "anon";

grant references on table "public"."special_schedule_classes" to "anon";

grant select on table "public"."special_schedule_classes" to "anon";

grant trigger on table "public"."special_schedule_classes" to "anon";

grant truncate on table "public"."special_schedule_classes" to "anon";

grant update on table "public"."special_schedule_classes" to "anon";

grant delete on table "public"."special_schedule_classes" to "authenticated";

grant insert on table "public"."special_schedule_classes" to "authenticated";

grant references on table "public"."special_schedule_classes" to "authenticated";

grant select on table "public"."special_schedule_classes" to "authenticated";

grant trigger on table "public"."special_schedule_classes" to "authenticated";

grant truncate on table "public"."special_schedule_classes" to "authenticated";

grant update on table "public"."special_schedule_classes" to "authenticated";

grant delete on table "public"."special_schedule_classes" to "service_role";

grant insert on table "public"."special_schedule_classes" to "service_role";

grant references on table "public"."special_schedule_classes" to "service_role";

grant select on table "public"."special_schedule_classes" to "service_role";

grant trigger on table "public"."special_schedule_classes" to "service_role";

grant truncate on table "public"."special_schedule_classes" to "service_role";

grant update on table "public"."special_schedule_classes" to "service_role";

grant delete on table "public"."special_schedules" to "anon";

grant insert on table "public"."special_schedules" to "anon";

grant references on table "public"."special_schedules" to "anon";

grant select on table "public"."special_schedules" to "anon";

grant trigger on table "public"."special_schedules" to "anon";

grant truncate on table "public"."special_schedules" to "anon";

grant update on table "public"."special_schedules" to "anon";

grant delete on table "public"."special_schedules" to "authenticated";

grant insert on table "public"."special_schedules" to "authenticated";

grant references on table "public"."special_schedules" to "authenticated";

grant select on table "public"."special_schedules" to "authenticated";

grant trigger on table "public"."special_schedules" to "authenticated";

grant truncate on table "public"."special_schedules" to "authenticated";

grant update on table "public"."special_schedules" to "authenticated";

grant delete on table "public"."special_schedules" to "service_role";

grant insert on table "public"."special_schedules" to "service_role";

grant references on table "public"."special_schedules" to "service_role";

grant select on table "public"."special_schedules" to "service_role";

grant trigger on table "public"."special_schedules" to "service_role";

grant truncate on table "public"."special_schedules" to "service_role";

grant update on table "public"."special_schedules" to "service_role";

grant delete on table "public"."why_choose_cards" to "anon";

grant insert on table "public"."why_choose_cards" to "anon";

grant references on table "public"."why_choose_cards" to "anon";

grant select on table "public"."why_choose_cards" to "anon";

grant trigger on table "public"."why_choose_cards" to "anon";

grant truncate on table "public"."why_choose_cards" to "anon";

grant update on table "public"."why_choose_cards" to "anon";

grant delete on table "public"."why_choose_cards" to "authenticated";

grant insert on table "public"."why_choose_cards" to "authenticated";

grant references on table "public"."why_choose_cards" to "authenticated";

grant select on table "public"."why_choose_cards" to "authenticated";

grant trigger on table "public"."why_choose_cards" to "authenticated";

grant truncate on table "public"."why_choose_cards" to "authenticated";

grant update on table "public"."why_choose_cards" to "authenticated";

grant delete on table "public"."why_choose_cards" to "service_role";

grant insert on table "public"."why_choose_cards" to "service_role";

grant references on table "public"."why_choose_cards" to "service_role";

grant select on table "public"."why_choose_cards" to "service_role";

grant trigger on table "public"."why_choose_cards" to "service_role";

grant truncate on table "public"."why_choose_cards" to "service_role";

grant update on table "public"."why_choose_cards" to "service_role";

create policy "Allow authenticated users to manage about sections"
on "public"."about_sections"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to about sections"
on "public"."about_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage blog posts"
on "public"."blog_posts"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow authenticated users to manage blog_posts"
on "public"."blog_posts"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to blog posts"
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "Allow public read access to blog_posts"
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage class categories"
on "public"."categories"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to class categories"
on "public"."categories"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage contact settings"
on "public"."contact_settings"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to contact settings"
on "public"."contact_settings"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to delete cta_config"
on "public"."cta_config"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to insert cta_config"
on "public"."cta_config"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to update cta_config"
on "public"."cta_config"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access for cta_config"
on "public"."cta_config"
as permissive
for select
to public
using (true);


create policy "featured_programs_config_delete_policy"
on "public"."featured_programs_config"
as permissive
for delete
to authenticated, anon
using (true);


create policy "featured_programs_config_insert_policy"
on "public"."featured_programs_config"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "featured_programs_config_select_policy"
on "public"."featured_programs_config"
as permissive
for select
to authenticated, anon
using (true);


create policy "featured_programs_config_update_policy"
on "public"."featured_programs_config"
as permissive
for update
to authenticated, anon
using (true)
with check (true);


create policy "Allow authenticated users to manage home sections"
on "public"."home_sections"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to home sections"
on "public"."home_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage image dimensions"
on "public"."image_dimensions"
as permissive
for all
to authenticated
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access to image dimensions"
on "public"."image_dimensions"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage images"
on "public"."images"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to images"
on "public"."images"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage instructors"
on "public"."instructors"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to instructors"
on "public"."instructors"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage insurance providers"
on "public"."insurance_providers"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to insurance providers"
on "public"."insurance_providers"
as permissive
for select
to public
using (true);


create policy "Allow delete for authenticated users"
on "public"."location_section"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow insert for authenticated users"
on "public"."location_section"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow insert/update for authenticated users"
on "public"."location_section"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow select for all users"
on "public"."location_section"
as permissive
for select
to public
using (true);


create policy "Allow update for authenticated users"
on "public"."location_section"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to manage menu items"
on "public"."menu_items"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to menu items"
on "public"."menu_items"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to delete methodology"
on "public"."methodology"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to insert methodology"
on "public"."methodology"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to update methodology"
on "public"."methodology"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access for methodology"
on "public"."methodology"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage page stats"
on "public"."page_stats"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to page stats"
on "public"."page_stats"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage programs"
on "public"."programs"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow authenticated users to manage treatments"
on "public"."programs"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to programs"
on "public"."programs"
as permissive
for select
to public
using (true);


create policy "Allow public read access to published treatments"
on "public"."programs"
as permissive
for select
to public
using ((status = 'published'::text));


create policy "Allow authenticated users to manage schedule classes"
on "public"."schedule_classes"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to schedule classes"
on "public"."schedule_classes"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage settings"
on "public"."settings"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to settings"
on "public"."settings"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage settings categories"
on "public"."settings_categories"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to settings categories"
on "public"."settings_categories"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage settings sections"
on "public"."settings_sections"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to settings sections"
on "public"."settings_sections"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage site content"
on "public"."site_content"
as permissive
for all
to authenticated
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));


create policy "Allow public read access to site content"
on "public"."site_content"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage site images"
on "public"."site_images"
as permissive
for all
to authenticated
using ((auth.role() = 'authenticated'::text))
with check ((auth.role() = 'authenticated'::text));


create policy "Allow public read access to site images"
on "public"."site_images"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage special schedule classes"
on "public"."special_schedule_classes"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to special schedule classes"
on "public"."special_schedule_classes"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to manage special schedules"
on "public"."special_schedules"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Allow public read access to special schedules"
on "public"."special_schedules"
as permissive
for select
to public
using (true);


CREATE TRIGGER cleanup_about_sections_images BEFORE UPDATE ON public.about_sections FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER update_about_sections_updated_at BEFORE UPDATE ON public.about_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cleanup_blog_posts_images BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_cta_config_updated_at BEFORE UPDATE ON public.cta_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_featured_products_config_updated_at BEFORE UPDATE ON public.featured_products_config FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_featured_programs_config_updated_at BEFORE UPDATE ON public.featured_programs_config FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_config_updated_at BEFORE UPDATE ON public.hero_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_home_components_updated_at BEFORE UPDATE ON public.home_components FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_home_page_components_updated_at BEFORE UPDATE ON public.home_page_components FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER cleanup_home_sections_images BEFORE UPDATE ON public.home_sections FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER update_home_sections_updated_at BEFORE UPDATE ON public.home_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_icons_reference_updated_at BEFORE UPDATE ON public.icons_reference FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cleanup_image_dimensions_old BEFORE INSERT OR UPDATE ON public.image_dimensions FOR EACH ROW EXECUTE FUNCTION cleanup_image_dimensions();

CREATE TRIGGER update_image_dimensions_updated_at BEFORE UPDATE ON public.image_dimensions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cleanup_instructors_images BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER cleanup_insurance_providers_images BEFORE UPDATE ON public.insurance_providers FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER update_insurance_providers_updated_at BEFORE UPDATE ON public.insurance_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.location_section FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_methodology_updated_at BEFORE UPDATE ON public.methodology FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_page_stats_updated_at BEFORE UPDATE ON public.page_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cleanup_treatments_images BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION cleanup_unused_images();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_categories_updated_at BEFORE UPDATE ON public.settings_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_sections_updated_at BEFORE UPDATE ON public.settings_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER cleanup_site_images BEFORE DELETE OR UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION cleanup_old_site_images();

CREATE TRIGGER cleanup_site_images_old BEFORE INSERT OR UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION cleanup_site_images();

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_why_choose_cards_updated_at BEFORE UPDATE ON public.why_choose_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


