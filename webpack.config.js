const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");

// console.log("DIRNAME", __dirname); // глобальная переменная, содержащая абсолютный путь к файлу
const loadModeConfig = (env) =>
  require(`./build-utils/${env.mode}.config`)(env);
// экспорт объекта настроек
module.exports = (env) =>
  merge(
    {
      mode: env.mode,
      context: path.resolve(__dirname, "src"),
      // 1. точка входа - откуда строить дерево зависимостей
      entry: "./index.js",
      // 2. куда положить результирующий бандл
      output: {
        path: path.resolve(__dirname, "dist"),//або bild папка 
        filename: "[name].bundle.js",
      },
      // 3. загрузчики (loaders)
      module: {
        rules: [
          {
            test: /\.js$/, // регулярное выражение імя розширення яке обробляється
            exclude: /node_modules/, // через указ папку свойства не прогонять, не враховувати
            use: ["babel-loader"], //для використання, треба npm i 
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/,//$ каже що неможе бути більше знаків після останнього
            use: [
              {
                loader: "url-loader",
                options: {
                  name: "[path]/[name].[ext]",
                  limit: 6000, //масимальний розмір файлу або false - безлімітний
                },
              },
            ],
          },
          {
            test: /\.html$/,
            use: ["html-loader"],
          },
          {
            test: /\.hbs$/,
            use: ["handlebars-loader"],
          },
        ],
        // плагины применяются к результирующему бандлу
      },
      plugins: [
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new WebpackBar(),
      ],
    },
    loadModeConfig(env)
  );