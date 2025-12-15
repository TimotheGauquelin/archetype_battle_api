import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: The environment variable ${envVar} is not defined`);
    process.exit(1);
  }
}

export const config = {
  development: {
    host: process.env.DATABASE_HOST as string,
    port: process.env.DATABASE_PORT as string,
    database: process.env.DATABASE_NAME as string,
    username: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string,
  },
  test: {
    host: process.env.DATABASE_HOST_TEST as string,
    port: process.env.DATABASE_PORT_TEST as string,
    database: process.env.DATABASE_NAME_TEST as string,
    username: process.env.DATABASE_USER_TEST as string,
    password: process.env.DATABASE_PASSWORD_TEST as string,
  },
};

const sequelize = new Sequelize(
  config[env as 'development' | 'test'].database,
  config[env as 'development' | 'test'].username,
  config[env as 'development' | 'test'].password,
  {
    host: config[env as 'development' | 'test'].host,
    port: Number(config[env as 'development' | 'test'].port),
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false,
    dialectOptions: {
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
    define: {
      underscored: true,
      timestamps: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDatabase = async (retries = 5, delay = 2000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log(
        `Connection to the database ${
          config[env as 'development' | 'test'].database
        } on port ${config[env as 'development' | 'test'].port} established successfully.`
      );
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error(
          `Unable to connect to the database ${
            config[env as 'development' | 'test'].database
          } after ${retries} attempts:`,
          err
        );
        process.exit(1);
      }
      console.log(
        `Attempt ${i + 1}/${retries} - Database connection failed, retrying in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default sequelize;



