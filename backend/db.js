import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "postgres",
  user: "snap",
  password: "snap123",
  database: "snapvault",
  port: 5432,
});