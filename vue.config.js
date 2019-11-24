const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
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
    }
};
