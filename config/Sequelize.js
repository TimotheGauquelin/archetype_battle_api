import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: The environment variable ${envVar} is not defined`);
        process.exit(1);
    }
}

const config = {
    development: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    },
    test: {
        host: process.env.DATABASE_HOST_TEST,
        port: process.env.DATABASE_PORT_TEST,
        database: process.env.DATABASE_NAME_TEST,
        username: process.env.DATABASE_USER_TEST,
        password: process.env.DATABASE_PASSWORD_TEST
    },
};

const pool = new Sequelize(
    config[env].database,
    config[env].username,
    config[env].password,
    {
        host: config[env].host,
        port: config[env].port,
        dialect: 'postgres',
        logging: env === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.DATABASE_SSL === 'true' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        define: {
            underscored: true,
            timestamps: false, // Désactivé par défaut, à activer dans les modèles qui en ont besoin
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDatabase = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.authenticate();
            console.log(`Connection to the database ${config[env].database} on port ${config[env].port} established successfully.`);
            return;
        } catch (err) {
            if (i === retries - 1) {
                console.error(`Unable to connect to the database ${config[env].database} after ${retries} attempts:`, err);
                process.exit(1);
            }
            console.log(`Attempt ${i + 1}/${retries} - Database connection failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

export { config, connectDatabase };