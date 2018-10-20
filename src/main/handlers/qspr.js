import {XTTStructParser} from 'qia'
import log from 'electron-log'
import { startProcess } from '../processes'

const procs = {}

function loadStrucure (pathname, evt) {
  return new Promise((resolve, reject) => {
    const parser = new XTTStructParser()
    parser.on('folder', props => {
      evt.sender.send('xttParseFolder', props)
    })

    parser.on('closefolder', () => {
      evt.sender.send('xttParseFolderClose')
    })

    parser.on('test', (props) => {
      evt.sender.send('xttParseTest', props)
    })

    parser.on('rootname', (name) => {
      evt.sender.send('xttParseRootName', name)
    })

    parser.on('end', () => {
      resolve()
    })

    parser.on('error', (err) => {
      reject(err)
    })

    evt.sender.send('xttParseStart', pathname)
    parser.parse(pathname)
  })
}

const executeXTT = async (evt, xttPath, counts) => {
  if (typeof counts !== 'number') {
    counts = 1
  }

  await loadStrucure(xttPath, evt)

  for (let i = 0; i < counts; i++) {
    const proc = startProcess('qspr', xttPath)
    proc.on('message', data => {
      if (data.type === 'run-result') {
        evt.sender.send('xttRunMsg', i, data.runType, data.msg)
      } else if (data.type === 'error') {
        log.error(i, data.error)
      }
    })
    proc.on('exit', () => {
      console.log('qia exit')
      if (procs[i] === proc) {
        delete procs[i]
      }
    })
    procs[i] = proc
  }
}

const stopXTT = async (evt, optinos) => {
  for (const k in procs) {
    procs[k].send({type: 'stop'})
  }
  setTimeout(() => {
    for (const k in procs) {
      procs[k].send({type: 'exit'})
    }
  }, 3000)
}

export default {
  executeXTT,
  stopXTT
}
