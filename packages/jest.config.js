module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.test.{ts,tsx}"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80
    }
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testMatch: ["**/*.test.{ts,tsx}"]
};
