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
        modules:
          process.env.NODE_ENV === "test" || process.env.NODE_ENV === "build"
            ? undefined
            : false
      }
    ]
  ],
  plugins: ["@babel/plugin-transform-flow-comments"]
};
