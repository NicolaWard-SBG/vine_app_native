-- Create DB --
sqlite3 vine_DB.db

-- Create wine information table

CREATE TABLE IF NOT EXISTS Wine (
id INTEGER PRIMARY KEY,
wineName TEXT NOT NULL,
grape TEXT NOT NULL,
type TEXT NOT NULL CHECK (type IN ('Red', 'White', 'Rose', 'Sparkling', 'Dessert', 'Fortified')),
year INTEGER,
rating REAL,
region TEXT
);


-- Create user information table

CREATE TABLE IF NOT EXISTS User (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL,
password TEXT NOT NULL,
email TEXT NOT NULL

);

-- Insert dummy data into wine table

INSERT INTO Wine (wineName, grape, type, year, rating, region) VALUES
('Seven Hills', 'Chardonnay', 'White', 2018, 4.5, 'California'),
('Favourite Wine', 'Merlot', 'Red', 2017, 4.0, 'Bordeaux'),
('Wine Test', 'Pinot Noir', 'Red', 2019, 4.7, 'Burgundy');

  
-- Insert dummy data into user table
INSERT INTO User (username, password, email ) VALUES
('john_doe', 'password', 'john@example.com'),
('jane_smith', 'test', 'jane@example.com');