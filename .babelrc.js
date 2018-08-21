module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: "last 2 versions",
          node: "8"
        },
        loose: true,
        modules: process.env.NODE_ENV === "test" ? undefined : false
      }
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-flow-comments"
  ]
};
