import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import walletRoutes from './routes/wallet.js';
import { init } from './db/sql.js'; // ✅ Best to use named import
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())

// Static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);

// Initialize DB and start server
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await init(); // Sequelize model and DB sync
    console.log('✅ Database initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1); // Exit cleanly on failure
  }
})();
