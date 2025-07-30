const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_web_tim_kiem_viec_lam',
  password: 'abc123',
  port: 5432
});

module.exports = pool;