// eslint.config.mjs
import { tanstackConfig } from '@tanstack/eslint-config'
import parser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      'coverage',
      '.next',
      'public',
      '*.config.*',
      'eslint.config.mjs',
      'backend'
    ]
  },
  ...tanstackConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      }
    },
    rules: {
      // --- FORMATTING RULES ---
      'indent': ['error', 2], // Added: 2-space indentation
      'linebreak-style': ['error', 'unix'], // Added: enforce Unix line endings
      'quotes': ['error', 'single', { avoidEscape: true }], // Added: single quotes
      'semi': ['error', 'never'], // Added: no semicolons
      'comma-dangle': ['error', 'always-multiline'], // Added: trailing commas in multiline
      'comma-spacing': ['error', { before: false, after: true }], // Added: space after commas
      'object-curly-spacing': ['error', 'always'], // Added: spaces inside {}
      'array-bracket-spacing': ['error', 'never'], // Added: no spaces inside []
      'arrow-spacing': ['error', { before: true, after: true }], // Added: spaces around arrows
      'keyword-spacing': ['error', { before: true, after: true }], // Added: spaces around keywords
      'space-before-blocks': ['error', 'always'], // Added: space before blocks
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }], // Added: function spacing rules
      'space-in-parens': ['error', 'never'], // Added: no spaces in parentheses
      'space-infix-ops': 'error', // Added: spaces around operators
      'space-unary-ops': ['error', { words: true, nonwords: false }], // Added: unary operator spacing
      'template-curly-spacing': ['error', 'never'], // Added: no spaces in template literals
      
      // --- CODE QUALITY RULES ---
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Added: consistent type imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],
      // Added: consistent array types
      '@typescript-eslint/array-type': ['error', { default: 'array' }],

      // --- IMPORT RULES ---
      'import/order': ['error', { // Added: import organization
        groups: [
          'builtin',     // Node.js built-ins
          'external',    // npm packages
          'internal',    // Internal aliases
          'parent',      // Parent imports
          'sibling',     // Sibling imports
          'index',       // Index imports
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }],
      'import/newline-after-import': ['error', { count: 1 }], // Added: newline after imports
      
      // --- GENERAL STYLE RULES ---
      'max-len': ['error', { // Added: line length limit
        code: 100,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // Added: limit empty lines
      'eol-last': ['error', 'always'], // Added: newline at end of file
      'no-trailing-spaces': 'error', // Added: no trailing whitespace
      'no-multi-spaces': 'error', // Added: no multiple spaces
      'no-whitespace-before-property': 'error', // Added: no whitespace before property
      'padding-line-between-statements': [ // Added: spacing between statements
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
    }
  },
  // Override for specific files (config files shouldn't follow all rules)
  {
    files: ['*.config.*', '*.setup.*'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import/order': 'off',
      'max-len': 'off'
    }
  }
]