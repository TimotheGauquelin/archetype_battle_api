import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/AuthRoute';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
const apiRouter = express.Router();

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://archetype-warfare-reactjs.onrender.com/',
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);

apiRouter.use('/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'API is running', status: 'ok' });
});

app.use(errorHandler);

export default app;

