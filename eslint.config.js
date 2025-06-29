import { Config } from '@eslint/eslintrc';

const config: Config = {
  extends: [
    'next/core-web-vitals',
    'next/typescript'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  }
};

export default config;
