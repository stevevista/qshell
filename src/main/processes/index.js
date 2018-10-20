import { fork } from 'child_process'

function captureProcessRequest () {
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '--process') {
      if (i + 1 < process.argv.length) {
        const name = process.argv[i + 1]
        const args = process.argv.slice(i + 2)
        require(`./${name}`).default(...args)
        return true
      }
    }
  }
  return false
}

function startProcess (name, ...args) {
  const proc = fork('.', ['--process', name].concat(args))
  return proc
}

export {
  captureProcessRequest,
  startProcess
}
