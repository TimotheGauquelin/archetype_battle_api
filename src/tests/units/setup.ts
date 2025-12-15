import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

jest.mock('../../../config/Sequelize', () => {
  const mockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  };

  return {
    __esModule: true,
    default: {
      transaction: jest.fn().mockResolvedValue(mockTransaction),
      authenticate: jest.fn().mockResolvedValue(undefined),
    },
  };
});

