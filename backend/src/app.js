import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.nodeEnv !== 'production' || env.clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    }
  })
);
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => res.json({ name: 'Logistics API', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

connectDB()
  .then(() => {
    const server = app.listen(env.port, () => console.log(`API running on port ${env.port}`));

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${env.port} is already in use. Stop the existing backend or set PORT to another value in .env.`);
        process.exit(1);
      }

      throw error;
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });

export default app;
