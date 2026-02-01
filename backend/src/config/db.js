import { neon } from '@neondatabase/serverless';
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);
export default sql;

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users(
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      payment_type VARCHAR(100),
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

    // Migration: Add payment_type column to existing tables (if not exists)
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'transactions' AND column_name = 'payment_type'
        ) THEN 
          ALTER TABLE transactions ADD COLUMN payment_type VARCHAR(100);
        END IF;
      END $$;
    `;

    console.log("Database initialized");

  } catch (error) {
    console.log("Error initializing database: ", error)
    process.exit(1);
  }
}
