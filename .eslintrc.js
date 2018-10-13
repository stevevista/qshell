module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['standard', 'plugin:react/recommended'],
  globals: {
    __static: true
  },
  plugins: [
    'html',
    'react'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-curly-spacing': 0,
    'no-trailing-spaces': 0,
    'padded-blocks': 0,
    'no-multiple-empty-lines': 0,
    'key-spacing': 0
  }
}
