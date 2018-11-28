import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import visualizer from 'rollup-plugin-visualizer';

const { VERSION, DEPENDENCIES } = require('./globals.js');

const configurator = (file, format, plugins, externals = {}) => ({
  input: 'src/index.js',
  output: {
    name: 'GeoJsonTrack',
    format,
    file,
    globals: externals,
    intro: `const VERSION = ${VERSION};\nconst DEPENDENCIES = ${DEPENDENCIES};`
  },
  plugins,
  external: Object.keys(externals)
});

const devConfig = configurator('dist/higlass-geojson.js', 'umd', [
  resolve(),
  commonjs({ sourceMap: false }),
  buble(),
  filesize(),
  visualizer()
]);

const prodConfig = configurator('dist/higlass-geojson.min.js', 'umd', [
  resolve(),
  commonjs({ sourceMap: false }),
  buble(),
  terser()
]);

const noD3DevConfig = configurator(
  'dist/higlass-geojson.no-d3.js',
  'umd',
  [
    resolve(),
    commonjs({ sourceMap: false }),
    buble(),
    filesize(),
    visualizer()
  ],
  { 'd3-geo': 'd3' }
);

const noD3ProdConfig = configurator(
  'dist/higlass-geojson.no-d3.min.js',
  'umd',
  [resolve(), commonjs({ sourceMap: false }), buble(), terser()],
  { 'd3-geo': 'd3' }
);

export default [devConfig, prodConfig, noD3DevConfig, noD3ProdConfig];
