import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './db/sql.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import walletRoutes from './routes/wallet.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
