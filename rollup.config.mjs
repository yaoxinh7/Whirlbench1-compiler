import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: './src/main.mjs',
  output: {
    file: './dist-compiler/whirl.cjs',
    format: 'cjs',
    inlineDynamicImports: true,
    //sourcemap: true,
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    }),
  ],
};