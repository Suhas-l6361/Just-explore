// app.js
import express from 'express';
import mysql from 'mysql2/promise';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

/* ───── MySQL Config ───── */
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  waitForConnections: true,
  connectionLimit: 10
});

/* ───── HTML Page Routes ───── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/map.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'map.html'));
});

app.get('/package.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'package.html'));
});

app.get('/cities.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'cities.html'));
});

app.get('/videolink.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'videolink.html'));
});

/* ───── API Routes ───── */

// Cities API — from cities.js
app.get('/api/cities', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("USE suhas");
    const [rows] = await conn.query('SELECT city_id, city_name FROM Cities');
    res.json(rows);
    conn.release();
  } catch (err) {
    console.error('❌ /api/cities error:', err);
    res.status(500).json({ error: 'Cities query failed' });
  }
});

// Video Links API — from videolink.js
app.get('/api/videos', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("USE suhas");
    const [rows] = await conn.query('SELECT video_link FROM video_links');
    res.json(rows);
    conn.release();
  } catch (err) {
    console.error('❌ /api/videos error:', err);
    res.status(500).json({ error: 'Video query failed' });
  }
});

/* ───── Server Start ───── */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Combined app.js running at http://localhost:${PORT}`);
  console.log(`→ /                → index.html`);
  console.log(`→ /map.html        → map.html`);
  console.log(`→ /package.html    → package.html`);
  console.log(`→ /cities.html     → cities.html`);
  console.log(`→ /videolink.html  → videolink.html`);
  console.log(`→ /api/cities      → Cities API`);
  console.log(`→ /api/videos      → Video Links API`);
});
