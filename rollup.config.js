import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

var pkg = require('./package.json');

export default {
  format: 'umd',
  entry: pkg.rollup.entry,
  dest: pkg.rollup.dest,
  moduleName: pkg.rollup.moduleName,
  plugins: [
    json({
      exclude: [ 'node_modules/**' ]
    }),
    babel({
      exclude: ['node_modules/**', '*.json'],
      presets: ['es2015-rollup'],
      babelrc: false
    })
  ]
}