CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS "entities" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image_url" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "menu_items" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "posts" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featured_image" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published_at" TIMESTAMP,
  "comment_count" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "quote" TEXT NOT NULL,
  "author_name" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "services_page" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "url" TEXT,
  "order_index" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pages" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "contact_email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "hours_lunch" TEXT,
  "hours_dinner" TEXT,
  "lunch_start" TEXT,
  "lunch_end" TEXT,
  "dinner_mon_thu_start" TEXT,
  "dinner_mon_thu_end" TEXT,
  "dinner_fri_sat_start" TEXT,
  "dinner_fri_sat_end" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reservations" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "party_size" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "time" TEXT NOT NULL,
  "requests" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "menu_categories" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TRIGGER trg_menu_categories_updated_at BEFORE UPDATE ON "menu_categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "restaurant_tables" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "table_number" INTEGER NOT NULL,
  "capacity" INTEGER NOT NULL,
  "location" TEXT NOT NULL DEFAULT 'indoor',
  "status" TEXT NOT NULL DEFAULT 'available'
);

CREATE TRIGGER trg_restaurant_tables_updated_at BEFORE UPDATE ON "restaurant_tables" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "comments" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "post_id" UUID NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "author_name" TEXT NOT NULL,
  "author_email" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON "comments" ("post_id");

CREATE TABLE IF NOT EXISTS "orders" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "table_id" UUID NOT NULL REFERENCES "restaurant_tables"("id") ON DELETE CASCADE,
  "reservation_id" UUID REFERENCES "reservations"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'open',
  "total_amount" NUMERIC NOT NULL DEFAULT 0,
  "notes" TEXT,
  "ordered_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_table_id ON "orders" ("table_id");

CREATE INDEX idx_orders_reservation_id ON "orders" ("reservation_id");

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "menu_item_id" UUID NOT NULL REFERENCES "menu_items"("id") ON DELETE CASCADE,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unit_price" NUMERIC NOT NULL,
  "special_instructions" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_order_items_order_id ON "order_items" ("order_id");

CREATE INDEX idx_order_items_menu_item_id ON "order_items" ("menu_item_id");

CREATE TRIGGER trg_order_items_updated_at BEFORE UPDATE ON "order_items" FOR EACH ROW EXECUTE FUNCTION update_updated_at();



-- Stats function for menu_items

CREATE OR REPLACE FUNCTION get_menu_items_stats()
RETURNS TABLE(total_count bigint, avg_price numeric, sum_price numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    count(*)::bigint,
    avg(price)::numeric,
    sum(price)::numeric
  FROM public.menu_items;
$$;



-- Stats function for posts

CREATE OR REPLACE FUNCTION get_posts_stats()
RETURNS TABLE(total_count bigint, avg_comment_count numeric, sum_comment_count numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    count(*)::bigint,
    avg(comment_count)::numeric,
    sum(comment_count)::numeric
  FROM public.posts;
$$;



-- Stats function for orders

CREATE OR REPLACE FUNCTION get_orders_stats()
RETURNS TABLE(total_count bigint, avg_total_amount numeric, sum_total_amount numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    count(*)::bigint,
    avg(total_amount)::numeric,
    sum(total_amount)::numeric
  FROM public.orders;
$$;



-- Stats function for order_items

CREATE OR REPLACE FUNCTION get_order_items_stats()
RETURNS TABLE(total_count bigint, avg_quantity numeric, sum_quantity numeric, avg_unit_price numeric, sum_unit_price numeric)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    count(*)::bigint,
    avg(quantity)::numeric,
    sum(quantity)::numeric,
    avg(unit_price)::numeric,
    sum(unit_price)::numeric
  FROM public.order_items;
$$;