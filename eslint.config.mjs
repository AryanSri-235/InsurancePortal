import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "prisma/migrations/**",
    ],
  },

  ...coreWebVitals,
  ...typescript,

  {
    rules: {
      // Catches `{count && <div/>}` — when count is 0, React renders a literal
      // "0" instead of nothing. This shipped to production on the policy cards.
      // `!!count && <div/>` and ternaries are accepted.
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary", "coerce"] }],

      // Unused code is the thing we just spent an audit removing — keep it visible.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];

export default config;
