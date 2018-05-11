import babel from 'rollup-plugin-babel'

export default {
  input: `src/index.js`,
  output: {
    name: `ReactInCenter`,
    file: `lib/bundle.umd.js`,
    format: `umd`,
    globals: {
      react: `React`,
    },
    sourcemap: true,
    exports: `named`,
  },
  external: [`react`],
  onwarn,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}

function onwarn(message) {
  const suppressed = [`UNRESOLVED_IMPORT`, `THIS_IS_UNDEFINED`]

  if (!suppressed.find(code => message.code === code)) {
    // eslint-disable-next-line no-console
    return console.warn(message.message)
  }
}
