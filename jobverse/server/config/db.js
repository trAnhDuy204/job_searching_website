const { Pool } = require('pg');
require('dotenv').config();

let config;

if (process.env.DATABASE_URL) {
  // Cloud DB (Render)
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // Localhost DB
  config = {
    user: "postgres",
    password: "abc123",
    host: "localhost",
    port: 5432,
    database: "db_web_tim_kiem_viec_lam"
  };
}

const pool = new Pool(config);

module.exports = pool;
