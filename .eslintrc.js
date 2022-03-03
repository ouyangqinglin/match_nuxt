module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  globals: {
    PolyvLiveSdk: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'comma-dangle': 0,
    curly: 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-irregular-whitespace': 0,
    'no-lonely-if': 0,
    'no-void': 0,
    'nuxt/no-cjs-in-config': 0,
    'object-curly-spacing': [2, 'always'],
    'one-var': 0,
    'prefer-const': 0,
    quotes: ['error', 'single', {
      allowTemplateLiterals: true
    }],
    'space-before-function-paren': [2, {
      named: 'always'
    }],
    'vue/attributes-order': 0,
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/html-closing-bracket-newline': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/max-attributes-per-line': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/mustache-interpolation-spacing': 0,
    'vue/no-v-html': 0,
    'vue/order-in-components': 0,
    'vue/require-default-prop': 0,
    'vue/require-v-for-key': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/name-property-casing': 0
  }
}
