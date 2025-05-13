-- SQL Script for products
-- Generated on 2025-05-09T02:55:06.694Z

-- Clear existing data
DELETE FROM products;

-- Insert data
INSERT INTO products (id, name, description, price, image_url, image_id, is_active, created_at, updated_at) VALUES ('e256ee69-9c32-49d5-b891-08daa5fabd03', 'Monthly Membership', 'Unlimited access to all classes. No contract.', 149.99, NULL, NULL, TRUE, '2025-05-06T23:44:17.141745+00:00', '2025-05-06T23:44:17.141745+00:00');
INSERT INTO products (id, name, description, price, image_url, image_id, is_active, created_at, updated_at) VALUES ('8461b9ba-5b31-4b0c-9b75-c5676c79948b', 'Annual Membership', 'Unlimited access to all classes. Save 15% with annual payment.', 1529.99, NULL, NULL, TRUE, '2025-05-06T23:44:17.141745+00:00', '2025-05-06T23:44:17.141745+00:00');
INSERT INTO products (id, name, description, price, image_url, image_id, is_active, created_at, updated_at) VALUES ('1719989b-451a-4c77-a072-696f36b71125', 'Private Lesson (1 hour)', 'One-on-one instruction customized to your needs.', 120, NULL, NULL, TRUE, '2025-05-06T23:44:17.141745+00:00', '2025-05-06T23:44:17.141745+00:00');
