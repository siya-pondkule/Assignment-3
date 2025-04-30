const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '23520008',
  database: 'school_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

// ✅ Registration Route
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password', error: err });
  }
});

// ✅ Login Route
// ✅ Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Send the user data back to the frontend, including the email
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role // Sending the role in the response
      }
    });
  });
});

  // ✅ Admin Routes

// Get all users (students and teachers)
// Get all users (students and teachers)
app.get('/admin/users', (req, res) => {
  const sql = 'SELECT * FROM users WHERE role IN ("student", "teacher")';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    console.log('Database results:', results); // Debugging line
    res.status(200).json({ users: results });
  });
});


// Update user details (name, email, role)
app.put('/admin/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email, and role are required' });
  }

  

  // Check if the email already exists for a different user
  const checkSql = 'SELECT * FROM users WHERE email = ? AND id != ?';
  db.query(checkSql, [email, userId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const updateSql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(updateSql, [name, email, role, userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(200).json({ message: 'User updated successfully' });
    });
  });
});

// Delete user
app.delete('/admin/user/:id', (req, res) => {
  const userId = req.params.id;

  const deleteSql = 'DELETE FROM users WHERE id = ?';
  db.query(deleteSql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});


//teacher

app.get('/students', (req, res) => {
  db.query('SELECT id, name, email FROM users WHERE role = "student"', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add marks
app.post('/add-marks', (req, res) => {
  const { student_id, email, subject1, subject2, subject3, subject4, subject5 } = req.body;

  const sql = `INSERT INTO result (student_id, email, subject1, subject2, subject3, subject4, subject5)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [student_id, email, subject1, subject2, subject3, subject4, subject5], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Marks added successfully', id: result.insertId });
  });
});


//student
// API route to get student marks
app.get('/student-marks/:email', (req, res) => {
  const email = req.params.email;  // Extract the email from the URL parameter
  console.log('Received email:', email); // Log the received email

  const sql = `SELECT * FROM result WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      console.log('No results found for email:', email); // Debug log
      return res.status(404).json({ message: 'No marks found for this student.' });
    }

    console.log('Marks found:', results[0]); // Debug log
    res.json(results[0]);
  });
});



  
// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
