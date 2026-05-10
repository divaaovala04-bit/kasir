-- skema contoh DB kasir (opsional)
-- Aplikasi ini berjalan client-side dulu (tanpa koneksi DB), namun file SQL ini disediakan sebagai referensi.

CREATE DATABASE IF NOT EXISTS kasir_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kasir_app;

-- master produk
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  barcode VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  price INT NOT NULL DEFAULT 0
);

-- transaksi
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(64) NOT NULL UNIQUE,
  total_qty INT NOT NULL DEFAULT 0,
  total_amount INT NOT NULL DEFAULT 0,
  cash_paid INT NOT NULL DEFAULT 0,
  change_amount INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- detail transaksi
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  unit_price INT NOT NULL,
  subtotal INT NOT NULL,
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- contoh data
INSERT INTO products (barcode, name, price) VALUES
  ('8991234567890','Air Mineral 600ml',5000),
  ('8991112223334','Kopi Botol 250ml',15000),
  ('8995556667778','Mie Instan Goreng',3500),
  ('8999990001112','Biskuit Coklat 200g',18000),
  ('8992223334445','Susu UHT 1L',45000)
ON DUPLICATE KEY UPDATE
  name=VALUES(name), price=VALUES(price);

