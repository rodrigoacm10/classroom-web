import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".cursor/**",
  ]),
  {
    // Os hooks de dados carregam informações da API ao montar (fetch dentro de useEffect,
    // com setState de loading). É um padrão intencional do projeto e estável; refatorar
    // para outra abordagem de data fetching está fora do escopo do Code Freeze.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
