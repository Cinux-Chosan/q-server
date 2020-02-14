const path = require('path')

module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:8888',
            },
            '^/download': {
                target: 'http://localhost:8888'
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@utils': path.join(__dirname, 'src/utils/'),
                '@req': path.join(__dirname, 'src/utils/request'),
            }
        }
    }
}