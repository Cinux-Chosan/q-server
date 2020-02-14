const Router = require('@koa/router');
const glob = require("glob");
const path = require('path');

const router = new Router({
    prefix: '/api'
});

const files = glob.sync("!(index).js", { cwd: __dirname, nodir: true, realpath: true })

files.forEach(filePath => {
    const route = path.basename(filePath, '.js')
    const fileData = require(filePath)
    if (fileData && typeof fileData === 'object') {
        for (const [method, handler] of Object.entries(fileData)) {
            router[method](`/${route}`, handler)
        }
    }
})

module.exports = exports = router