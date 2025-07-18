const express = require('express');
const { Pool } = require('pg');
const AWS = require('aws-sdk');

const client = new AWS.SecretsManager({ region: 'eu-north-1' });
const app = express();
const port = 5000;

// 🔐 Fetch DB credentials securely
async function getDbConfig() {
  const secret = await client.getSecretValue({ SecretId: 'prod/3tier/db-creds' }).promise();
  return JSON.parse(secret.SecretString);
}

// ⚙️ Initialize everything
(async () => {
  try {
    const config = await getDbConfig();

    const db = new Pool({
      host: config.DB_HOST || 'db',
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      port: config.DB_PORT || 5432,
    });

    // ✅ Healthcheck route for root
    app.get('/', (req, res) => {
      res.json({
        status: '✅ Backend is alive',
        timestamp: new Date(),
        db: config.DB_NAME,
      });
    });

    // 📊 Visit tracking API
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

    app.listen(port, () => {
      console.log(`🔌 Backend running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Failed to load secrets or initialize DB:', err.message);
    process.exit(1);
  }
})();
