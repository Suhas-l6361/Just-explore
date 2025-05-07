import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

// serve every file in this folder (index.html, videos, etc.)
const STATIC_DIR = process.cwd();
app.use(express.static(STATIC_DIR));

// root → index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  database: 'suhas',
});

// GET /api/cities → [ "Shimoga", "Bangalore", … ]
app.get('/api/cities', (req, res) => {
  connection.query('SELECT city_name FROM Cities', (err, results) => {
    if (err) {
      console.error('❌ Error fetching cities:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(r => r.city_name));
  });
});

// GET /api/destinations → [ "Mysore", "Hampi", … ]
app.get('/api/destinations', (req, res) => {
  connection.query(
    'SELECT DISTINCT arrival_city_name FROM transportation',
    (err, results) => {
      if (err) {
        console.error('❌ Error fetching destinations:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results.map(r => r.arrival_city_name));
    }
  );
});

// POST /submit → validate + insert row into `form`
app.post('/submit', (req, res) => {
  const {
    starting_city,
    destination_city,
    number_of_persons,
    select_date,
    number_of_days,
    select_transport
  } = req.body;

  // server‐side validation
  if (
    !starting_city ||
    !destination_city ||
    !number_of_persons ||
    !select_date ||
    !number_of_days ||
    !select_transport
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO form
      (starting_city, destination_city, number_of_persons, select_date, select_transport, number_of_days)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      starting_city,
      destination_city,
      number_of_persons,
      select_date,
      select_transport,
      number_of_days
    ],
    (err, result) => {
      if (err) {
        console.error('❌ Insert error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
