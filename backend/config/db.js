const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// ✅ FORCE search_path for every connection
pool.on('connect', (client) => {
  client.query('SET search_path TO public');
});

module.exports = pool;
