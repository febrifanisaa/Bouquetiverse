-- Create database if not exists
CREATE DATABASE IF NOT EXISTS bouquetiverse;
USE bouquetiverse;

-- Create tables
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    date DATETIME NOT NULL,
    timestamp BIGINT NOT NULL
);

-- Add some initial data (optional)
INSERT INTO orders (product, name, email, phone, address, date, timestamp)
VALUES 
('Bucket Snack', 'Demo User', 'demo@example.com', '+62-822-6011-6061', 'Jl. Medan - Banda Aceh, Mesjid Punteut', NOW(), UNIX_TIMESTAMP() * 1000);
