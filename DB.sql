-- Create DB --
sqlite3 vine_DB.db

-- View the info in the Wine table --
SELECT * FROM Wine;

--Or more readable format--
sqlite3 vine_DB.db <<EOF
.headers on
.mode column
SELECT * FROM Wine;
EOF

-- Create wine information table

CREATE TABLE IF NOT EXISTS Wine (
id INTEGER PRIMARY KEY AUTOINCREMENT,
wineMaker TEXT NOT NULL,
wineName TEXT NOT NULL,
grape TEXT NOT NULL,
type TEXT NOT NULL CHECK (type IN ('Red', 'White', 'Rose', 'Sparkling', 'Dessert', 'Fortified')),
year INTEGER,
rating REAL,
region TEXT,
notes TEXT,
userId INTEGER 
);


-- Create user information table

CREATE TABLE IF NOT EXISTS User (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL


);

-- Insert dummy data into wine table

INSERT INTO Wine (wineMaker, wineName, grape, type, year, rating, region, notes, userId) VALUES
('Wine Maker', 'Seven Hills', 'Chardonnay', 'White', 2018, 4.5, 'California', 'Notes section', 001),
('Wine Maker','Favourite Wine', 'Merlot', 'Red', 2017, 4.0, 'Bordeaux', 'Notes section', 001),
('Wine Maker','Wine Test', 'Pinot Noir', 'Red', 2019, 4.7, 'Burgundy', 'This is a test wine', 001),
('Wine Maker','Another Wine', 'Sauvignon Blanc', 'White', 2016, 4.2, 'New Zealand', 'This is another test wine', 002),
('Wine Maker','Another Wine', 'Sauvignon Blanc', 'White', 2016, 4.2, 'New Zealand', 'This is another test wine', 002);

  
-- Insert dummy data into user table
INSERT INTO User (username, email, password ) VALUES
('john_doe', 'john@example.com', 'password'),
('jane_smith','jane@example.com', 'test');