module.exports = {
  root: true,
  extends: ["universe/native", "plugin:@tanstack/query/recommended"],
  rules: {
    "no-unused-vars": ["warn", { args: "all", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
}
