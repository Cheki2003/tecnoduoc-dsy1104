// configuracion de karma: corre los archivos .spec en chrome usando jasmine
// usamos webpack solo para las pruebas, porque karma no sabe leer jsx por si solo

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "webpack"],

    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-chrome-launcher",
      "karma-coverage",
      "karma-spec-reporter",
      "karma-jasmine-html-reporter",
    ],

    files: [
      { pattern: "src/tests/**/*.spec.js*", watched: false },
      // la imagen de reemplazo, para que no salga un 404 en las pruebas
      { pattern: "public/img/*", watched: false, included: false },
    ],

    proxies: { "/img/": "/base/public/img/" },

    preprocessors: {
      "src/tests/**/*.spec.js*": ["webpack"],
    },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            // asi webpack no exige escribir la extension en cada import
            type: "javascript/auto",
            resolve: { fullySpecified: false },
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                // istanbul marca el codigo para poder medir la cobertura
                plugins: [
                  ["istanbul", { exclude: ["src/tests/**", "src/main.jsx"] }],
                ],
              },
            },
          },
        ],
      },
    },

    reporters: ["spec", "kjhtml", "coverage"],

    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "json-summary", subdir: ".", file: "resumen.json" },
        { type: "json", subdir: ".", file: "detalle.json" },
        { type: "text-summary" },
      ],
    },

    browsers: ["ChromeHeadless"],
    client: { clearContext: false },
    restartOnFileChange: true,
  });
};
