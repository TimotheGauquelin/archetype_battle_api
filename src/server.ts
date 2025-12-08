import app from './index';
import { connectDatabase } from '../config/Sequelize';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(process.env.API_PORT, () => {
      console.info(`Launching server on port ${process.env.API_PORT} - ${process.env.NODE_ENV || 'development'} environment`);
    });
  } catch (error) {
    console.error('Error launching server:', error);
  }
};

startServer();

