module.exports = {
  root: true,
  extends: ["universe/native"],
  rules: {
    "no-unused-vars": ["warn", { args: "all", argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
}
