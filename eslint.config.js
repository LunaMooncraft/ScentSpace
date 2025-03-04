import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const customRules = {
  'stylistic/comma-spacing': ['error', { before: false, after: true }],
  'stylistic/semi': ['error', 'always'],
  'stylistic/object-curly-spacing': ['error', 'always'],
  'stylistic/quotes': ['error', 'single'],
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'vue/attribute-hyphenation': 'off',
  'vue/multi-word-component-names': 'off',
  'no-console': ['warn', { allow: ['info', 'warn', 'error'] }]
}

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: { stylistic },
    rules: customRules
  }
)
