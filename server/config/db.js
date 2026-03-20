import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Use individual parameters to avoid connection string URL-encoding issues
const pool = new Pool({
  user: process.env.DB_USER || "postgres.wliofobyfwjgmfozpazm",
  host: process.env.DB_HOST || "aws-1-ap-south-1.pooler.supabase.com",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 6543,
  max: 10,                  // Max connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail fast if DB unreachable
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Supabase DB connection error:", err.message);
  } else {
    console.log("✅ Connected to Supabase PostgreSQL");
    release();
  }
});

export default pool;
