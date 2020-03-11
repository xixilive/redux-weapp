import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const {version} = require('./package.json');

export default [{
  input: './es6/index.js',
  plugins: [
    nodeResolve({preferBuiltins: false}),
    commonjs(),
  ],
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    banner: `/* redux-weapp@${version} */`
  }
}];