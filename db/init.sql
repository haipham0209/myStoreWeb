-- Xóa bảng theo thứ tự tránh lỗi khóa ngoại
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS discounts;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS daily_revenue;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;

-- Bảng người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    status ENUM('PENDING', 'ACTIVE', 'DELETED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Token xác thực
CREATE TABLE refresh_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    revoked TINYINT(1) NOT NULL DEFAULT 0,
    expiry_date DATETIME(6) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Danh mục sản phẩm
CREATE TABLE category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    category_image VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
	
	-- Sản phẩm
	CREATE TABLE product (
	    product_id INT AUTO_INCREMENT PRIMARY KEY,
	    category_id INT NOT NULL,
	    product_name VARCHAR(255) NOT NULL,
	    price DECIMAL(10,2) NOT NULL,
	    cost_price DECIMAL(10,2) NOT NULL,
	    discounted_price DECIMAL(10,2),
	    description TEXT,
	    stock_quantity INT DEFAULT 0,
	    barcode VARCHAR(13) NOT NULL UNIQUE,
	    product_image VARCHAR(255) NOT NULL UNIQUE,
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
	);

    ALTER TABLE category MODIFY category_id BIGINT NOT NULL AUTO_INCREMENT;
    ALTER TABLE product MODIFY category_id BIGINT NOT NULL;

	
	-- Giảm giá
	CREATE TABLE discounts (
	    discount_id INT AUTO_INCREMENT PRIMARY KEY,
	    product_id INT NOT NULL,
	    discount_value DECIMAL(5,2) NOT NULL,
	    start_date DATETIME,
	    end_date DATETIME,
	    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
	);

-- Đơn hàng
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT,
    total_price DECIMAL(10,2) NOT NULL,
    discount INT DEFAULT 0,
    received_amount DECIMAL(10,2),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Chi tiết đơn hàng
CREATE TABLE order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_number) REFERENCES orders(order_number) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- Doanh thu theo ngày
CREATE TABLE daily_revenue (
    revenue_date DATE NOT NULL PRIMARY KEY,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    total_profit DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER trg_users_role_uppercase_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  SET NEW.role = UPPER(NEW.role);
  SET NEW.status = UPPER(NEW.status);
END $$

CREATE TRIGGER trg_users_role_uppercase_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.role = UPPER(NEW.role);
  SET NEW.status = UPPER(NEW.status);
END $$

DELIMITER ;


-- Tạo tài khoản admin
INSERT INTO users (user_name, email, password, role, status)
VALUES ('admin', 'admin@example.com', '$2a$10$ZoIo8.SG7cUMEARBdVcs4uibCJFFbMvIIlwyMEyVzpWamNqhJ78Wq', 'admin', 'ACTIVE'),
('hai', 'hai@example.com', '$2a$10$ZoIo8.SG7cUMEARBdVcs4uibCJFFbMvIIlwyMEyVzpWamNqhJ78Wq', 'ADMIN', 'PENDING'),
('ngan', 'ngan@example.com', '$2a$10$ZoIo8.SG7cUMEARBdVcs4uibCJFFbMvIIlwyMEyVzpWamNqhJ78Wq', 'ADMIN', 'deleted');

INSERT INTO users (user_name, email, password)
VALUES ('cus', 'cus@example.com', '$2a$10$ZoIo8.SG7cUMEARBdVcs4uibCJFFbMvIIlwyMEyVzpWamNqhJ78Wq');


INSERT INTO category (category_name, category_image) VALUES
('Beverages', 'beverages.jpg'),
('Food', 'food.jpg'),
('Stationery', 'stationery.jpg'),
('Electronics', 'electronics.jpg'),
('Toys', 'toys.jpg'),
('Fashion', 'fashion.jpg'),
('Household', 'household.jpg'),
('Cosmetics', 'cosmetics.jpg'),
('Sports', 'sports.jpg'),
('Books', 'books.jpg'),
('Pet Supplies', 'pet_supplies.jpg');


INSERT INTO product (category_id, product_name, price, cost_price, discounted_price, description, stock_quantity, barcode, product_image, created_at, updated_at) VALUES
-- Beverages
(1, 'Coca-Cola Can', 12000, 8000, 11000, 'Coca-Cola Can - Refreshing beverage for your day.', 100, '0000000000015', 'cocacola_can.jpg', NOW(), NOW()),
(1, 'Pepsi Bottle', 13000, 9000, 12000, 'Pepsi Bottle - Classic taste of cola.', 90, '0000000000016', 'pepsi_bottle.jpg', NOW(), NOW()),
(1, 'Green Tea No Sugar', 15000, 11000, NULL, 'Green Tea No Sugar - Natural and healthy.', 120, '0000000000017', 'green_tea_no_sugar.jpg', NOW(), NOW()),
(1, 'Sparkling Water', 17000, 12000, 15000, 'Sparkling Water - Bubbles and freshness.', 50, '0000000000018', 'sparkling_water.jpg', NOW(), NOW()),
(1, 'Orange Juice', 20000, 14000, NULL, 'Orange Juice - Vitamin C boost.', 60, '0000000000019', 'orange_juice.jpg', NOW(), NOW()),
(1, 'Mineral Water', 10000, 7000, 9000, 'Mineral Water - Stay hydrated.', 200, '0000000000020', 'mineral_water.jpg', NOW(), NOW()),
(1, 'Red Bull Energy Drink', 25000, 18000, NULL, 'Red Bull Energy Drink - Gives you wings!', 30, '0000000000021', 'red_bull_energy_drink.jpg', NOW(), NOW()),
(1, 'Lemonade', 16000, 12000, 15000, 'Lemonade - Sweet and sour delight.', 70, '0000000000022', 'lemonade.jpg', NOW(), NOW()),
(1, 'Milk Tea', 30000, 22000, 28000, 'Milk Tea - Youth’s favorite drink.', 90, '0000000000023', 'milk_tea.jpg', NOW(), NOW()),
(1, 'Iced Coffee', 25000, 18000, NULL, 'Iced Coffee - Morning energy.', 80, '0000000000024', 'iced_coffee.jpg', NOW(), NOW()),
(1, 'Herbal Tea', 18000, 13000, 16000, 'Herbal Tea - Relax your mind.', 50, '0000000000025', 'herbal_tea.jpg', NOW(), NOW()),

-- Food
(2, 'Sandwich Bread', 22000, 15000, 20000, 'Sandwich Bread - Soft and fresh.', 100, '0000000000026', 'sandwich_bread.jpg', NOW(), NOW()),
(2, 'Cheddar Cheese', 60000, 45000, NULL, 'Cheddar Cheese - Rich flavor.', 40, '0000000000027', 'cheddar_cheese.jpg', NOW(), NOW()),
(2, 'Instant Noodles', 12000, 8000, 11000, 'Instant Noodles - Ready in 3 minutes.', 300, '0000000000028', 'instant_noodles.jpg', NOW(), NOW()),
(2, 'Frozen Dumplings', 45000, 30000, 40000, 'Frozen Dumplings - Easy to cook and delicious.', 150, '0000000000029', 'frozen_dumplings.jpg', NOW(), NOW()),
(2, 'Sausage Pack', 38000, 25000, NULL, 'Sausage Pack - Great for breakfast.', 100, '0000000000030', 'sausage_pack.jpg', NOW(), NOW()),
(2, 'Chocolate Bar', 15000, 10000, 14000, 'Chocolate Bar - Sweet treat.', 200, '0000000000031', 'chocolate_bar.jpg', NOW(), NOW()),
(2, 'Canned Tuna', 30000, 20000, NULL, 'Canned Tuna - Rich in protein.', 80, '0000000000032', 'canned_tuna.jpg', NOW(), NOW()),
(2, 'Granola Cereal', 65000, 48000, 60000, 'Granola Cereal - Healthy breakfast choice.', 60, '0000000000033', 'granola_cereal.jpg', NOW(), NOW()),
(2, 'Butter Croissant', 18000, 12000, 16000, 'Butter Croissant - Fresh and buttery.', 120, '0000000000034', 'butter_croissant.jpg', NOW(), NOW()),
(2, 'Oatmeal', 40000, 28000, 37000, 'Oatmeal - Healthy and nutritious.', 100, '0000000000035', 'oatmeal.jpg', NOW(), NOW()),
(2, 'Peanut Butter Jar', 75000, 55000, NULL, 'Peanut Butter Jar - Smooth and creamy.', 90, '0000000000036', 'peanut_butter_jar.jpg', NOW(), NOW()),

-- Stationery
(3, 'Ballpoint Pen', 5000, 3000, NULL, 'Ballpoint Pen - Smooth writing.', 500, '0000000000037', 'ballpoint_pen.jpg', NOW(), NOW()),
(3, 'A4 Notebook', 15000, 10000, 14000, 'A4 Notebook - Great for school.', 300, '0000000000038', 'a4_notebook.jpg', NOW(), NOW()),
(3, 'Sticky Notes', 8000, 5000, 7000, 'Sticky Notes - Colorful reminders.', 200, '0000000000039', 'sticky_notes.jpg', NOW(), NOW()),
(3, 'Highlighter Set', 25000, 18000, NULL, 'Highlighter Set - Bright and bold.', 100, '0000000000040', 'highlighter_set.jpg', NOW(), NOW()),
(3, 'Mechanical Pencil', 12000, 8000, 11000, 'Mechanical Pencil - Precise and refillable.', 150, '0000000000041', 'mechanical_pencil.jpg', NOW(), NOW()),
(3, 'Ruler 30cm', 6000, 4000, NULL, 'Ruler 30cm - Accurate measurement.', 250, '0000000000042', 'ruler_30cm.jpg', NOW(), NOW()),
(3, 'Eraser Pack', 4000, 2000, 3000, 'Eraser Pack - Clean erasing.', 400, '0000000000043', 'eraser_pack.jpg', NOW(), NOW()),
(3, 'Correction Tape', 10000, 7000, 9000, 'Correction Tape - Neat corrections.', 180, '0000000000044', 'correction_tape.jpg', NOW(), NOW()),
(3, 'Paper Clips Box', 5000, 3000, NULL, 'Paper Clips Box - Organize your work.', 300, '0000000000045', 'paper_clips_box.jpg', NOW(), NOW()),
(3, 'Document Folder', 15000, 10000, 14000, 'Document Folder - Keep things tidy.', 100, '0000000000046', 'document_folder.jpg', NOW(), NOW()),
(3, 'Binder Clips', 12000, 8000, NULL, 'Binder Clips - Hold papers tight.', 150, '0000000000047', 'binder_clips.jpg', NOW(), NOW()),

-- Electronics
(4, 'Bluetooth Headphones', 300000, 220000, 280000, 'Bluetooth Headphones - Wireless freedom.', 50, '0000000000048', 'bluetooth_headphones.jpg', NOW(), NOW()),
(4, '10000mAh Power Bank', 400000, 300000, NULL, '10000mAh Power Bank - Stay charged anywhere.', 60, '0000000000049', '10000mah_power_bank.jpg', NOW(), NOW()),
(4, 'Wireless Mouse', 150000, 100000, 130000, 'Wireless Mouse - Smooth and ergonomic.', 80, '0000000000050', 'wireless_mouse.jpg', NOW(), NOW()),
(4, 'USB-C Cable', 50000, 30000, 45000, 'USB-C Cable - Fast charging.', 200, '0000000000051', 'usbc_cable.jpg', NOW(), NOW()),
(4, 'Smartphone Stand', 80000, 50000, NULL, 'Smartphone Stand - Hands-free viewing.', 100, '0000000000052', 'smartphone_stand.jpg', NOW(), NOW()),
(4, 'LED Desk Lamp', 250000, 180000, 230000, 'LED Desk Lamp - Bright and efficient.', 40, '0000000000053', 'led_desk_lamp.jpg', NOW(), NOW()),
(4, 'Mini Speaker', 180000, 120000, NULL, 'Mini Speaker - Powerful sound.', 70, '0000000000054', 'mini_speaker.jpg', NOW(), NOW()),
(4, 'Portable SSD', 600000, 450000, 580000, 'Portable SSD - Fast storage on the go.', 30, '0000000000055', 'portable_ssd.jpg', NOW(), NOW()),
(4, 'Webcam 1080p', 350000, 250000, NULL, 'Webcam 1080p - Clear video calls.', 45, '0000000000056', 'webcam_1080p.jpg', NOW(), NOW()),
(4, 'Gaming Keyboard', 700000, 550000, 650000, 'Gaming Keyboard - RGB mechanical keys.', 35, '0000000000057', 'gaming_keyboard.jpg', NOW(), NOW()),
(4, 'Smart Plug', 200000, 150000, NULL, 'Smart Plug - Control devices remotely.', 60, '0000000000058', 'smart_plug.jpg', NOW(), NOW()),


(7, 'Dishwashing Liquid', 42000, 26000, 39000, 'Dishwashing Liquid - Cleans tough grease easily', 230, '0000000001500', 'dishwashing_liquid.jpg', NOW(), NOW()),
(7, 'Laundry Detergent', 65000, 40000, 62000, 'Laundry Detergent - Fresh floral scent', 190, '0000000001501', 'laundry_detergent.jpg', NOW(), NOW()),
(7, 'Toilet Paper', 45000, 27000, NULL, 'Toilet Paper - Soft and strong rolls', 310, '0000000001502', 'toilet_paper.jpg', NOW(), NOW()),
(7, 'Garbage Bags', 30000, 18000, 28000, 'Garbage Bags - Durable and leak-proof', 250, '0000000001503', 'garbage_bags.jpg', NOW(), NOW()),
(7, 'Mop Refill', 50000, 30000, 48000, 'Mop Refill - For smooth floor cleaning', 120, '0000000001504', 'mop_refill.jpg', NOW(), NOW()),
(7, 'Glass Cleaner', 35000, 20000, NULL, 'Glass Cleaner - Streak-free shine', 210, '0000000001505', 'glass_cleaner.jpg', NOW(), NOW()),
(7, 'Bleach', 28000, 16000, 25000, 'Bleach - Powerful disinfectant for home', 275, '0000000001506', 'bleach.jpg', NOW(), NOW()),
(7, 'Sponge Pack', 38000, 23000, 36000, 'Sponge Pack - Multi-purpose cleaning', 180, '0000000001507', 'sponge_pack.jpg', NOW(), NOW()),
(7, 'Fabric Softener', 52000, 31000, NULL, 'Fabric Softener - Keeps clothes soft', 145, '0000000001508', 'fabric_softener.jpg', NOW(), NOW()),
(7, 'Floor Cleaner', 46000, 29000, 44000, 'Floor Cleaner - Citrus scented formula', 195, '0000000001509', 'floor_cleaner.jpg', NOW(), NOW()),
(7, 'Air Freshener Spray', 39000, 22000, 37000, 'Air Freshener Spray - Refresh your room', 210, '0000000001510', 'air_freshener_spray.jpg', NOW(), NOW()),


(8, 'Shampoo', 72000, 45000, 68000, 'Shampoo - Nourishes your hair deeply', 300, '0000000001520', 'shampoo.jpg', NOW(), NOW()),
(8, 'Toothpaste', 36000, 21000, 34000, 'Toothpaste - For fresh breath all day', 280, '0000000001521', 'toothpaste.jpg', NOW(), NOW()),
(8, 'Toothbrush', 25000, 15000, NULL, 'Toothbrush - Soft bristles for gum care', 320, '0000000001522', 'toothbrush.jpg', NOW(), NOW()),
(8, 'Body Wash', 64000, 38000, 60000, 'Body Wash - Gentle on sensitive skin', 190, '0000000001523', 'body_wash.jpg', NOW(), NOW()),
(8, 'Deodorant Stick', 48000, 30000, NULL, 'Deodorant Stick - 24-hour protection', 220, '0000000001524', 'deodorant_stick.jpg', NOW(), NOW()),
(8, 'Cotton Swabs', 18000, 10000, 16000, 'Cotton Swabs - 200pcs per pack', 370, '0000000001525', 'cotton_swabs.jpg', NOW(), NOW()),
(8, 'Facial Cleanser', 53000, 32000, 50000, 'Facial Cleanser - Removes oil & dirt', 180, '0000000001526', 'facial_cleanser.jpg', NOW(), NOW()),
(8, 'Hair Gel', 42000, 25000, NULL, 'Hair Gel - Strong hold all day', 160, '0000000001527', 'hair_gel.jpg', NOW(), NOW()),
(8, 'Lip Balm', 26000, 15000, 24000, 'Lip Balm - Hydrates and protects lips', 340, '0000000001528', 'lip_balm.jpg', NOW(), NOW()),
(8, 'Razor Blades', 39000, 23000, 37000, 'Razor Blades - Smooth shaving experience', 200, '0000000001529', 'razor_blades.jpg', NOW(), NOW()),
(8, 'Hand Cream', 31000, 18000, NULL, 'Hand Cream - Keeps skin moisturized', 210, '0000000001530', 'hand_cream.jpg', NOW(), NOW()),


(9, 'Baby Diapers', 98000, 59000, 92000, 'Baby Diapers - Extra absorbent and soft', 170, '0000000001540', 'baby_diapers.jpg', NOW(), NOW()),
(9, 'Baby Wipes', 42000, 25000, NULL, 'Baby Wipes - Alcohol-free and gentle', 260, '0000000001541', 'baby_wipes.jpg', NOW(), NOW()),
(9, 'Infant Formula', 220000, 145000, 210000, 'Infant Formula - Complete nutrition', 90, '0000000001542', 'infant_formula.jpg', NOW(), NOW()),
(9, 'Baby Lotion', 54000, 33000, 50000, 'Baby Lotion - Moisturizes delicate skin', 140, '0000000001543', 'baby_lotion.jpg', NOW(), NOW()),
(9, 'Kids Shampoo', 48000, 29000, NULL, 'Kids Shampoo - No tears formula', 210, '0000000001544', 'kids_shampoo.jpg', NOW(), NOW()),
(9, 'Teething Toy', 31000, 18000, 28000, 'Teething Toy - BPA-free safe silicone', 180, '0000000001545', 'teething_toy.jpg', NOW(), NOW()),
(9, 'Baby Bottle', 39000, 24000, 36000, 'Baby Bottle - Anti-colic system', 200, '0000000001546', 'baby_bottle.jpg', NOW(), NOW()),
(9, 'Pacifier', 24000, 13000, NULL, 'Pacifier - Soothes baby during sleep', 300, '0000000001547', 'pacifier.jpg', NOW(), NOW()),
(9, 'Baby Powder', 27000, 15000, 25000, 'Baby Powder - Prevents rashes', 230, '0000000001548', 'baby_powder.jpg', NOW(), NOW()),
(9, 'Baby Bath Tub', 85000, 51000, 79000, 'Baby Bath Tub - Ergonomic design', 100, '0000000001549', 'baby_bath_tub.jpg', NOW(), NOW()),
(9, 'Kids Snack Pack', 34000, 20000, NULL, 'Kids Snack Pack - Healthy and fun', 280, '0000000001550', 'kids_snack_pack.jpg', NOW(), NOW()),


(10, 'Dog Food - Beef Flavor', 55000, 40000, 52000, 'Dog Food - Beef Flavor - Nutritious dry kibble for adult dogs.', 100, '0000000000501', 'dog_food_beef_flavor.jpg', NOW(), NOW()),
(10, 'Cat Litter', 45000, 32000, NULL, 'Cat Litter - Odor control and long-lasting.', 80, '0000000000502', 'cat_litter.jpg', NOW(), NOW()),
(10, 'Pet Shampoo', 60000, 42000, 55000, 'Pet Shampoo - Gentle formula for shiny coat.', 60, '0000000000503', 'pet_shampoo.jpg', NOW(), NOW()),
(10, 'Dog Collar', 35000, 25000, NULL, 'Dog Collar - Adjustable and durable.', 70, '0000000000504', 'dog_collar.jpg', NOW(), NOW()),
(10, 'Cat Toy Mouse', 15000, 9000, 12000, 'Cat Toy Mouse - Fun and interactive.', 120, '0000000000505', 'cat_toy_mouse.jpg', NOW(), NOW()),
(10, 'Bird Cage', 220000, 160000, 200000, 'Bird Cage - Spacious and safe.', 20, '0000000000506', 'bird_cage.jpg', NOW(), NOW()),
(10, 'Fish Tank Filter', 110000, 85000, NULL, 'Fish Tank Filter - Clean and quiet operation.', 30, '0000000000507', 'fish_tank_filter.jpg', NOW(), NOW()),
(10, 'Dog Leash', 40000, 30000, NULL, 'Dog Leash - Strong and comfortable grip.', 50, '0000000000508', 'dog_leash.jpg', NOW(), NOW()),
(10, 'Cat Scratching Post', 180000, 140000, 160000, 'Cat Scratching Post - Protect your furniture.', 15, '0000000000509', 'cat_scratching_post.jpg', NOW(), NOW()),
(10, 'Pet Bowl Set', 50000, 35000, NULL, 'Pet Bowl Set - Stainless steel, anti-slip.', 40, '0000000000510', 'pet_bowl_set.jpg', NOW(), NOW()),


(11, 'Car Shampoo', 70000, 50000, 65000, 'Car Shampoo - High foam, safe for paint.', 60, '0000000000601', 'car_shampoo.jpg', NOW(), NOW()),
(11, 'Engine Oil 4L', 450000, 350000, NULL, 'Engine Oil - High performance synthetic.', 40, '0000000000602', 'engine_oil_4l.jpg', NOW(), NOW()),
(11, 'Windshield Washer Fluid', 35000, 25000, NULL, 'Windshield Washer Fluid - Clean and streak-free.', 80, '0000000000603', 'windshield_fluid.jpg', NOW(), NOW()),
(11, 'Tire Inflator', 300000, 220000, 270000, 'Tire Inflator - Portable electric pump.', 25, '0000000000604', 'tire_inflator.jpg', NOW(), NOW()),
(11, 'Car Vacuum Cleaner', 550000, 400000, NULL, 'Car Vacuum Cleaner - Compact and powerful.', 20, '0000000000605', 'car_vacuum.jpg', NOW(), NOW()),
(11, 'Dashboard Cleaner', 45000, 30000, 40000, 'Dashboard Cleaner - Anti-static formula.', 70, '0000000000606', 'dashboard_cleaner.jpg', NOW(), NOW()),
(11, 'Seat Cushion', 220000, 170000, NULL, 'Seat Cushion - Ergonomic memory foam.', 30, '0000000000607', 'seat_cushion.jpg', NOW(), NOW()),
(11, 'Steering Wheel Cover', 80000, 60000, 75000, 'Steering Wheel Cover - Leather finish.', 50, '0000000000608', 'steering_wheel_cover.jpg', NOW(), NOW()),


(5, 'Lego Starter Set', 350000, 270000, 320000, 'Lego Starter Set - Creativity in every brick.', 50, '0000000000801', 'lego_starter_set.jpg', NOW(), NOW()),
(5, 'Remote Control Car', 420000, 330000, NULL, 'Remote Control Car - Fast and fun.', 40, '0000000000802', 'rc_car.jpg', NOW(), NOW()),
(5, 'Barbie Doll', 280000, 210000, 250000, 'Barbie Doll - Fashionable and iconic.', 60, '0000000000803', 'barbie_doll.jpg', NOW(), NOW()),
(5, 'Puzzle 1000 Pieces', 150000, 110000, NULL, 'Puzzle - Challenging and rewarding.', 70, '0000000000804', 'puzzle_1000.jpg', NOW(), NOW()),
(5, 'Action Figure - Superhero', 200000, 140000, 180000, 'Action Figure - Great for collection.', 35, '0000000000805', 'action_figure_superhero.jpg', NOW(), NOW()),
(5, 'Play-Doh Set', 120000, 80000, NULL, 'Play-Doh Set - Colorful and safe.', 90, '0000000000806', 'play_doh_set.jpg', NOW(), NOW()),
(5, 'Teddy Bear', 100000, 70000, 90000, 'Teddy Bear - Soft and huggable.', 80, '0000000000807', 'teddy_bear.jpg', NOW(), NOW()),
(5, 'Toy Train Set', 300000, 230000, 280000, 'Toy Train Set - Classic fun.', 25, '0000000000808', 'toy_train_set.jpg', NOW(), NOW()),
(5, 'Coloring Book & Crayons', 60000, 40000, 55000, 'Coloring Book - For creative kids.', 100, '0000000000809', 'coloring_book.jpg', NOW(), NOW()),


(6, 'Men T-Shirt - Black', 120000, 85000, 110000, 'Men T-Shirt - Soft cotton, classic style.', 100, '0000000000901', 'men_tshirt_black.jpg', NOW(), NOW()),
(6, 'Women Jeans - Skinny Fit', 350000, 260000, NULL, 'Women Jeans - Comfortable and stylish.', 60, '0000000000902', 'women_jeans_skinny.jpg', NOW(), NOW()),
(6, 'Unisex Hoodie', 450000, 330000, 400000, 'Unisex Hoodie - Warm and versatile.', 50, '0000000000903', 'unisex_hoodie.jpg', NOW(), NOW()),
(6, 'Baseball Cap', 80000, 60000, NULL, 'Baseball Cap - Adjustable and breathable.', 80, '0000000000904', 'baseball_cap.jpg', NOW(), NOW()),
(6, 'Socks Pack (5 pairs)', 100000, 70000, 95000, 'Socks Pack - Comfortable all-day wear.', 90, '0000000000905', 'socks_pack.jpg', NOW(), NOW()),
(6, 'Scarf - Winter Wool', 180000, 130000, 160000, 'Winter Scarf - Soft wool for cold days.', 40, '0000000000906', 'scarf_winter.jpg', NOW(), NOW()),
(6, 'Sneakers - White', 550000, 400000, 500000, 'Sneakers - Stylish and lightweight.', 35, '0000000000907', 'sneakers_white.jpg', NOW(), NOW()),
(6, 'Handbag - Leather', 700000, 520000, NULL, 'Handbag - Elegant genuine leather.', 20, '0000000000908', 'handbag_leather.jpg', NOW(), NOW());


INSERT INTO discounts (product_id, discount_value, start_date, end_date, created_at, updated_at) VALUES
(1, 10.00, '2025-07-01 00:00:00', '2025-07-31 23:59:59', NOW(), NOW()),
(3, 8.00, '2025-07-05 00:00:00', '2025-07-20 23:59:59', NOW(), NOW()),
(7, 5.00, '2025-07-10 00:00:00', '2025-07-25 23:59:59', NOW(), NOW()),
(10, 7.50, '2025-07-01 00:00:00', '2025-07-15 23:59:59', NOW(), NOW());


-- UPDATE users SET role = UPPER(role);



