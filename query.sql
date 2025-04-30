CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('student', 'teacher', 'admin') NOT NULL
);
select * from users;

CREATE TABLE result (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject1 INT,
  subject2 INT,
  subject3 INT,
  subject4 INT,
  subject5 INT
);
select * from result;