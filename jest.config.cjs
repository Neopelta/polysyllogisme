module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  roots: ['<rootDir>/ts'], 
};
