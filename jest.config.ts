import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  collectCoverageFrom: ["src/**"],
  coveragePathIgnorePatterns: ["/__tests__", "/prisma"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testEnvironment: "jest-environment-jsdom",
});
