module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.test.ts",
  ],
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
};