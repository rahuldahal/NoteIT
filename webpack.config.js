const currentTask = process.env.npm_lifecycle_event;

const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ClosurePlugin = require("closure-webpack-plugin");
const Dotenv = require("dotenv-webpack");

let cssConfig = {
  test: /\.(sa|sc|c)ss$/i,
  use: ["css-loader?url=false", "sass-loader"],
};

let babelConfig = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader",
};

let svgLoader = {
  test: /\.svg$/i,
  use: "@svgr/webpack",
};

let config = {
  entry: "./frontend/App.js",
  module: {
    rules: [svgLoader, babelConfig, cssConfig],
  },
  plugins: [new Dotenv()],
  resolve: {
    alias: {
      "@svgs": path.resolve(__dirname, "./frontend/assets/svgs"),
      "@utils": path.resolve(__dirname, "./frontend/utils"),
      "@components": path.resolve(__dirname, "./frontend/Components"),
      "@screens": path.resolve(__dirname, "./frontend/Screens"),
      "@contexts": path.resolve(__dirname, "./frontend/Contexts"),
    },
  },
};

//separate for "development"
if (currentTask === "dev" || currentTask === "frontend") {
  cssConfig.use.unshift("style-loader");
  config.mode = "development";
  config.devtool = "inline-source-map";
  config.devServer = {
    port: 5000,
    contentBase: path.resolve(__dirname, "/build"),
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/api": "http://127.0.0.1:3000",
      "/auth": "http://127.0.0.1:3000",
      "/users": "http://127.0.0.1:3000",
      "/notes": "http://127.0.0.1:3000",
      "/contributors": "http://127.0.0.1:3000",
      "/admin": "http://127.0.0.1:3000",
    },
  };
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "./frontend/index.ejs",
    })
  );
  config.output = {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "./build"),
  };
}

//separate for "production"
if (currentTask === "build" || currentTask === "check-build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.mode = "production";
  config.output = {
    filename: "./static/[name].js",
    chunkFilename: "./static/[name].js",
    path: path.resolve(__dirname, "./build"),
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
  };
  config.plugins.push(
    new webpack.EnvironmentPlugin({
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    }),
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "./frontend/index.ejs",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./static/styles.css",
    })
  );
}

module.exports = config;
