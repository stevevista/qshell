import {Scheduler, XTTStructParser} from 'qia'
import {dialog} from 'electron'
import log from 'electron-log'
// import cluster from 'cluster'
import { startProcess } from '../processes'

let win
const runners = []
const procs = []

class Runner {
  constructor (id) {
    const object = new Scheduler(id)

    object.on('TEST_START', (msg) => {
      if (win) {
        win.send('xttRunMsg', 'test_start', msg)
      }
    })

    object.on('TEST_RESULT', (msg) => {
      if (win) {
        win.send('xttRunMsg', 'test_result', msg)
      }
    })

    object.on('UNIT_START', (msg) => {
      if (win) {
        msg.xttPath = object.openedXttPath()
        win.send('xttRunMsg', 'unit_start', msg)
      }
    })

    object.on('UNIT_END', (msg) => {
      if (win) {
        win.send('xttRunMsg', 'unit_end', msg)
      }
    })

    object.on('FOLDER_START', (msg) => {
      if (win) {
        win.send('xttRunMsg', 'folder_start', msg)
      }
    })

    object.on('FOLDER_END', (msg) => {
      if (win) {
        win.send('xttRunMsg', 'folder_end', msg)
      }
    })

    this.object = object
  }

  async runXTT (pathname) {
    let testTree
    try {
      if (this.object.openedXttPath() === pathname) {
        testTree = this.object.tree
      } else {
        testTree = await this.object.openXTT(pathname)
      }
      await testTree.runTree()
    } catch (e) {
      log.error(e)
    }
  }
}

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

try {
  runners.push(new Runner(0))
} catch (e) {
  log.error(e)
}

const executeXTT = (evt, optinos, counts) => {
  if (runners.length === 0) {
    evt.sender.send('xttRunError', 'not-installed')
    return
  }

  if (typeof counts !== 'number') {
    counts = 1
  }

  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{name: 'XTT file', extensions: ['xtt']}]
  }, async filePaths => {
    if (!filePaths) {
      return
    }

    win = evt.sender
    if (optinos.includes('preload')) {
      await loadStrucure(filePaths[0], evt)
    }

    if (optinos.includes('process')) {
      while (procs.length > 0) {
        procs.pop()
      }
      for (let i = 0; i < counts; i++) {
        const proc = startProcess('qspr', filePaths[0], i)
        proc.on('message', data => {
          evt.sender.send('xttRunMsg', data.type, data.msg)
        })
        procs.push(proc)
      }
    } else {
      runners[0].runXTT(filePaths[0])
      if (counts > 1) {
        for (let i = 1; i < counts; i++) {
          if (runners.length < (i + 1)) {
            runners.push(new Runner(i))
          }
          runners[i].runXTT(filePaths[0])
        }
      }
    }

    /*
    if (style === 'multiple') {
      runner.runXTT(filePaths[0])
      runner1.runXTT(filePaths[0])
    }
    */
  })
}

const stopXTT = async (evt, optinos) => {
  for (const r of runners) {
    if (r.object && r.object.tree) {
      await r.object.tree.stopTest()
      console.log('stopped')
    }
  }
}

export default {
  executeXTT,
  stopXTT
}
