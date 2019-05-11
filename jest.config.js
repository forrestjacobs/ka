module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.d.ts", "!**/*.test.{ts,tsx}"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80
    }
  },
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/packages/tsconfig.settings.json"
    }
  },
  preset: "ts-jest",
  roots: [
    "packages/base/src",
    "packages/data/src",
    "packages/kanjidic2sql/src",
    "packages/rest/src",
    "packages/web/src"
  ],
  setupFiles: ["./setupJest.js"],
  testEnvironment: "node",
  testMatch: ["**/*.test.{ts,tsx}"]
};
