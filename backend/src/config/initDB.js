import { sql } from './db.js';

/**
 * Initialize the database schema
 * Creates the transactions table if it doesn't exist
 */
export const initializeDB = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    
    // DECIMAL(10,2) means:
    // - 10 digits in total
    // - 2 digits after the decimal point
    // - Maximum value: 99,999,999.99

    console.log("✓ Database initialized successfully");
  } catch (err) {
    console.error("✗ Error initializing database:", err);
    process.exit(1);
  }
};
