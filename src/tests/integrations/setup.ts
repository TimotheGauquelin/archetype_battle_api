import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let sequelize: any;

beforeAll(async () => {
  try {
    console.log('Connecting to the test database ' + process.env.DATABASE_HOST_TEST + ' : ' + process.env.DATABASE_PORT_TEST + '/' + process.env.DATABASE_NAME_TEST);
    const db = await import('../../../config/Sequelize');
    sequelize = db.default;
    await db.connectDatabase();
    console.log('PostgreSQL TEST DB connection established');
  } catch (error) {
    console.error('Error connecting to the test database', error);
    throw error;
  }
});

afterAll(async () => {
  if (!sequelize) return;
  try {
    await sequelize.close();
    console.log('End of tests. Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection after tests', error);
  }
});


