module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
        tsconfigRootDir: "./",
    },
    plugins: ["simple-import-sort"],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/ban-types": "off",
        "simple-import-sort/imports": ["error", { groups: [["^\\u0000", "^@?\\w", "^[^.]", "^\\."]] }],
        "sort-keys": "off",
        "quote-props": ["error", "as-needed", { keywords: false }],
        curly: ["error", "multi-line"],
        "max-classes-per-file": "off",
        "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
        "arrow-parens": ["error", "as-needed"],
        "no-cond-assign": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-unused-vars": "off",
        semi: ["error", "never"],
        "@typescript-eslint/semi": ["error", "never"],
        "object-shorthand": ["error", "always"],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                multiline: {
                    delimiter: "none",
                    requireLast: false,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
            },
        ],
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/ban-ts-ignore": "off",
    },
}
