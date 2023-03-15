const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const connectionString = 'postgresql://postgres:d76W4zi83YtrnIL4cWFh@containers-us-west-201.railway.app:7873/railway';

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool({
  connectionString,
});

module.exports = pool;
