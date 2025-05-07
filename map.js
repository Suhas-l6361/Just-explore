// map.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd())); // serve map.html, media, client scripts

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Suhas@123',
  database: 'suhas',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/api/last-journey', async (req, res) => {
  try {
    // 1) most recent form entry
    const [forms] = await pool.query(
      'SELECT * FROM form ORDER BY id DESC LIMIT 1'
    );
    if (!forms.length) {
      return res.status(404).json({ error: 'No journey found' });
    }
    const form = forms[0];

    // 2) matching transport
    const [transRows] = await pool.query(
      `SELECT * FROM transportation
         WHERE departure_city_name = ?
           AND arrival_city_name   = ?
         LIMIT 1`,
      [form.starting_city, form.destination_city]
    );
    if (!transRows.length) {
      return res.status(404).json({ error: 'No transport found' });
    }
    const transport = transRows[0];

    // 3) cheapest hotel
    const [hotelRows] = await pool.query(
      `SELECT * FROM hotels
         WHERE city_name = ?
         ORDER BY room_price
         LIMIT 1`,
      [form.destination_city]
    );
    const hotel = hotelRows[0] || {};

    // 4) up to 5 attractions
    const [attractions] = await pool.query(
      `SELECT * FROM attractions
         WHERE city_id = ?
         ORDER BY entry_fee
         LIMIT 5`,
      [hotel.city_id]
    );

    // 5) choose video
    const videoSrc = form.select_transport === 'Train'
      ? 'indiantrainm.mp4'
      : 'bus.mp4';

    res.json({ form, transport, hotel, attractions, videoSrc });
  } catch (err) {
    console.error('❌ map.js error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ map.js running at http://localhost:${PORT}/map.html`);
});
