module.exports = {
  parser: "babel-eslint",
  plugins: ["jest", "react", "flowtype"],
  settings: {
    react: {
      version: "16.4.2", // React version, default to the latest React stable release
      flowVersion: "0.79.1" // Flow version
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:flowtype/recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    sourceType: "module"
  },
  overrides: [
    {
      files: "**/__tests__/*.spec.js",
      env: {
        "jest/globals": true
      }
    }
  ],
  rules: {
    "react/prop-types": 0
  }
};
