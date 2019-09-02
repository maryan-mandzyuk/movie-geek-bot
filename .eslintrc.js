module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "linebreak-style": 0,
    "indent": [2, "tab"],
    "no-tabs": 0,
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    "comma-dangle":0,
    "no-console": "off",
    "eol-last": 0,
    "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"],
    "parser": "babel-eslint",
    "prefer-destructuring": ["error", {"object": false, "array": false}],
    "no-await-in-loop": 0,
  }
};

