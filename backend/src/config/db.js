import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Create a connection using the database URL from environment variables
export const sql = neon(process.env.DATABASE_URL);