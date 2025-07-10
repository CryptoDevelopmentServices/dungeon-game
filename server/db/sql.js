import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create shared Sequelize instance
const sequelize = new Sequelize({
  storage: './database.sqlite',
  dialect: 'sqlite',
  logging: false,
});

const db = {};

const init = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to the database.');

    // Load all models
    const modelsPath = path.resolve(__dirname, '../models');
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

    for (const file of modelFiles) {
      const modelModule = await import(`../models/${file}`);
      const model = modelModule.default.init(sequelize);
      db[model.name] = model;
    }

    // Setup associations
    for (const modelName in db) {
      if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
      }
    }

    await sequelize.sync();
    console.log('✅ Tables synced.');
  } catch (err) {
    console.error('❌ Database init failed:', err);
  }
};

export { init, sequelize, db };
