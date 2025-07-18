const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// ✅ Use environment variables directly
const db = new Pool({
  host: process.env.DB_HOST || 'db', // Docker Compose service name
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Define route after DB is connected
app.get('/api/visits', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

    await db.query('INSERT INTO visits(timestamp) VALUES(NOW())');
    const result = await db.query('SELECT COUNT(*) FROM visits');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ error: 'DB operation failed' });
  }
});

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`🔌 Backend running on http://localhost:${port}`);
});
