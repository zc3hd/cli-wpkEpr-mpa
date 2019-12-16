// 配置
var conf = {
  // 前端测试模式下的端口
  dev_port: 1010,

  // 本地后台1011 打包后/测试时 被代理的端口
  api_port: 1011,
};


// 需求：
// 1.指定需要测试业务模块地址：
var one = {
  path: './src_webapp/main/',


  // ****约定：该模块下，dev引用和build的输出 目录名称：
  imgs_dir: 'imgs',
  fonts_dir: 'fonts',
  // 异步文件的标识 async
};


// 配置项
var opts = {
  // dev模式下，源文件夹名称；
  src: "src_webapp",

  // 依赖文件的目录名称，需要复制
  copy: "scripts",

  // 打包的目录名称
  dist: 'webapp',
};



// --------------------------------------------------------------------
var path = require('path');
var webpack = require('webpack');
//  寻找HTML模板
var HtmlWebpackPlugin = require('html-webpack-plugin');
//  清除目录下的
var CleanPlugin = require('clean-webpack-plugin');









var dev = {
  // JS 源文件地址
  entry: path.resolve(__dirname, one.path, "index.js"),
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, one.path, "index.html"), // 模版文件
    }),
  ],
  devServer: {
    port: conf.dev_port,
    contentBase: path.resolve(__dirname, opts.src),
    historyApiFallback: true, // 静态资源目录
    hot: false,
    inline: true, // cli 模式，内联模式
    noInfo: true,
    proxy: {
      "/api": 'http://localhost:' + conf.api_port,
    }
  },
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // exclude: /(node_modules|async)/,
        exclude: /async/,
        query: {
          babelrc: false,
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      //
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      // fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
      },
      // img
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
      }
    ]
  },
  devtool: '#source-map',
};




var build = {
  // JS 源文件地址
  entry: path.resolve(__dirname, one.path, "index.js"),
  // 
  output: {
    // 页面模块 打包输出的根目录
    path: path.resolve(__dirname, one.path.replace(opts.src, opts.dist)),

    // index.js 输出名称
    filename: 'index.[hash:7].js',

    // 给require.ensure异步加载文件 输出名称
    chunkFilename: '[name].[hash:7].js',

    // 4. HTML内引用 的前缀设置，慎用！
    // publicPath: '/dist/', 
  },
  plugins: [
    // ------------------------------------HTML
    new HtmlWebpackPlugin({
      // HTML 源文件地址
      template: path.resolve(__dirname, one.path, "index.html"),
      // HTML 输出名字，
      filename: 'index.html',
    }),


    // -------------------------------------JS 压缩
    // uglifyJsPlugin 用来对js文件进行压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      // 压缩的JS文件，不开启sourceMap
      sourceMap: false,
      // 异步文件不压缩
      exclude: /async/
    }),
    // -------------------------------------清除
    // 清除 文件和文件夹
    new CleanPlugin(["**/*"], {
      // 输出 目录下
      root: path.resolve(__dirname, one.path.replace(opts.src, opts.dist)),
      verbose: true,
      dry: false,
    }),

  ],
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        // exclude: /(node_modules|async)/,
        exclude: /async/,
        query: {
          babelrc: false,
          presets: ['es2015']
        }
      },
      // 
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      //
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      // ------------------------------------
      // fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 32 * 1024,
          // 一样这个。
          name: `${one.fonts_dir}/[name].[hash:7].[ext]`
        }
      },
      // img
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 32 * 1024,
          // 一样这个。
          name: `${one.imgs_dir}/[name].[hash:7].[ext]`
        }
      }
    ]
  },
  // 所有文件不开启 sourceMap
  // devtool: '#source-map',  
};


// build
if (process.env.NODE_ENV == 'production') {
  module.exports = build;
}
// dev
else {
  module.exports = dev;
}