module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/../server/'],
  moduleFileExtensions: [
    'js',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: false
}
