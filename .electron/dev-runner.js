'use strict'

process.env.NODE_ENV = 'development'

const path = require('path')
const chalk = require('chalk')
const { spawn } = require('child_process')
const electron = require('electron')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const rendererConfig = require('./webpack.renderer.config')
const mainConfig = require('./webpack.main.config')

let electronProcess = null
let manualRestart = false
let hotMiddleware

function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    function Compilation () {
    }

    Compilation.prototype.apply = function (compiler) {
      compiler.hooks.compilation.tap('Compilation', (compilation) => {
        console.log('The compiler is starting a new compilation...');
    
        compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
          'Compilation',
          (data, cb) => {
            hotMiddleware.publish({ action: 'reload' })
            cb(null, data)
          }
        )
      })
    }

    for (const k in rendererConfig.entry) {
      rendererConfig.entry[k] = [path.join(__dirname, 'dev-client')].concat(rendererConfig.entry[k])
    }

    rendererConfig.plugins.push(new Compilation())

    const compiler = webpack(rendererConfig)
    hotMiddleware = webpackHotMiddleware(compiler, { 
      log: false, 
      heartbeat: 2500 
    })

    compiler.plugin('done', stats => {
      logStats('Renderer', stats)
    })

    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: true,
        before (app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        }
      }
    )

    server.listen(9080)
  })
}

function startMain () {
  return new Promise((resolve, reject) => {
    mainConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js')].concat(mainConfig.entry.main)

    const compiler = webpack(mainConfig)

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'))
      hotMiddleware.publish({ action: 'compiling' })
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      logStats('Main', stats)

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }

      resolve()
    })
  })
}

function startElectron () {
  electronProcess = spawn(electron, ['--inspect=5858', '.'])

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'greenBright')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'redBright')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    process.stdout.write(
      chalk[color](log)
    )
  }
}

function init () {
  Promise.all([startRenderer(), startMain()])
    .then(() => {
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()
