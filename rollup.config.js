import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  // ES Module build
  {
    input: 'index.js',
    output: {
      file: 'dist/mgraph.graph.esm.js',
      format: 'es'
    },
    plugins: [nodeResolve()],
    external: ['mgraph.events']
  },
  // UMD build
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/mgraph.graph.umd.js',
        format: 'umd',
        name: 'createGraph',
        exports: 'default'
      },
      {
        file: 'dist/mgraph.graph.umd.min.js',
        format: 'umd',
        name: 'createGraph',
        exports: 'default',
        plugins: [terser()]
      }
    ],
    plugins: [nodeResolve()]
  }
];
