import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd())); // serve package.html and assets

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  database: 'suhas',
  waitForConnections: true,
  connectionLimit: 10
});

// —— Package tours endpoint —— 
app.get('/api/packages', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         package_id, city_id, city_name, 
         duration_days, price, description 
       FROM packagetours`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/packages error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ package.js running on http://localhost:${PORT}/package.html`);
  console.log(`✅ GET /api/packages to retrieve all package tours`);
});
