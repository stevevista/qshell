import {Scheduler} from 'qia'

class Runner {
  constructor () {
    const object = new Scheduler()

    object.on('TEST_START', (msg) => {
      process.send({type: 'run-result', runType: 'test_start', msg})
    })

    object.on('TEST_RESULT', (msg) => {
      process.send({type: 'run-result', runType: 'test_result', msg})
    })

    object.on('UNIT_START', (msg) => {
      msg.xttPath = object.openedXttPath()
      process.send({type: 'run-result', runType: 'unit_start', msg})
    })

    object.on('UNIT_END', (msg) => {
      process.send({type: 'run-result', runType: 'unit_end', msg})
    })

    object.on('FOLDER_START', (msg) => {
      process.send({type: 'run-result', runType: 'folder_start', msg})
    })

    object.on('FOLDER_END', (msg) => {
      process.send({type: 'run-result', runType: 'folder_end', msg})
    })

    this.object = object
  }

  async runXTT (pathname) {
    let testTree
    if (this.object.openedXttPath() === pathname) {
      testTree = this.object.tree
    } else {
      testTree = await this.object.openXTT(pathname)
    }
    testTree.runTree()
  }
}

async function start (xttPath) {
  try {
    const runner = new Runner()
    process.on('message', data => {
      if (data.type === 'stop') {
        runner.object.tree.stopTest()
      } else if (data.type === 'exit') {
        process.send({type: 'run-result', runType: 'unit_end', msg: {}})
        process.exit(1)
      }
    })
    await runner.runXTT(xttPath)
  } catch (e) {
    process.send({type: 'error', error: e})
  } finally {
    process.removeAllListeners('message')
  }
}

export default start
