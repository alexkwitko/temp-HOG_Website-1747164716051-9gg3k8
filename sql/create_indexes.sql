-- Performance Indexes for E-Commerce Database
-- These indexes improve query performance for common operations

-- Product related indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);

-- Collection related indexes
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(published);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection_id ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product_id ON collection_products(product_id);

-- Inventory related indexes
CREATE INDEX IF NOT EXISTS idx_inventory_levels_variant_id ON inventory_levels(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_levels_location_id ON inventory_levels(location_id);

-- Customer related indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default_shipping ON customer_addresses(is_default_shipping);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default_billing ON customer_addresses(is_default_billing);

-- Order related indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_line_items_product_id ON order_line_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_line_items_variant_id ON order_line_items(variant_id);

-- Transaction related indexes
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refund_line_items_refund_id ON refund_line_items(refund_id);

-- Fulfillment related indexes
CREATE INDEX IF NOT EXISTS idx_fulfillments_order_id ON fulfillments(order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON fulfillments(status);
CREATE INDEX IF NOT EXISTS idx_fulfillment_line_items_fulfillment_id ON fulfillment_line_items(fulfillment_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_line_items_order_line_item_id ON fulfillment_line_items(order_line_item_id);

-- Marketing related indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_customer_id ON discount_codes(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_events_campaign_id ON marketing_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_marketing_events_customer_id ON marketing_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_events_order_id ON marketing_events(order_id);

-- Subscription related indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscription_items_subscription_id ON subscription_items(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_items_product_id ON subscription_items(product_id);
CREATE INDEX IF NOT EXISTS idx_subscription_items_variant_id ON subscription_items(variant_id);
CREATE INDEX IF NOT EXISTS idx_billing_attempts_subscription_id ON billing_attempts(subscription_id); 