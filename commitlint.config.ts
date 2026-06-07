export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "revert",
        "build",
      ],
    ],
    // Scopes must be kebab-case: feat(file-card): not feat(FileCard):
    "scope-case": [2, "always", "kebab-case"],
    // Keep subject lines short and readable
    "subject-max-length": [2, "always", 72],
    // Don't limit body — detailed PR descriptions are fine
    "body-max-line-length": [0],
  },
};
