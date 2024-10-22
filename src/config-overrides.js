const devConfig = require("./dev.config");
const dotenv = require("dotenv");
const fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const relpath = path.join.bind(path, __dirname)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const THEME_DIR = `${process.env.THEME_PAGES || 'AquaBlue'}`
const ASSET_PATH = dotenv.config().parsed.REACT_APP_ASSET_PREFIX || '/';

const xmpieBuild = fs.existsSync(relpath('..', 'config.json'))
const themeConfig = require(xmpieBuild ? relpath('..', 'config.json') : relpath('src', THEME_DIR, 'config.json'))

const argv = (str) => {
  const idx = process.argv.findIndex((a) => a.startsWith(str))
  if (idx > -1) {
    return process.argv[idx].substring(str.length + 1)
  }
  return null
}

process.env.REACT_APP_USTORE_REMOTE_SERVER_URL = argv('server')?.startsWith('https://') ?  argv('server') : ''

module.exports = function overrides(config, env) {
  config.resolve.alias = Object.entries(devConfig).filter(([key, value]) => key.startsWith('$')).reduce((r, [key, value]) => ({...r, [key]:  value}), {})
  config.externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  if (process.env.NODE_ENV === "production") {
    config.output = {
      ...config.output,
      publicPath: `${ASSET_PATH}${ASSET_PATH.endsWith('/') ? '' : '/'}`,
      clean: true
    }
  }
  config.plugins.shift()
  config.plugins.push(
      new CopyPlugin({
        patterns: [
          { from: "src/ustore-internal/static", to: "static-internal" },
        ],
      }),
      new HtmlWebpackPlugin({
        buildVersion: themeConfig.uStoreVersion || Date.now(),
        template: path.resolve(__dirname, './public/index.html')
      })
  )
  config.module = config.module || {}
  config.module.rules = config.module.rules || []
  config.module.rules[1].oneOf.push(
      {
        test: /static\/images.*\.(png|gif|jpg|jpeg|eot|otf|woff|woff2|ttf|svg)?$/,
        use: ['file-loader'],
        exclude: /bootstrap|assets/
      },
      {
        test: /assets.*\.(png|gif|jpg|jpeg|svg|pdf)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: (file) => `[name].[ext]`,
            publicPath: `${config.assetPrefix}/assets/images`
          }
        }],
        exclude: /bootstrap|static/
      },
      {
        test: /assets.*\.(woff|woff2|ttf)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: (file) => `[name].[ext]`,
            publicPath: `${config.assetPrefix}/assets/fonts`
          }
        }],
        exclude: /bootstrap|static/
      },
      {
        test: /assets.*\.(eot|otf|woff|woff2|ttf)?$/,
        use: [{
          loader: 'url-loader'
        }],
        exclude: /bootstrap|static/
      },
      {
        test: /fonts\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      },
  );

  const svgRule = config.module.rules[1].oneOf.filter(rule => rule.test && rule.test.source && rule.test.source.endsWith('.svg$'))[0]
  if (svgRule) {
    delete svgRule.issuer
  }

  config.module.rules.push({
      test: /.(ttf|woff|woff2)(\?\S*)?$/,
      type: 'asset/inline'
    }, {
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: "sass-loader",
          options: {
            sassOptions: {
              includePaths: devConfig.includeCssPaths
            }
          }
        }
      ]
    }
  )
  config.devServer = {
    ...config.devServer,
    hotOnly: true,
  }
  return config
}
