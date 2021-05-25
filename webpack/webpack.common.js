const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin').GitRevisionPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDevelopment = process.env.NODE_ENV === 'development';
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true }); // 'rev-parse HEAD' is default command to find latest commit

console.log("Commit Hash for this build: ", gitRevisionPlugin.commithash());
console.log("Branch for this build: ", gitRevisionPlugin.branch());
console.log("GA_TRACKING_ID", process.env.GA_TRACKING_ID);

module.exports = {
    context: path.resolve(__dirname, "../src"),
    entry: [
        'core-js/modules/es.promise',
        'core-js/modules/es.array.iterator',
        'react-hot-loader/patch',
        path.resolve(__dirname, '../src/index.js')
    ],
    target: ['web', 'es5'],
    output: {
        // https://webpack.js.org/guides/caching/
        publicPath: "/",
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "../public")
    },
    resolve: {
        alias: {
            // https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom to support hot loading. Safe in production.
            'react-dom': '@hot-loader/react-dom',
        },
        extensions: [".js", ".jsx"],
        modules: [
            "node_modules",
            path.resolve(__dirname, "../src/_scss"),
            path.resolve(__dirname, "../src/js"),
            path.resolve(__dirname, "../src/img"),
            path.resolve(__dirname, "../src/fonts"),
            path.resolve(__dirname, "../src/data"),
            path.resolve(__dirname, "../src/graphics"),
            path.resolve(__dirname, "../src")
        ],
        fallback: {
            buffer: require.resolve('buffer'),
            stream: require.resolve('stream-browserify')
        }
    },
    optimization: {
        moduleIds: 'deterministic'
    },
    module: {
        noParse: /(mapbox-gl)\.js$/,
        rules: [
            {
                test: /\.js$|jsx$/,
                exclude: /node_modules\.*/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: isDevelopment
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                include: /\.(eot|ttf|woff|woff2|png|svg|ico|gif|jpg|pdf|webp)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
            {
                test: /\.(json)$/,
                type: 'javascript/auto',
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new MomentLocalesPlugin(),
        new CleanWebpackPlugin(["public"], {
            root: path.resolve(__dirname, "../")
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src/index.ejs"),
            chunksSortMode: "none",
            templateParameters: {
                GA_TRACKING_ID: process.env.GA_TRACKING_ID || '',
                USE_GTM: (
                    process.env.ENV === 'dev' ||
                    process.env.ENV === 'qat' ||
                    process.env.ENV === 'sandbox'
                ),
                GTM_ID: process.env.GTM_ID || ''
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '*.xml',
                    to: path.resolve(__dirname, "../public"),
                    context: path.resolve(__dirname, '../'),
                    noErrorOnMissing: true
                },
                {
                    from: 'robots.txt',
                    to: path.resolve(__dirname, "../public"),
                    context: path.resolve(__dirname, '../'),
                    noErrorOnMissing: true
                },
                {
                    from: 'redirect-config.json',
                    to: path.resolve(__dirname, "../public"),
                    context: path.resolve(__dirname, '../'),
                    noErrorOnMissing: true
                }
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                ENV: process.env.ENV
                    ? JSON.stringify(process.env.ENV)
                    : JSON.stringify('dev')
            }
        }),
        new BundleAnalyzer()
    ]
};
