// videolink.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd())); // Serve videolink.html and assets

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  database: 'suhas',
  waitForConnections: true,
  connectionLimit: 10
});

// —— Video Links Endpoint ——
app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT video_link FROM video_links`);
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/videos error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 9001;
app.listen(PORT, () => {
  console.log(`✅ videolink.js running at http://localhost:${PORT}/videolink.html`);
  console.log(`✅ GET /api/videos for YouTube video links`);
});
