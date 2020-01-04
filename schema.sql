DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price INT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 
("Mechanical Keyboard", "Computers", 120, 300),
("Mouse", "Computers", 80, 250),
("Speakers", "Audio", 240, 90),
("Headphones", "Audio", 300, 540),
("Headphone Amp", "Audio", 99, 230),
("USB MIC", "Computers", 60, 200),
("Shoes", "Clothing", 120, 500),
("T-Shirt", "Clothing", 20, 100),
("Golf Balls", "Golf", 8, 1000),
("Iron Set", "Golf", 380, 18)
