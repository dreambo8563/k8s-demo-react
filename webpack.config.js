process.traceDeprecation = true
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackTemplate = require("html-webpack-template")
const webpack = require("webpack")
const merge = require("webpack-merge")
// const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const OfflinePlugin = require("offline-plugin")
const parts = require("./webpack.parts")
const isProduction = process.argv.indexOf("-p") >= 0
const getConfig = require("./src/conf")

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "../", "tmp")
}
const ENVConf = getConfig(isProduction)

const common = merge([
  {
    // Entry accepts a path or an object of entries. We'll be using the latter form
    // given it's convenient with more complex configurations.
    //
    // Entries have to resolve to files! It relies on Node.js convention by default
    // so if a directory contains *index.js*, it will resolve to that.
    entry: {
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: "[name].[hash].js",
      publicPath: "/"
    },
    plugins: [
      // new OfflinePlugin({
      //   externals: ["https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff"]
      // }),
      new HtmlWebpackPlugin({
        template: "template.html",
        title: "react+mobx+ts",
        minify: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeEmptyAttributes: true
        },
        appMountId: "app", // Generate #app where to mount
        favicon: "favicon.ico",
        mobile: true, // Scale page on mobile
        inject: true // html-webpack-template requires this to work
      })
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".css"],
      mainFields: ["module", "browser", "main"],
      alias: {
        "@constants": path.resolve(__dirname, "src/app/constants"),
        "@stores": path.resolve(__dirname, "src/app/stores"),
        "@utils": path.resolve(__dirname, "src/app/utils"),
        "@containers": path.resolve(__dirname, "src/app/containers"),
        "@components": path.resolve(__dirname, "src/app/components"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@layouts": path.resolve(__dirname, "src/app/layouts")
      }
    }
  },
  parts.setENV(ENVConf),
  parts.loadTsx(),
  parts.loadImages({
    options: {
      limit: 15000
    }
  }),
  parts.loadFonts(),
  parts.extractCSS({
    use: ["css-loader?modules", parts.autoprefix()]
  })
  //   parts.loadJavaScript({ include: PATHS.app })
])

module.exports = function() {
  if (isProduction) {
    return merge([
      common,
      {
        output: {
          chunkFilename: "scripts/[chunkhash].js",
          filename: "[name].[chunkhash].js"
        },
        plugins: [
          new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.optimize.ModuleConcatenationPlugin()
        ]
      },
      parts.clean(PATHS.build),
      parts.minifyJavaScript({ useSourceMap: true }),
      parts.extractBundles({
        bundles: [
          {
            name: "vendor",
            entries: [
              "react",
              "react-router",
              "react-dom",
              "mobx",
              "mobx-react",
              "mobx-react-router",
              // "antd",
              "axios",
              "url-search-params-polyfill"
            ]
          },
          {
            name: "manifest"
          }
        ]
      }),

      parts.generateSourceMaps({ type: "hidden-source-map" }),
      // parts.loadCSS(),
      parts.minifyCSS({
        options: {
          discardComments: {
            removeAll: true
          },
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      })
    ])
  }
  return merge([
    common,
    {
      plugins: [new webpack.NamedModulesPlugin()]
    },
    parts.generateSourceMaps({ type: "cheap-module-eval-source-map" }),
    parts.devServer({
      // Customize host/port here if needed
      src: PATHS.app,
      host: process.env.HOST,
      port: process.env.PORT
    })
    // parts.extractCSS({use: 'css-loader?modules'})
    // parts.loadCSS()
  ])
}
