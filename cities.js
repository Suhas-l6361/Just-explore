import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd())); // serve cities.html and assets

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  database: 'suhas',
  waitForConnections: true,
  connectionLimit: 10
});

// —— Cities endpoint —— 
app.get('/api/cities', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         city_id,
         city_name
       FROM Cities`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/cities error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ cities.js running on http://localhost:${PORT}/cities.html`);
  console.log(`✅ GET /api/cities to retrieve all cities`);
});
