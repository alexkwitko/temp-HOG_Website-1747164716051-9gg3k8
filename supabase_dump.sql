

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."check_table_exists"("table_name_param" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."check_table_exists"("table_name_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_image_dimensions"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."cleanup_image_dimensions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_site_images"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."cleanup_old_site_images"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_site_images"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Delete old site_image entry if it exists
  DELETE FROM site_images 
  WHERE section = NEW.section 
    AND key = NEW.key 
    AND url != NEW.url;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."cleanup_site_images"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_unused_images"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."cleanup_unused_images"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."exec_sql"("sql" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;


ALTER FUNCTION "public"."exec_sql"("sql" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_image_referenced"("image_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;


ALTER FUNCTION "public"."is_image_referenced"("image_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."about_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "description" "text",
    "achievements" "jsonb" DEFAULT '[]'::"jsonb",
    "button_text" "text",
    "button_url" "text",
    "button_bg" "text" DEFAULT 'bg-yellow-500'::"text",
    "button_text_color" "text" DEFAULT 'text-black'::"text",
    "button_hover" "text" DEFAULT 'hover:bg-yellow-400'::"text",
    "button_padding_x" "text" DEFAULT 'px-6'::"text",
    "button_padding_y" "text" DEFAULT 'py-2'::"text",
    "button_font" "text" DEFAULT 'text-base'::"text",
    "button_mobile_width" "text" DEFAULT 'w-full'::"text",
    "button_desktop_width" "text" DEFAULT 'sm:w-auto'::"text",
    "image_id" "uuid",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_url" "text",
    "image_text" "text",
    "image_text_color" "text" DEFAULT 'text-white'::"text",
    "image_text_size" "text" DEFAULT 'text-xl'::"text",
    "image_hover_effect" "text" DEFAULT 'scale'::"text",
    "image_size" "text" DEFAULT 'medium'::"text"
);


ALTER TABLE "public"."about_sections" OWNER TO "postgres";


COMMENT ON COLUMN "public"."about_sections"."image_url" IS 'URL to navigate to when clicking the image';



COMMENT ON COLUMN "public"."about_sections"."image_text" IS 'Text overlay to display on the image';



COMMENT ON COLUMN "public"."about_sections"."image_text_color" IS 'Color class for the text overlay';



COMMENT ON COLUMN "public"."about_sections"."image_text_size" IS 'Size class for the text overlay';



COMMENT ON COLUMN "public"."about_sections"."image_hover_effect" IS 'Hover effect for the image (scale, fade, slide)';



COMMENT ON COLUMN "public"."about_sections"."image_size" IS 'Size of the image display (small, medium, large, xlarge)';



CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text",
    "content" "text" NOT NULL,
    "image_id" "uuid",
    "author" "text",
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "color" "text" NOT NULL,
    "icon" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."programs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "excerpt" "text",
    "content" "text" NOT NULL,
    "image_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "order" integer DEFAULT 0,
    "image_hover_effect" "text" DEFAULT 'scale'::"text",
    "image_size" "text" DEFAULT 'medium'::"text",
    "image_url" "text",
    "icon" "text",
    "icon_color" "text" DEFAULT '#111827'::"text",
    "background_color" "text" DEFAULT '#f9fafb'::"text",
    "text_color" "text" DEFAULT '#111827'::"text",
    "border_color" "text" DEFAULT '#e5e7eb'::"text",
    "border_width" integer DEFAULT 1,
    "border_radius" integer DEFAULT 8,
    "shadow_size" "text" DEFAULT 'md'::"text",
    "padding" "text" DEFAULT 'medium'::"text",
    "card_width" "text" DEFAULT 'medium'::"text",
    "card_height" "text" DEFAULT 'auto'::"text",
    "button_text" "text" DEFAULT 'Learn More'::"text",
    "button_color" "text" DEFAULT '#111827'::"text",
    "button_text_color" "text" DEFAULT '#ffffff'::"text",
    "button_border_radius" integer DEFAULT 4,
    "button_hover_color" "text" DEFAULT '#374151'::"text",
    "animation_type" "text" DEFAULT 'none'::"text",
    "hover_effect" "text" DEFAULT 'none'::"text",
    "level" "text",
    "duration" integer,
    "is_featured" boolean DEFAULT false,
    "layout_style" "text" DEFAULT 'standard'::"text",
    "content_alignment" "text" DEFAULT 'center'::"text",
    "image_position" "text" DEFAULT 'top'::"text",
    "display_priority" integer DEFAULT 10,
    "is_active" boolean DEFAULT true,
    "show_button" boolean DEFAULT true,
    "use_icon" boolean DEFAULT false,
    "title_alignment" "text" DEFAULT 'center'::"text",
    "category_id" "uuid",
    CONSTRAINT "treatments_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'hidden'::"text"])))
);


ALTER TABLE "public"."programs" OWNER TO "postgres";


COMMENT ON COLUMN "public"."programs"."slug" IS 'URL-friendly version of the title';



COMMENT ON COLUMN "public"."programs"."status" IS 'Publication status (published, draft)';



COMMENT ON COLUMN "public"."programs"."image_hover_effect" IS 'Hover effect for the image (scale, fade, slide)';



COMMENT ON COLUMN "public"."programs"."image_size" IS 'Size of the image display (small, medium, large, xlarge)';



COMMENT ON COLUMN "public"."programs"."hover_effect" IS 'Effect when hovering over card (none, lift, grow, shadow, glow)';



COMMENT ON COLUMN "public"."programs"."layout_style" IS 'Card layout style (standard, compact, featured, icon-only)';



COMMENT ON COLUMN "public"."programs"."content_alignment" IS 'Text alignment for content (left, center, right)';



COMMENT ON COLUMN "public"."programs"."is_active" IS 'Whether the program is currently active/visible on the site';



COMMENT ON COLUMN "public"."programs"."show_button" IS 'Whether to display the action button on the program card';



COMMENT ON COLUMN "public"."programs"."use_icon" IS 'Whether to use an icon instead of an image';



COMMENT ON COLUMN "public"."programs"."title_alignment" IS 'Text alignment for title (left, center, right)';



COMMENT ON COLUMN "public"."programs"."category_id" IS 'Foreign key reference to categories table';



CREATE OR REPLACE VIEW "public"."classes" AS
 SELECT "programs"."id",
    "programs"."title",
    "programs"."created_at",
    "programs"."updated_at"
   FROM "public"."programs";


ALTER TABLE "public"."classes" OWNER TO "postgres";


COMMENT ON VIEW "public"."classes" IS 'Legacy view that maps to the programs table for backward compatibility';



CREATE TABLE IF NOT EXISTS "public"."contact_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "text" NOT NULL,
    "label" "text",
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contact_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cta_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "heading" "text" DEFAULT 'Start Your Journey Today'::"text" NOT NULL,
    "subheading" "text" DEFAULT 'Join House of Grappling and experience the most effective martial art in the world.'::"text" NOT NULL,
    "primary_button_text" "text" DEFAULT 'Get Started'::"text",
    "primary_button_url" "text" DEFAULT '/contact'::"text",
    "secondary_button_text" "text" DEFAULT 'View Schedule'::"text",
    "secondary_button_url" "text" DEFAULT '/schedule'::"text",
    "background_color" "text" DEFAULT '#1A1A1A'::"text",
    "text_color" "text" DEFAULT '#FFFFFF'::"text",
    "button_primary_color" "text" DEFAULT '#FFFFFF'::"text",
    "button_primary_text_color" "text" DEFAULT '#1A1A1A'::"text",
    "button_secondary_color" "text" DEFAULT '#333333'::"text",
    "button_secondary_text_color" "text" DEFAULT '#FFFFFF'::"text",
    "background_image_url" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cta_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."featured_products_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "heading" "text" DEFAULT 'Featured Products'::"text",
    "subheading" "text" DEFAULT 'Shop our selection of high-quality products'::"text",
    "featured_product_ids" "uuid"[] DEFAULT ARRAY[]::"uuid"[],
    "background_color" "text" DEFAULT '#ffffff'::"text",
    "text_color" "text" DEFAULT '#000000'::"text",
    "button_text" "text" DEFAULT 'Shop Now'::"text",
    "button_url" "text" DEFAULT '/shop'::"text",
    "button_color" "text" DEFAULT '#000000'::"text",
    "button_text_color" "text" DEFAULT '#ffffff'::"text",
    "button_bg_color" "text" DEFAULT '#000000'::"text",
    "button_hover_color" "text" DEFAULT '#222222'::"text",
    "button_alignment" "text" DEFAULT 'center'::"text",
    "columns_layout" "text" DEFAULT '3'::"text",
    "enable_special_promotion" boolean DEFAULT false,
    "promoted_product_id" "uuid",
    "promotion_badge_text" "text" DEFAULT 'Featured'::"text",
    "promotion_badge_color" "text" DEFAULT '#ff0000'::"text",
    "promotion_badge_text_color" "text" DEFAULT '#ffffff'::"text",
    "show_preview" boolean DEFAULT true,
    "max_display_count" integer DEFAULT 3,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."featured_products_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."featured_programs_config" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "heading" "text" DEFAULT 'Featured Programs'::"text",
    "subheading" "text" DEFAULT 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.'::"text",
    "featured_program_ids" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."featured_programs_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."features" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon_name" "text" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."features" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hero_config" (
    "id" "text" NOT NULL,
    "text_background_settings" "jsonb" DEFAULT '{"color": "rgba(0,0,0,0.7)", "enabled": false, "opacity": 70}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hero_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hero_slides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "subtitle" "text",
    "description" "text",
    "text_color" "text" DEFAULT '#FFFFFF'::"text",
    "image_url" "text",
    "image_id" "text",
    "image_opacity" integer DEFAULT 100,
    "text_background" "jsonb" DEFAULT '{"size": "md", "color": "rgba(0,0,0,0.7)", "enabled": false, "opacity": 70, "padding": "16px"}'::"jsonb",
    "text_position" "jsonb" DEFAULT '{"vertical": "center", "horizontal": "center"}'::"jsonb",
    "button_text" "text",
    "button_url" "text",
    "button_active" boolean DEFAULT true,
    "button_bg" "text" DEFAULT '#000000'::"text",
    "button_text_color" "text" DEFAULT '#FFFFFF'::"text",
    "button_hover" "text" DEFAULT '#222222'::"text",
    "button_padding_x" "text" DEFAULT '16px'::"text",
    "button_padding_y" "text" DEFAULT '8px'::"text",
    "button_font" "text" DEFAULT 'inherit'::"text",
    "button_mobile_width" "text" DEFAULT '100%'::"text",
    "button_desktop_width" "text" DEFAULT 'auto'::"text",
    "secondary_button_text" "text",
    "secondary_button_url" "text",
    "secondary_button_active" boolean DEFAULT false,
    "secondary_button_bg" "text" DEFAULT '#FFFFFF'::"text",
    "secondary_button_text_color" "text" DEFAULT '#000000'::"text",
    "secondary_button_hover" "text" DEFAULT '#F5F5F5'::"text",
    "secondary_button_padding_x" "text" DEFAULT '16px'::"text",
    "secondary_button_padding_y" "text" DEFAULT '8px'::"text",
    "secondary_button_font" "text" DEFAULT 'inherit'::"text",
    "secondary_button_mobile_width" "text" DEFAULT '100%'::"text",
    "secondary_button_desktop_width" "text" DEFAULT 'auto'::"text",
    "order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."hero_slides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."home_components" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "component_type" "text",
    "title" "text",
    "description" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "background_color" "text" DEFAULT '#FFFFFF'::"text",
    "text_color" "text" DEFAULT '#000000'::"text",
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."home_components" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."home_page_components" (
    "id" "text" NOT NULL,
    "component_type" "text",
    "name" "text",
    "order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "background_color" "text" DEFAULT '#FFFFFF'::"text",
    "text_color" "text" DEFAULT '#000000'::"text",
    "border_color" "text" DEFAULT 'transparent'::"text",
    "border_width" integer DEFAULT 0,
    "border_radius" integer DEFAULT 0,
    "padding" "text" DEFAULT '0px'::"text",
    "margin" "text" DEFAULT '0px'::"text",
    "width" "text" DEFAULT '100%'::"text",
    "height" "text" DEFAULT 'auto'::"text",
    "vertical_align" "text" DEFAULT 'center'::"text",
    "horizontal_align" "text" DEFAULT 'center'::"text",
    "palette_override" "text",
    "text_background_enabled" boolean DEFAULT false,
    "text_background_color" "text" DEFAULT 'rgba(0,0,0,0.7)'::"text",
    "text_background_opacity" integer DEFAULT 70,
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."home_page_components" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."home_page_config" (
    "id" integer NOT NULL,
    "palette_id" "text",
    "use_site_palette" boolean DEFAULT true,
    "color_mode" "text" DEFAULT 'uniform'::"text"
);


ALTER TABLE "public"."home_page_config" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."home_page_config_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."home_page_config_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."home_page_config_id_seq" OWNED BY "public"."home_page_config"."id";



CREATE TABLE IF NOT EXISTS "public"."home_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "description" "text",
    "button_text" "text",
    "button_url" "text",
    "button_bg" "text" DEFAULT 'bg-yellow-500'::"text",
    "button_text_color" "text" DEFAULT 'text-black'::"text",
    "button_hover" "text" DEFAULT 'hover:bg-yellow-400'::"text",
    "button_padding_x" "text" DEFAULT 'px-6'::"text",
    "button_padding_y" "text" DEFAULT 'py-2'::"text",
    "button_font" "text" DEFAULT 'text-base'::"text",
    "button_mobile_width" "text" DEFAULT 'w-full'::"text",
    "button_desktop_width" "text" DEFAULT 'sm:w-auto'::"text",
    "secondary_button_text" "text",
    "secondary_button_url" "text",
    "secondary_button_bg" "text" DEFAULT 'bg-white/10'::"text",
    "secondary_button_text_color" "text" DEFAULT 'text-white'::"text",
    "secondary_button_hover" "text" DEFAULT 'hover:bg-white/20'::"text",
    "secondary_button_padding_x" "text" DEFAULT 'px-6'::"text",
    "secondary_button_padding_y" "text" DEFAULT 'py-2'::"text",
    "secondary_button_font" "text" DEFAULT 'text-base'::"text",
    "secondary_button_mobile_width" "text" DEFAULT 'w-full'::"text",
    "secondary_button_desktop_width" "text" DEFAULT 'sm:w-auto'::"text",
    "image_id" "uuid",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_hover_effect" "text" DEFAULT 'scale'::"text"
);


ALTER TABLE "public"."home_sections" OWNER TO "postgres";


COMMENT ON COLUMN "public"."home_sections"."image_hover_effect" IS 'Hover effect for the image (scale, fade, slide, zoom, blur, none)';



CREATE TABLE IF NOT EXISTS "public"."icons_reference" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "category" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."icons_reference" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."image_dimensions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "key" "text" NOT NULL,
    "height" "text" NOT NULL,
    "width" "text" NOT NULL,
    "object_fit" "text" DEFAULT 'contain'::"text" NOT NULL,
    "object_position" "text" DEFAULT 'center'::"text" NOT NULL,
    "pixel_width" integer,
    "pixel_height" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."image_dimensions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."image_sizes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "size" integer NOT NULL,
    "label" "text" NOT NULL,
    "is_preset" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."image_sizes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" NOT NULL,
    "alt_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instructors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "title" "text" NOT NULL,
    "bio" "text" NOT NULL,
    "image_id" "uuid",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_hover_effect" "text" DEFAULT 'scale'::"text",
    "image_size" "text" DEFAULT 'medium'::"text",
    "bio_summary" "text"
);


ALTER TABLE "public"."instructors" OWNER TO "postgres";


COMMENT ON COLUMN "public"."instructors"."image_hover_effect" IS 'Hover effect for the image (scale, fade, slide, zoom, blur, none)';



COMMENT ON COLUMN "public"."instructors"."image_size" IS 'Size of the image display (small, medium, large, xlarge)';



CREATE TABLE IF NOT EXISTS "public"."insurance_providers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "logo_id" "uuid",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."insurance_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."location_section" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "heading" "text" DEFAULT 'Conveniently Located in the Heart of Your City'::"text" NOT NULL,
    "address_line1" "text" DEFAULT '8801 Colorado Bend'::"text" NOT NULL,
    "address_line2" "text",
    "city" "text" DEFAULT 'Lantana'::"text" NOT NULL,
    "state" "text" DEFAULT 'TX'::"text" NOT NULL,
    "zip" "text" DEFAULT '76226'::"text" NOT NULL,
    "hours_weekday" "text" DEFAULT 'Monday - Friday: 9:00 AM - 9:00 PM'::"text" NOT NULL,
    "hours_saturday" "text" DEFAULT 'Saturday: 8:00 AM - 5:00 PM'::"text" NOT NULL,
    "hours_sunday" "text" DEFAULT 'Sunday: 10:00 AM - 3:00 PM'::"text" NOT NULL,
    "button_text" "text" DEFAULT 'Get Directions'::"text" NOT NULL,
    "button_url" "text" DEFAULT '/contact'::"text" NOT NULL,
    "map_embed_url" "text" DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.7232048623!2d-97.13213392367207!3d33.10241177279283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c33edb88f811f%3A0xdcfac8a1ffe9f412!2s8801%20Colorado%20Bend%2C%20Lantana%2C%20TX%2076226!5e0!3m2!1sen!2sus!4v1683245678901!5m2!1sen!2sus'::"text" NOT NULL,
    "use_custom_image" boolean DEFAULT false NOT NULL,
    "image_url" "text",
    "bg_color" "text" DEFAULT 'bg-neutral-900'::"text" NOT NULL,
    "text_color" "text" DEFAULT 'text-neutral-50'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."location_section" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."menu_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "url" "text" NOT NULL,
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."menu_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."methodology" (
    "id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon_name" "text" NOT NULL,
    "order" integer NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."methodology" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."page_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page" "text" NOT NULL,
    "label" "text" NOT NULL,
    "value" "text" NOT NULL,
    "bg_color" "text" DEFAULT 'bg-blue-100'::"text" NOT NULL,
    "text_color" "text" DEFAULT 'text-blue-800'::"text" NOT NULL,
    "description" "text",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."page_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(10,2),
    "image_url" "text",
    "image_id" "uuid",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schedule_classes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "day" "text" NOT NULL,
    "title" "text" NOT NULL,
    "category_id" "uuid",
    "instructor" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "start_time" "text" NOT NULL,
    "end_time" "text" NOT NULL,
    "is_closed" boolean DEFAULT false
);


ALTER TABLE "public"."schedule_classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schema_migrations" (
    "version" "text" NOT NULL,
    "name" "text" NOT NULL,
    "applied_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schema_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."section_image_sizes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "key" "text" NOT NULL,
    "size_name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."section_image_sizes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section_id" "uuid",
    "key" "text" NOT NULL,
    "value" "text",
    "label" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "placeholder" "text",
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text" NOT NULL,
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings_sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid",
    "name" "text" NOT NULL,
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings_sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "description" "text"
);


ALTER TABLE "public"."site_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_content" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "key" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "description" "text",
    "url" "text",
    "button_text" "text",
    "button_url" "text",
    "button_bg" "text",
    "button_text_color" "text",
    "button_hover" "text",
    "button_padding_x" "text",
    "button_padding_y" "text",
    "button_font" "text",
    "button_mobile_width" "text",
    "button_desktop_width" "text",
    "secondary_button_text" "text",
    "secondary_button_url" "text",
    "secondary_button_bg" "text",
    "secondary_button_text_color" "text",
    "secondary_button_hover" "text",
    "secondary_button_padding_x" "text",
    "secondary_button_padding_y" "text",
    "secondary_button_font" "text",
    "secondary_button_mobile_width" "text",
    "secondary_button_desktop_width" "text",
    "menu_button_text" "text",
    "menu_button_url" "text",
    "menu_button_bg" "text" DEFAULT 'bg-yellow-500'::"text",
    "menu_button_text_color" "text" DEFAULT 'text-black'::"text",
    "menu_button_hover" "text" DEFAULT 'hover:bg-yellow-400'::"text",
    "menu_button_padding_x" "text" DEFAULT 'px-6'::"text",
    "menu_button_padding_y" "text" DEFAULT 'py-2'::"text",
    "menu_button_font" "text" DEFAULT 'text-base'::"text",
    "menu_button_mobile_width" "text" DEFAULT 'w-full'::"text",
    "menu_button_desktop_width" "text" DEFAULT 'sm:w-auto'::"text",
    "content_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "image_id" "uuid",
    "width" "text" DEFAULT '200'::"text",
    "image_size" "text" DEFAULT 'medium'::"text",
    "image_hover_effect" "text" DEFAULT 'scale'::"text",
    "show_logo_text" boolean DEFAULT true,
    "logo_text_title" "text" DEFAULT 'Academy Logo'::"text",
    "logo_text_title_size" "text" DEFAULT 'text-2xl'::"text",
    "logo_text_title_weight" "text" DEFAULT 'font-bold'::"text",
    "logo_text_subtitle" "text" DEFAULT 'Martial Arts'::"text",
    "logo_text_subtitle_size" "text" DEFAULT 'text-sm'::"text",
    "logo_width" "text" DEFAULT '200'::"text",
    "footer_width" "text" DEFAULT '200'::"text",
    "logo_scroll_scale" "text" DEFAULT '75'::"text"
);


ALTER TABLE "public"."site_content" OWNER TO "postgres";


COMMENT ON TABLE "public"."site_content" IS 'Stores website content with RLS policies for public read and authenticated management';



COMMENT ON COLUMN "public"."site_content"."image_id" IS 'Reference to the image used for this content';



COMMENT ON COLUMN "public"."site_content"."width" IS 'Width in pixels for logos and other sized elements';



COMMENT ON COLUMN "public"."site_content"."image_size" IS 'Size preset for images (small, medium, large, xlarge)';



COMMENT ON COLUMN "public"."site_content"."image_hover_effect" IS 'Hover effect for images (scale, fade, slide, zoom, blur, none)';



COMMENT ON COLUMN "public"."site_content"."show_logo_text" IS 'Whether to show text when no logo is present';



COMMENT ON COLUMN "public"."site_content"."logo_text_title" IS 'Title text to show when no logo is present';



COMMENT ON COLUMN "public"."site_content"."logo_text_title_size" IS 'Font size for logo title text';



COMMENT ON COLUMN "public"."site_content"."logo_text_title_weight" IS 'Font weight for logo title text';



COMMENT ON COLUMN "public"."site_content"."logo_text_subtitle" IS 'Subtitle text to show when no logo is present';



COMMENT ON COLUMN "public"."site_content"."logo_text_subtitle_size" IS 'Font size for logo subtitle text';



COMMENT ON COLUMN "public"."site_content"."logo_width" IS 'Width of the logo in navigation';



COMMENT ON COLUMN "public"."site_content"."footer_width" IS 'Width of the logo in footer';



COMMENT ON COLUMN "public"."site_content"."logo_scroll_scale" IS 'Scale percentage for logo when scrolling';



CREATE TABLE IF NOT EXISTS "public"."site_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "key" "text" NOT NULL,
    "url" "text" NOT NULL,
    "alt_text" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "key" "text" NOT NULL,
    "value" "text",
    "site_name" "text",
    "site_description" "text",
    "contact_email" "text",
    "social_links_json" "jsonb" DEFAULT '{"twitter": "", "youtube": "", "facebook": "", "instagram": ""}'::"jsonb",
    "business_hours_json" "jsonb" DEFAULT '{"friday": {"open": "08:00", "close": "21:00", "closed": false}, "monday": {"open": "08:00", "close": "21:00", "closed": false}, "sunday": {"open": "09:00", "close": "17:00", "closed": true}, "tuesday": {"open": "08:00", "close": "21:00", "closed": false}, "saturday": {"open": "09:00", "close": "17:00", "closed": false}, "thursday": {"open": "08:00", "close": "21:00", "closed": false}, "wednesday": {"open": "08:00", "close": "21:00", "closed": false}}'::"jsonb",
    "color_palette_settings_json" "jsonb" DEFAULT '{"text": "#1a1a1a", "links": "#0070f3", "accent": "#0070f3", "buttons": "#0070f3", "primary": "#1a1a1a", "headings": "#1a1a1a", "secondary": "#ffffff", "background": "#ffffff", "buttonText": "#ffffff"}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."special_schedule_classes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "special_schedule_id" "uuid" NOT NULL,
    "start_time" "text" NOT NULL,
    "end_time" "text" NOT NULL,
    "title" "text" NOT NULL,
    "category_id" "uuid",
    "instructor" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."special_schedule_classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."special_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_closed" boolean DEFAULT false
);


ALTER TABLE "public"."special_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."why_choose_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon_name" "text",
    "image_url" "text",
    "image_id" "uuid",
    "button_text" "text",
    "button_url" "text",
    "button_bg" "text",
    "button_text_color" "text",
    "card_bg" "text",
    "card_text_color" "text",
    "use_icon" boolean DEFAULT true,
    "order" integer DEFAULT 0 NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."why_choose_cards" OWNER TO "postgres";


ALTER TABLE ONLY "public"."home_page_config" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."home_page_config_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."about_sections"
    ADD CONSTRAINT "about_sections_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."about_sections"
    ADD CONSTRAINT "about_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "class_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contact_settings"
    ADD CONSTRAINT "contact_settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."contact_settings"
    ADD CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cta_config"
    ADD CONSTRAINT "cta_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_products_config"
    ADD CONSTRAINT "featured_products_config_temp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_programs_config"
    ADD CONSTRAINT "featured_programs_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."features"
    ADD CONSTRAINT "features_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hero_config"
    ADD CONSTRAINT "hero_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hero_slides"
    ADD CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_components"
    ADD CONSTRAINT "home_components_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_page_components"
    ADD CONSTRAINT "home_page_components_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_page_config"
    ADD CONSTRAINT "home_page_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."home_sections"
    ADD CONSTRAINT "home_sections_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."home_sections"
    ADD CONSTRAINT "home_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."icons_reference"
    ADD CONSTRAINT "icons_reference_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."icons_reference"
    ADD CONSTRAINT "icons_reference_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."image_dimensions"
    ADD CONSTRAINT "image_dimensions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."image_dimensions"
    ADD CONSTRAINT "image_dimensions_section_key_key" UNIQUE ("section", "key");



ALTER TABLE ONLY "public"."image_sizes"
    ADD CONSTRAINT "image_sizes_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."image_sizes"
    ADD CONSTRAINT "image_sizes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insurance_providers"
    ADD CONSTRAINT "insurance_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_section"
    ADD CONSTRAINT "location_section_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."methodology"
    ADD CONSTRAINT "methodology_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_stats"
    ADD CONSTRAINT "page_stats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_classes"
    ADD CONSTRAINT "schedule_classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");



ALTER TABLE ONLY "public"."section_image_sizes"
    ADD CONSTRAINT "section_image_sizes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."section_image_sizes"
    ADD CONSTRAINT "section_image_sizes_section_key_key" UNIQUE ("section", "key");



ALTER TABLE ONLY "public"."settings_categories"
    ADD CONSTRAINT "settings_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings_sections"
    ADD CONSTRAINT "settings_sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_config"
    ADD CONSTRAINT "site_config_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."site_config"
    ADD CONSTRAINT "site_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_content"
    ADD CONSTRAINT "site_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_content"
    ADD CONSTRAINT "site_content_section_key_key" UNIQUE ("section", "key");



ALTER TABLE ONLY "public"."site_images"
    ADD CONSTRAINT "site_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_images"
    ADD CONSTRAINT "site_images_section_key_key" UNIQUE ("section", "key");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."special_schedule_classes"
    ADD CONSTRAINT "special_schedule_classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."special_schedules"
    ADD CONSTRAINT "special_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "treatments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "treatments_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."why_choose_cards"
    ADD CONSTRAINT "why_choose_cards_pkey" PRIMARY KEY ("id");



CREATE INDEX "about_sections_image_id_idx" ON "public"."about_sections" USING "btree" ("image_id");



CREATE INDEX "about_sections_order_idx" ON "public"."about_sections" USING "btree" ("order");



CREATE INDEX "blog_posts_image_id_idx" ON "public"."blog_posts" USING "btree" ("image_id");



CREATE INDEX "blog_posts_published_at_idx" ON "public"."blog_posts" USING "btree" ("published_at" DESC NULLS LAST);



CREATE INDEX "home_sections_image_id_idx" ON "public"."home_sections" USING "btree" ("image_id");



CREATE INDEX "home_sections_order_idx" ON "public"."home_sections" USING "btree" ("order");



CREATE INDEX "image_dimensions_section_key_idx" ON "public"."image_dimensions" USING "btree" ("section", "key");



CREATE INDEX "instructors_image_id_idx" ON "public"."instructors" USING "btree" ("image_id");



CREATE INDEX "instructors_order_idx" ON "public"."instructors" USING "btree" ("order");



CREATE INDEX "insurance_providers_order_idx" ON "public"."insurance_providers" USING "btree" ("order");



CREATE INDEX "menu_items_order_idx" ON "public"."menu_items" USING "btree" ("order");



CREATE INDEX "page_stats_order_idx" ON "public"."page_stats" USING "btree" ("order");



CREATE INDEX "page_stats_page_idx" ON "public"."page_stats" USING "btree" ("page");



CREATE INDEX "programs_category_id_idx" ON "public"."programs" USING "btree" ("category_id");



CREATE INDEX "site_content_image_id_idx" ON "public"."site_content" USING "btree" ("image_id");



CREATE INDEX "site_content_section_key_idx" ON "public"."site_content" USING "btree" ("section", "key");



CREATE INDEX "site_content_section_order_idx" ON "public"."site_content" USING "btree" ("section", "content_order");



CREATE INDEX "site_images_section_key_idx" ON "public"."site_images" USING "btree" ("section", "key");



CREATE INDEX "special_schedules_date_idx" ON "public"."special_schedules" USING "btree" ("date");



CREATE INDEX "treatments_order_idx" ON "public"."programs" USING "btree" ("order");



CREATE INDEX "treatments_slug_idx" ON "public"."programs" USING "btree" ("slug");



CREATE INDEX "treatments_status_idx" ON "public"."programs" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "cleanup_about_sections_images" BEFORE UPDATE ON "public"."about_sections" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "cleanup_blog_posts_images" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "cleanup_home_sections_images" BEFORE UPDATE ON "public"."home_sections" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "cleanup_image_dimensions_old" BEFORE INSERT OR UPDATE ON "public"."image_dimensions" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_image_dimensions"();



CREATE OR REPLACE TRIGGER "cleanup_instructors_images" BEFORE UPDATE ON "public"."instructors" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "cleanup_insurance_providers_images" BEFORE UPDATE ON "public"."insurance_providers" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "cleanup_site_images" BEFORE DELETE OR UPDATE ON "public"."site_images" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_old_site_images"();



CREATE OR REPLACE TRIGGER "cleanup_site_images_old" BEFORE INSERT OR UPDATE ON "public"."site_images" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_site_images"();



CREATE OR REPLACE TRIGGER "cleanup_treatments_images" BEFORE UPDATE ON "public"."programs" FOR EACH ROW EXECUTE FUNCTION "public"."cleanup_unused_images"();



CREATE OR REPLACE TRIGGER "set_cta_config_updated_at" BEFORE UPDATE ON "public"."cta_config" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_methodology_updated_at" BEFORE UPDATE ON "public"."methodology" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."location_section" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_about_sections_updated_at" BEFORE UPDATE ON "public"."about_sections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_featured_products_config_updated_at" BEFORE UPDATE ON "public"."featured_products_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_featured_programs_config_updated_at" BEFORE UPDATE ON "public"."featured_programs_config" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "update_features_updated_at" BEFORE UPDATE ON "public"."features" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_hero_config_updated_at" BEFORE UPDATE ON "public"."hero_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_hero_slides_updated_at" BEFORE UPDATE ON "public"."hero_slides" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_home_components_updated_at" BEFORE UPDATE ON "public"."home_components" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_home_page_components_updated_at" BEFORE UPDATE ON "public"."home_page_components" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_home_sections_updated_at" BEFORE UPDATE ON "public"."home_sections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_icons_reference_updated_at" BEFORE UPDATE ON "public"."icons_reference" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_image_dimensions_updated_at" BEFORE UPDATE ON "public"."image_dimensions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_images_updated_at" BEFORE UPDATE ON "public"."images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_insurance_providers_updated_at" BEFORE UPDATE ON "public"."insurance_providers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_menu_items_updated_at" BEFORE UPDATE ON "public"."menu_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_page_stats_updated_at" BEFORE UPDATE ON "public"."page_stats" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_settings_categories_updated_at" BEFORE UPDATE ON "public"."settings_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_settings_sections_updated_at" BEFORE UPDATE ON "public"."settings_sections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_settings_updated_at" BEFORE UPDATE ON "public"."settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_config_updated_at" BEFORE UPDATE ON "public"."site_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_content_updated_at" BEFORE UPDATE ON "public"."site_content" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_images_updated_at" BEFORE UPDATE ON "public"."site_images" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_site_settings_updated_at" BEFORE UPDATE ON "public"."site_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_treatments_updated_at" BEFORE UPDATE ON "public"."programs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_why_choose_cards_updated_at" BEFORE UPDATE ON "public"."why_choose_cards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."about_sections"
    ADD CONSTRAINT "about_sections_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



COMMENT ON CONSTRAINT "about_sections_image_id_fkey" ON "public"."about_sections" IS 'Foreign key relationship between about sections and their images';



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



COMMENT ON CONSTRAINT "blog_posts_image_id_fkey" ON "public"."blog_posts" IS 'Foreign key relationship between blog posts and their images';



ALTER TABLE ONLY "public"."home_sections"
    ADD CONSTRAINT "home_sections_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



COMMENT ON CONSTRAINT "home_sections_image_id_fkey" ON "public"."home_sections" IS 'Foreign key relationship between home sections and their images';



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



COMMENT ON CONSTRAINT "instructors_image_id_fkey" ON "public"."instructors" IS 'Foreign key relationship between instructors and their images';



ALTER TABLE ONLY "public"."insurance_providers"
    ADD CONSTRAINT "insurance_providers_logo_id_fkey" FOREIGN KEY ("logo_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "programs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."schedule_classes"
    ADD CONSTRAINT "schedule_classes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."section_image_sizes"
    ADD CONSTRAINT "section_image_sizes_size_name_fkey" FOREIGN KEY ("size_name") REFERENCES "public"."image_sizes"("name") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."settings_sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settings_sections"
    ADD CONSTRAINT "settings_sections_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."settings_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."site_content"
    ADD CONSTRAINT "site_content_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."special_schedule_classes"
    ADD CONSTRAINT "special_schedule_classes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."special_schedule_classes"
    ADD CONSTRAINT "special_schedule_classes_special_schedule_id_fkey" FOREIGN KEY ("special_schedule_id") REFERENCES "public"."special_schedules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."programs"
    ADD CONSTRAINT "treatments_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE SET NULL;



CREATE POLICY "Allow authenticated users to delete cta_config" ON "public"."cta_config" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to delete methodology" ON "public"."methodology" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to insert cta_config" ON "public"."cta_config" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to insert methodology" ON "public"."methodology" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to manage about sections" ON "public"."about_sections" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage blog posts" ON "public"."blog_posts" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage blog_posts" ON "public"."blog_posts" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage class categories" ON "public"."categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage contact settings" ON "public"."contact_settings" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage home sections" ON "public"."home_sections" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage image dimensions" ON "public"."image_dimensions" TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to manage images" ON "public"."images" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage instructors" ON "public"."instructors" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage insurance providers" ON "public"."insurance_providers" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage menu items" ON "public"."menu_items" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage page stats" ON "public"."page_stats" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage programs" ON "public"."programs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage schedule classes" ON "public"."schedule_classes" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage settings" ON "public"."settings" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage settings categories" ON "public"."settings_categories" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage settings sections" ON "public"."settings_sections" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage site content" ON "public"."site_content" TO "authenticated" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow authenticated users to manage site images" ON "public"."site_images" TO "authenticated" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to manage special schedule classes" ON "public"."special_schedule_classes" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage special schedules" ON "public"."special_schedules" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to manage treatments" ON "public"."programs" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users to update cta_config" ON "public"."cta_config" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to update methodology" ON "public"."methodology" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow delete for authenticated users" ON "public"."location_section" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated users" ON "public"."location_section" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert/update for authenticated users" ON "public"."location_section" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow public read access for cta_config" ON "public"."cta_config" FOR SELECT USING (true);



CREATE POLICY "Allow public read access for methodology" ON "public"."methodology" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to about sections" ON "public"."about_sections" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to blog posts" ON "public"."blog_posts" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to blog_posts" ON "public"."blog_posts" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to class categories" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to contact settings" ON "public"."contact_settings" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to home sections" ON "public"."home_sections" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to image dimensions" ON "public"."image_dimensions" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to images" ON "public"."images" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to instructors" ON "public"."instructors" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to insurance providers" ON "public"."insurance_providers" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to menu items" ON "public"."menu_items" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to page stats" ON "public"."page_stats" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to programs" ON "public"."programs" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to published treatments" ON "public"."programs" FOR SELECT USING (("status" = 'published'::"text"));



CREATE POLICY "Allow public read access to schedule classes" ON "public"."schedule_classes" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to settings" ON "public"."settings" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to settings categories" ON "public"."settings_categories" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to settings sections" ON "public"."settings_sections" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to site content" ON "public"."site_content" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to site images" ON "public"."site_images" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to special schedule classes" ON "public"."special_schedule_classes" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to special schedules" ON "public"."special_schedules" FOR SELECT USING (true);



CREATE POLICY "Allow select for all users" ON "public"."location_section" FOR SELECT USING (true);



CREATE POLICY "Allow update for authenticated users" ON "public"."location_section" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



ALTER TABLE "public"."about_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cta_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."featured_programs_config" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "featured_programs_config_delete_policy" ON "public"."featured_programs_config" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "featured_programs_config_insert_policy" ON "public"."featured_programs_config" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "featured_programs_config_select_policy" ON "public"."featured_programs_config" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "featured_programs_config_update_policy" ON "public"."featured_programs_config" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



ALTER TABLE "public"."home_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."image_dimensions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."image_sizes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."instructors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."insurance_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."location_section" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."menu_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."methodology" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedule_classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."section_image_sizes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings_sections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."special_schedule_classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."special_schedules" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."check_table_exists"("table_name_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_table_exists"("table_name_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_table_exists"("table_name_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_image_dimensions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_image_dimensions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_image_dimensions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_site_images"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_site_images"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_site_images"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_site_images"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_site_images"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_site_images"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_unused_images"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_unused_images"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_unused_images"() TO "service_role";



GRANT ALL ON FUNCTION "public"."exec_sql"("sql" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."exec_sql"("sql" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."exec_sql"("sql" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_image_referenced"("image_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_image_referenced"("image_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_image_referenced"("image_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



























GRANT ALL ON TABLE "public"."about_sections" TO "anon";
GRANT ALL ON TABLE "public"."about_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."about_sections" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."programs" TO "anon";
GRANT ALL ON TABLE "public"."programs" TO "authenticated";
GRANT ALL ON TABLE "public"."programs" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON TABLE "public"."contact_settings" TO "anon";
GRANT ALL ON TABLE "public"."contact_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_settings" TO "service_role";



GRANT ALL ON TABLE "public"."cta_config" TO "anon";
GRANT ALL ON TABLE "public"."cta_config" TO "authenticated";
GRANT ALL ON TABLE "public"."cta_config" TO "service_role";



GRANT ALL ON TABLE "public"."featured_products_config" TO "anon";
GRANT ALL ON TABLE "public"."featured_products_config" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_products_config" TO "service_role";



GRANT ALL ON TABLE "public"."featured_programs_config" TO "anon";
GRANT ALL ON TABLE "public"."featured_programs_config" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_programs_config" TO "service_role";



GRANT ALL ON TABLE "public"."features" TO "anon";
GRANT ALL ON TABLE "public"."features" TO "authenticated";
GRANT ALL ON TABLE "public"."features" TO "service_role";



GRANT ALL ON TABLE "public"."hero_config" TO "anon";
GRANT ALL ON TABLE "public"."hero_config" TO "authenticated";
GRANT ALL ON TABLE "public"."hero_config" TO "service_role";



GRANT ALL ON TABLE "public"."hero_slides" TO "anon";
GRANT ALL ON TABLE "public"."hero_slides" TO "authenticated";
GRANT ALL ON TABLE "public"."hero_slides" TO "service_role";



GRANT ALL ON TABLE "public"."home_components" TO "anon";
GRANT ALL ON TABLE "public"."home_components" TO "authenticated";
GRANT ALL ON TABLE "public"."home_components" TO "service_role";



GRANT ALL ON TABLE "public"."home_page_components" TO "anon";
GRANT ALL ON TABLE "public"."home_page_components" TO "authenticated";
GRANT ALL ON TABLE "public"."home_page_components" TO "service_role";



GRANT ALL ON TABLE "public"."home_page_config" TO "anon";
GRANT ALL ON TABLE "public"."home_page_config" TO "authenticated";
GRANT ALL ON TABLE "public"."home_page_config" TO "service_role";



GRANT ALL ON SEQUENCE "public"."home_page_config_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."home_page_config_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."home_page_config_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."home_sections" TO "anon";
GRANT ALL ON TABLE "public"."home_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."home_sections" TO "service_role";



GRANT ALL ON TABLE "public"."icons_reference" TO "anon";
GRANT ALL ON TABLE "public"."icons_reference" TO "authenticated";
GRANT ALL ON TABLE "public"."icons_reference" TO "service_role";



GRANT ALL ON TABLE "public"."image_dimensions" TO "anon";
GRANT ALL ON TABLE "public"."image_dimensions" TO "authenticated";
GRANT ALL ON TABLE "public"."image_dimensions" TO "service_role";



GRANT ALL ON TABLE "public"."image_sizes" TO "anon";
GRANT ALL ON TABLE "public"."image_sizes" TO "authenticated";
GRANT ALL ON TABLE "public"."image_sizes" TO "service_role";



GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";



GRANT ALL ON TABLE "public"."instructors" TO "anon";
GRANT ALL ON TABLE "public"."instructors" TO "authenticated";
GRANT ALL ON TABLE "public"."instructors" TO "service_role";



GRANT ALL ON TABLE "public"."insurance_providers" TO "anon";
GRANT ALL ON TABLE "public"."insurance_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."insurance_providers" TO "service_role";



GRANT ALL ON TABLE "public"."location_section" TO "anon";
GRANT ALL ON TABLE "public"."location_section" TO "authenticated";
GRANT ALL ON TABLE "public"."location_section" TO "service_role";



GRANT ALL ON TABLE "public"."menu_items" TO "anon";
GRANT ALL ON TABLE "public"."menu_items" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_items" TO "service_role";



GRANT ALL ON TABLE "public"."methodology" TO "anon";
GRANT ALL ON TABLE "public"."methodology" TO "authenticated";
GRANT ALL ON TABLE "public"."methodology" TO "service_role";



GRANT ALL ON TABLE "public"."page_stats" TO "anon";
GRANT ALL ON TABLE "public"."page_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."page_stats" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."schedule_classes" TO "anon";
GRANT ALL ON TABLE "public"."schedule_classes" TO "authenticated";
GRANT ALL ON TABLE "public"."schedule_classes" TO "service_role";



GRANT ALL ON TABLE "public"."schema_migrations" TO "anon";
GRANT ALL ON TABLE "public"."schema_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."schema_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."section_image_sizes" TO "anon";
GRANT ALL ON TABLE "public"."section_image_sizes" TO "authenticated";
GRANT ALL ON TABLE "public"."section_image_sizes" TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON TABLE "public"."settings_categories" TO "anon";
GRANT ALL ON TABLE "public"."settings_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."settings_categories" TO "service_role";



GRANT ALL ON TABLE "public"."settings_sections" TO "anon";
GRANT ALL ON TABLE "public"."settings_sections" TO "authenticated";
GRANT ALL ON TABLE "public"."settings_sections" TO "service_role";



GRANT ALL ON TABLE "public"."site_config" TO "anon";
GRANT ALL ON TABLE "public"."site_config" TO "authenticated";
GRANT ALL ON TABLE "public"."site_config" TO "service_role";



GRANT ALL ON TABLE "public"."site_content" TO "anon";
GRANT ALL ON TABLE "public"."site_content" TO "authenticated";
GRANT ALL ON TABLE "public"."site_content" TO "service_role";



GRANT ALL ON TABLE "public"."site_images" TO "anon";
GRANT ALL ON TABLE "public"."site_images" TO "authenticated";
GRANT ALL ON TABLE "public"."site_images" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."special_schedule_classes" TO "anon";
GRANT ALL ON TABLE "public"."special_schedule_classes" TO "authenticated";
GRANT ALL ON TABLE "public"."special_schedule_classes" TO "service_role";



GRANT ALL ON TABLE "public"."special_schedules" TO "anon";
GRANT ALL ON TABLE "public"."special_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."special_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."why_choose_cards" TO "anon";
GRANT ALL ON TABLE "public"."why_choose_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."why_choose_cards" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
