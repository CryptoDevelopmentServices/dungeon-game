import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Sequelize } from 'sequelize';
import fs from 'fs';

// initialise sequelize connection

const init = async () => {

  const db = await open({
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

  const modelFiles= fs.readdirSync("models/").filter(file => file.endsWith(".js"));

  let connection = new Sequelize({
    storage: 'database.sqlite',
    dialect: "sqlite",
  });

    console.log("Connected to the database...");
    try {
      await connection.authenticate();
    } catch (error) {
      console.error(error);
    }

    for (const file of modelFiles) {
      const model = await import(`../models/${file}`);
      model.default.init(connection)
    }

  modelFiles.map(async (file) => {
    const model = await import(`../models/${file}`);
    model.default.associate && model.default.associate(model);
  })
}

export default init;
