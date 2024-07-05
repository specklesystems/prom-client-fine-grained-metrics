import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const getESMDirname = (importMetaUrl) => {
  return dirname(fileURLToPath(importMetaUrl))
}

export default [
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },
  {
    files: ['**/*.{js,mjs,cjs}', '**/.*.{js,mjs,cjs}'],
    ...pluginJs.configs.recommended
  },
  { ignores: ['node_modules', 'dist', '**/*.cjs'] },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: {
        tsconfigRootDir: getESMDirname(import.meta.url),
        project: './tsconfig.json'
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: [...(c.files || []), '**/*.ts', '**/*.d.ts']
  })),
  {
    files: ['**/*.ts', '**/*.d.ts', 'bin/www'],
    languageOptions: {
      ecmaVersion: 2022,
      parserOptions: {
        tsconfigRootDir: getESMDirname(import.meta.url),
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-return': 'error'
    }
  },
  {
    files: ['**/*.spec.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node
      }
    }
  },
  prettierConfig
]
