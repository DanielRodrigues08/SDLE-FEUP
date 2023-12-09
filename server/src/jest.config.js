module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.js$': ['esbuild-jest', { sourcemap: 'inline', target: 'node14' }],
      },
    setupFiles: ['<rootDir>/tests/setup.js'],
};
