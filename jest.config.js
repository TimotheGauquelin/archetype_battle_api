module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/units/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/integrations/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/tests/**',
    '!src/**/index.ts',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/units/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};

