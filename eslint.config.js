// @ts-check

const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const globals = require("globals");

/**
 * @param {string[]} patterns
 * @param {import("eslint").Linter.FlatConfig[]} configs
 * @returns {import("eslint").Linter.FlatConfig[]}
 */
const overrides = (patterns, configs) =>
  configs.map((config) => ({
    ...config,
    files: patterns,
  }));

/** @type {FlatCompat} */
const compat = new FlatCompat();

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  ...overrides(
    ["**/*.js", "**/*.ts"],
    [
      {
        languageOptions: {
          globals: globals.node,
        },
      },
      js.configs.recommended,
      ...compat.extends("plugin:import/recommended"),
      {
        rules: {
          "import/first": "error",
          "import/no-cycle": "error",
          "import/order": [
            "error",
            {
              alphabetize: {
                order: "asc",
                orderImportKind: "asc",
                caseInsensitive: true,
              },
            },
          ],
          "sort-imports": [
            "error",
            {
              ignoreDeclarationSort: true,
            },
          ],
        },
      },
      prettier,
    ],
  ),
  ...overrides(
    ["**/*.ts"],
    [
      {
        languageOptions: {
          parserOptions: {
            project: "tsconfig.json",
          },
        },
        settings: {
          "import/resolver": {
            typescript: true,
            node: true,
          },
        },
      },
      ...compat.extends("plugin:@typescript-eslint/strict-type-checked"),
      ...compat.extends("plugin:import/typescript"),
      {
        rules: {
          "import/no-commonjs": "error",
        },
      },
    ],
  ),
];
