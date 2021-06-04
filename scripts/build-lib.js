'use strict'
const shell = require('shelljs')

shell.rm('-rf', 'lib', 'lib-temp')
shell.exec('yarn run tsc -p tsconfig.build.json')
shell.mv('./lib-temp/lib.js', './lib-temp/index.js')
shell.exec('yarn run cross-env NODE_ENV=lib babel lib-temp --out-dir lib --source-maps')
shell.rm('-rf', 'lib-temp')
