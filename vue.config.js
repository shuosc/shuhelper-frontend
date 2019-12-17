const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
module.exports = {
    publicPath: '/shuhelper/',
    pwa: {
        name: "SHUHelper",
        workboxOptions: {
            importWorkboxFrom: 'local'
        }
    },
    transpileDependencies: [
        "vuetify",
        'vuex-module-decorators'
    ],
    configureWebpack: {
        plugins: [
            new SWPrecacheWebpackPlugin({
                cacheId: 'my-vue-app',
                filename: 'service-worker.js',
                staticFileGlobs: ['dist/**/*.{js,html,css}'],
                minify: true,
                stripPrefix: 'dist/',
                runtimeCaching: [
                    {
                        urlPattern: /^http(s?):\/\/*\/*/,
                        handler: 'cacheFirst'
                    },
                ]
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: process.env.npm_config_report === 'true' ? 'server' : 'disabled',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8888,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: false,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            })
        ]
    },
    chainWebpack: config => {
        config.resolve.symlinks(true);
        config.plugin('preload').tap(options => {
            options[0] = {
                rel: 'preload',
                as(entry) {
                    if (/\.css$/.test(entry)) return 'style';
                    if (/\.(woff||ttf)$/.test(entry)) return 'font';
                    if (/\.png$/.test(entry)) return 'image';
                    return 'script';
                },
                include: 'allAssets',
                fileBlacklist: [/\.map$/, /hot-update\.js$/],
            };
            return options
        });
        config.plugin('workbox').tap((workbox) => {

        });
        return config
    },
};
