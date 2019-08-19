'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

var apps = ["login", "admin", "saas","agent","adv","tool"];
// var apps = ["login", "admin"];

exports.getEntry = function () {
  var obj = {};
  apps.forEach(function (item) {
    obj[item] = './src/' + item + '/main.js';
  })
  return obj;
}

exports.getAlias = function () {
  var obj = {
    'vue$': 'vue/dist/vue.esm.js',
    '@': path.join(__dirname, '../src'),
  }

  apps.forEach(function (item) {
    obj[item + "@"] = path.join(__dirname, '../src', item);
  })
  return obj;
}

exports.getHtml = function (type) {
  var arr = [];

  apps.forEach(function (item) {
    if (type == "dev") {
      arr.push(new HtmlWebpackPlugin({
        filename: (item == "login" ? "index" : item) + '.html',
        template: path.resolve(__dirname, "..", 'src/' + item + '/index.html'),
        chunks: [item],
        title: '投放端',
        inject: true
      }))
    } else {
      arr.push(new HtmlWebpackPlugin({
        filename: (item == "login" ? "index" : item) + '.html',
        template: path.resolve(__dirname, "..", 'src/' + item + '/index.html'),
        inject: true,
        chunks: ['manifest', 'vendor', item],
        title: '投放端',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      }))
    }
  })
  return arr;
}
