const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: '/shuhelper/',
    pwa: {
        name: "SHUHelper",
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
            globDirectory: 'dist/',
            globPatterns: [
                '**/*.{html,json,js,css,ttf,woff,woff2,png}'
            ],
            importWorkboxFrom: 'local',
        }
    },
    transpileDependencies: [
        "vuetify",
        'vuex-module-decorators'
    ],
    configureWebpack: {
        plugins: [
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
};
