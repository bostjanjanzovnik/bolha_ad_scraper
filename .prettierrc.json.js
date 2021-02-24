module.exports = {
    parser: "typescript",
    singleQuote: false,
    trailingComma: "none",
    semi: false,
    useTabs: true,
    bracketSpacing: true,
    arrowParens: "avoid",
    printWidth: 120,
    overrides: [
        {
            files: "*.json",
            options: { "parser": "json" }
        }
    ]
}
