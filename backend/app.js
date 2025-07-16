import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './database.js';

import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('🕹️ ADVC Game Backend Running');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
