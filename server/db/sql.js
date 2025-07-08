import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

// Create basic tables on startup
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    wallet_address TEXT,
    balance REAL DEFAULT 0
  );
`);
