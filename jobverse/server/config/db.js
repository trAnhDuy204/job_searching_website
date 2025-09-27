const { Pool } = require('pg');
require('dotenv').config();

let config;
let dbMode = "local";

if (process.env.DATABASE_URL) {
  // Cloud DB (Render)
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
  dbMode = "render";
} else {
  // Localhost DB
  config = {
    user: "postgres",
    password: "abc123",
    host: "localhost",
    port: 5432,
    database: "db_web_tim_kiem_viec_lam"
  };
  dbMode = "local";
}

const pool = new Pool(config);

pool.connect()
  .then(client => {
    return client.query("SELECT NOW()")
      .then(res => {
        console.log(`✅ DB connected (${dbMode}) at:`, res.rows[0].now);
        client.release();
      })
      .catch(err => {
        client.release();
        console.error("❌ Query error:", err.stack);
      });
  })
  .catch(err => console.error("❌ DB connection error:", err.stack));

module.exports = pool;
