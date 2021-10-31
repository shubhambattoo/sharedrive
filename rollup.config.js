import dotenv from 'dotenv';
dotenv.config();
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const isProduction = process.env.NODE_ENV === 'production';

export default (async () => ({
  input: './public/js/index.js',
  output: {
    file: './public/js/bundle.js',
    format: 'cjs'
  },
  plugins: [resolve(), commonjs(), isProduction && (await import('rollup-plugin-terser')).terser()],
}))();