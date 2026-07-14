import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './utils/errorHandler';
import apiRoutes from './routes/api.routes';
import { initDb } from './services/history.service';

import path from 'path';

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.FRONTEND_URL }));

// Parsing & Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve ML Reports Figures
app.use('/api/reports/figures', express.static(path.join(__dirname, '../../../ml/reports/figures')));

// Routes
app.use('/api', apiRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

// Initialize DB and start server
const startServer = async () => {
  try {
    await initDb();
    console.log('✅ SQLite Database initialized');
    
    app.listen(env.PORT, () => {
      console.log(`🚀 Node.js Backend running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
