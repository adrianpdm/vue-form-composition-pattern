module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  env: {
    es5: {
      presets: ['@babel/preset-env'],
    },
    lib: {
      presets: [
        ['@babel/preset-env', {
          targets: 'last 1 chrome version',
          modules: false,
        }],
      ],
    },
  },
}
