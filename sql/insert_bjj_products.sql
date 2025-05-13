-- Insert BJJ Products Script for House of Grappling
-- This script adds a variety of Brazilian Jiu-Jitsu products to the products table

-- GIs (Traditional Kimonos)
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Elite Gi - White A0', 'Premium competition gi with reinforced stitching and embroidered logos. Size A0 for smaller practitioners.', 159.99, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2942&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - White A1', 'Premium competition gi with reinforced stitching and embroidered logos. Size A1.', 159.99, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2942&auto=format&fit=crop', true, 'gi'),
('HOG Elite Gi - White A2', 'Premium competition gi with reinforced stitching and embroidered logos. Size A2.', 159.99, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2942&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - White A3', 'Premium competition gi with reinforced stitching and embroidered logos. Size A3 for taller practitioners.', 159.99, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2942&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - White A4', 'Premium competition gi with reinforced stitching and embroidered logos. Size A4 for larger practitioners.', 169.99, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2942&auto=format&fit=crop', false, 'gi'),

('HOG Elite Gi - Blue A1', 'Premium competition gi in royal blue with reinforced stitching and embroidered logos. Size A1.', 159.99, 'https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?q=80&w=2940&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - Blue A2', 'Premium competition gi in royal blue with reinforced stitching and embroidered logos. Size A2.', 159.99, 'https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?q=80&w=2940&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - Blue A3', 'Premium competition gi in royal blue with reinforced stitching and embroidered logos. Size A3.', 159.99, 'https://images.unsplash.com/photo-1593810450967-f9c42742e3b5?q=80&w=2940&auto=format&fit=crop', false, 'gi'),

('HOG Elite Gi - Black A1', 'Premium competition gi in sleek black with reinforced stitching and embroidered logos. Size A1.', 169.99, 'https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop', true, 'gi'),
('HOG Elite Gi - Black A2', 'Premium competition gi in sleek black with reinforced stitching and embroidered logos. Size A2.', 169.99, 'https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop', false, 'gi'),
('HOG Elite Gi - Black A3', 'Premium competition gi in sleek black with reinforced stitching and embroidered logos. Size A3.', 169.99, 'https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop', false, 'gi');

-- Belts
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG White Belt', 'Premium cotton BJJ belt. White belt for beginners with embroidered HOG logo.', 24.99, 'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop', false, 'belts'),
('HOG Blue Belt', 'Premium cotton BJJ belt. Blue belt for dedicated practitioners with embroidered HOG logo.', 29.99, 'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop', false, 'belts'),
('HOG Purple Belt', 'Premium cotton BJJ belt. Purple belt for advanced practitioners with embroidered HOG logo.', 34.99, 'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop', false, 'belts'),
('HOG Brown Belt', 'Premium cotton BJJ belt. Brown belt for expert practitioners with embroidered HOG logo.', 39.99, 'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop', false, 'belts'),
('HOG Black Belt', 'Premium cotton BJJ belt. Black belt for masters with embroidered HOG logo and red bar customization.', 59.99, 'https://images.unsplash.com/photo-1617050318658-a9a22c962fc4?q=80&w=2600&auto=format&fit=crop', false, 'belts');

-- Rashguards (No-Gi)
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Performance Rashguard - Black/Red S', 'Competition-grade rashguard with 4-way stretch fabric and flatlock seams. Size S.', 49.99, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop', false, 'rashguards'),
('HOG Performance Rashguard - Black/Red M', 'Competition-grade rashguard with 4-way stretch fabric and flatlock seams. Size M.', 49.99, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop', true, 'rashguards'),
('HOG Performance Rashguard - Black/Red L', 'Competition-grade rashguard with 4-way stretch fabric and flatlock seams. Size L.', 49.99, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop', false, 'rashguards'),
('HOG Performance Rashguard - Black/Red XL', 'Competition-grade rashguard with 4-way stretch fabric and flatlock seams. Size XL.', 54.99, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop', false, 'rashguards'),

('HOG Competition Rashguard - Blue S', 'Competition-grade rashguard designed for tournaments. Featuring HOG logo and competition cut. Size S.', 59.99, 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=2748&auto=format&fit=crop', false, 'rashguards'),
('HOG Competition Rashguard - Blue M', 'Competition-grade rashguard designed for tournaments. Featuring HOG logo and competition cut. Size M.', 59.99, 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=2748&auto=format&fit=crop', false, 'rashguards'),
('HOG Competition Rashguard - Blue L', 'Competition-grade rashguard designed for tournaments. Featuring HOG logo and competition cut. Size L.', 59.99, 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=2748&auto=format&fit=crop', false, 'rashguards'),
('HOG Competition Rashguard - Blue XL', 'Competition-grade rashguard designed for tournaments. Featuring HOG logo and competition cut. Size XL.', 64.99, 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=2748&auto=format&fit=crop', false, 'rashguards');

-- Shorts (No-Gi)
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Fight Shorts - Black S', 'Lightweight nylon competition shorts with side slits for maximum mobility. Size S.', 39.99, 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop', false, 'shorts'),
('HOG Fight Shorts - Black M', 'Lightweight nylon competition shorts with side slits for maximum mobility. Size M.', 39.99, 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop', true, 'shorts'),
('HOG Fight Shorts - Black L', 'Lightweight nylon competition shorts with side slits for maximum mobility. Size L.', 39.99, 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop', false, 'shorts'),
('HOG Fight Shorts - Black XL', 'Lightweight nylon competition shorts with side slits for maximum mobility. Size XL.', 44.99, 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop', false, 'shorts'),

('HOG Academy Shorts - Blue S', 'Durable training shorts with reinforced stitching and drawstring waist. Size S.', 34.99, 'https://images.unsplash.com/photo-1565579756435-92da5f5983d3?q=80&w=3087&auto=format&fit=crop', false, 'shorts'),
('HOG Academy Shorts - Blue M', 'Durable training shorts with reinforced stitching and drawstring waist. Size M.', 34.99, 'https://images.unsplash.com/photo-1565579756435-92da5f5983d3?q=80&w=3087&auto=format&fit=crop', false, 'shorts'),
('HOG Academy Shorts - Blue L', 'Durable training shorts with reinforced stitching and drawstring waist. Size L.', 34.99, 'https://images.unsplash.com/photo-1565579756435-92da5f5983d3?q=80&w=3087&auto=format&fit=crop', false, 'shorts'),
('HOG Academy Shorts - Blue XL', 'Durable training shorts with reinforced stitching and drawstring waist. Size XL.', 39.99, 'https://images.unsplash.com/photo-1565579756435-92da5f5983d3?q=80&w=3087&auto=format&fit=crop', false, 'shorts');

-- Spats (No-Gi)
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Compression Spats - Black S', 'Full-length compression spats with antimicrobial fabric. Perfect for no-gi training. Size S.', 44.99, 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2940&auto=format&fit=crop', false, 'spats'),
('HOG Compression Spats - Black M', 'Full-length compression spats with antimicrobial fabric. Perfect for no-gi training. Size M.', 44.99, 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2940&auto=format&fit=crop', false, 'spats'),
('HOG Compression Spats - Black L', 'Full-length compression spats with antimicrobial fabric. Perfect for no-gi training. Size L.', 44.99, 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2940&auto=format&fit=crop', false, 'spats'),
('HOG Compression Spats - Black XL', 'Full-length compression spats with antimicrobial fabric. Perfect for no-gi training. Size XL.', 49.99, 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=2940&auto=format&fit=crop', false, 'spats');

-- T-Shirts
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Logo T-Shirt - Gray S', 'Soft cotton T-shirt with House of Grappling logo. Perfect for casual wear. Size S.', 24.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),
('HOG Logo T-Shirt - Gray M', 'Soft cotton T-shirt with House of Grappling logo. Perfect for casual wear. Size M.', 24.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),
('HOG Logo T-Shirt - Gray L', 'Soft cotton T-shirt with House of Grappling logo. Perfect for casual wear. Size L.', 24.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),
('HOG Logo T-Shirt - Gray XL', 'Soft cotton T-shirt with House of Grappling logo. Perfect for casual wear. Size XL.', 27.99, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),

('HOG Competition Team T-Shirt - Black S', 'Premium T-shirt for HOG competition team members. Moisture-wicking fabric. Size S.', 29.99, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),
('HOG Competition Team T-Shirt - Black M', 'Premium T-shirt for HOG competition team members. Moisture-wicking fabric. Size M.', 29.99, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=3087&auto=format&fit=crop', true, 't-shirts'),
('HOG Competition Team T-Shirt - Black L', 'Premium T-shirt for HOG competition team members. Moisture-wicking fabric. Size L.', 29.99, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=3087&auto=format&fit=crop', false, 't-shirts'),
('HOG Competition Team T-Shirt - Black XL', 'Premium T-shirt for HOG competition team members. Moisture-wicking fabric. Size XL.', 32.99, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=3087&auto=format&fit=crop', false, 't-shirts');

-- Hoodies
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Premium Hoodie - Black S', 'Heavyweight cotton-blend hoodie with front pocket and embroidered HOG logo. Size S.', 54.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=3087&auto=format&fit=crop', false, 'hoodies'),
('HOG Premium Hoodie - Black M', 'Heavyweight cotton-blend hoodie with front pocket and embroidered HOG logo. Size M.', 54.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=3087&auto=format&fit=crop', false, 'hoodies'),
('HOG Premium Hoodie - Black L', 'Heavyweight cotton-blend hoodie with front pocket and embroidered HOG logo. Size L.', 54.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=3087&auto=format&fit=crop', false, 'hoodies'),
('HOG Premium Hoodie - Black XL', 'Heavyweight cotton-blend hoodie with front pocket and embroidered HOG logo. Size XL.', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=3087&auto=format&fit=crop', false, 'hoodies'),

('HOG Zip-Up Hoodie - Gray S', 'Lightweight full-zip hoodie perfect for before and after training. Size S.', 64.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3072&auto=format&fit=crop', false, 'hoodies'),
('HOG Zip-Up Hoodie - Gray M', 'Lightweight full-zip hoodie perfect for before and after training. Size M.', 64.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3072&auto=format&fit=crop', false, 'hoodies'),
('HOG Zip-Up Hoodie - Gray L', 'Lightweight full-zip hoodie perfect for before and after training. Size L.', 64.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3072&auto=format&fit=crop', true, 'hoodies'),
('HOG Zip-Up Hoodie - Gray XL', 'Lightweight full-zip hoodie perfect for before and after training. Size XL.', 69.99, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=3072&auto=format&fit=crop', false, 'hoodies');

-- Accessories
INSERT INTO products (name, description, price, image_url, is_featured, category) VALUES
('HOG Gym Bag', 'Spacious gym bag with dedicated compartments for gi, no-gi gear, and accessories. Water-resistant.', 79.99, 'https://images.unsplash.com/photo-1588099768531-a72d4a198538?q=80&w=3087&auto=format&fit=crop', false, 'accessories'),
('HOG Mouthguard', 'Competition-grade mouthguard with carrying case. Essential protection for rolling.', 19.99, 'https://images.unsplash.com/photo-1589189951169-b8318e1d7cc1?q=80&w=3000&auto=format&fit=crop', false, 'accessories'),
('HOG Knee Pads (Pair)', 'Compression knee sleeves that provide support without restricting movement.', 29.99, 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?q=80&w=3087&auto=format&fit=crop', false, 'accessories'),
('HOG Ear Guards', 'Lightweight ear guards that protect against cauliflower ear without disrupting your training.', 34.99, 'https://images.unsplash.com/photo-1551845254-0e0c3eedac32?q=80&w=3024&auto=format&fit=crop', false, 'accessories'),
('HOG Tape (5-Pack)', 'Athletic tape for finger and joint protection. Pack of 5 rolls.', 24.99, 'https://images.unsplash.com/photo-1584797319587-9de3a6cd6578?q=80&w=3087&auto=format&fit=crop', false, 'accessories'); 