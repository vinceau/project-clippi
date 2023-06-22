module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allow parsing of JSX
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "plugin:react/recommended",
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:@typescript-eslint/recommended",
    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "prettier/@typescript-eslint",
    // Enables eslint-plugin-prettier and eslint-config-prettier.
    // This will display prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    "plugin:prettier/recommended",
  ],
  plugins: ["import", "simple-import-sort", "strict-booleans", "react-hooks"],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/consistent-type-imports": "warn",
    "import/no-default-export": "error",
    "import/no-named-as-default-member": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "strict-booleans/no-nullable-numbers": "error",
    "no-undef": "off",
    "new-cap": "error",
    curly: "error",
  },
  ignorePatterns: ["/*.js", "*.d.ts"],
};
