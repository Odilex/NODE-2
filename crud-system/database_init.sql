-- Database initialization script

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS school_crud;

-- Use the database
USE school_crud;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2a$10$JqWvz7ycBp/Jf.Oj3jQeT.cTMfLBn4tqxP4lzw8mgOdEUBwpvK7Hy', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- Insert default student user (password: student123)
INSERT INTO users (username, password, role) 
VALUES ('student', '$2a$10$Ot1.F6Qv/k8UJJHz.Qxs0uxQSJ5MUDWn7Q5dlOHmyZ9BFCl3LxjLy', 'student')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample products
INSERT INTO products (name, description, price) VALUES
('Laptop', 'High-performance laptop for students', 899.99),
('Textbook', 'Comprehensive textbook for computer science', 79.99),
('Notebook', 'Premium quality notebook', 4.99),
('Backpack', 'Durable backpack with multiple compartments', 49.99),
('Calculator', 'Scientific calculator for advanced math', 19.99)
ON DUPLICATE KEY UPDATE name = name;

-- Note: The passwords are hashed using bcrypt
-- admin123 for admin user
-- student123 for student user