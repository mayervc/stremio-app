module.exports = {
  // Basic formatting options
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',

  // React/JSX specific options
  jsxSingleQuote: true,
  jsxBracketSameLine: false,

  // Line length and wrapping
  printWidth: 80,

  // Object and array formatting
  bracketSpacing: true,

  // Arrow function parameters
  arrowParens: 'avoid',

  // End of line character
  endOfLine: 'lf',

  // File type overrides
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
    {
      files: '*.json',
      options: {
        parser: 'json',
      },
    },
  ],
};
