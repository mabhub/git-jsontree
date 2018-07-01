module.exports = {
    extends: 'makina',
    env: {
      node: true,
    },
    rules: {
      'import/no-extraneous-dependencies': ['warn', { 'devDependencies': ['**/*.test.js', '**/*.spec.js', , '**/*.stories.js', 'temp-repository.js']}],
    }
};
