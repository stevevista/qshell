import {Scheduler} from 'qia'
import log from 'electron-log'

class Runner {
  constructor (id) {
    const object = new Scheduler(id)

    object.on('TEST_START', (msg) => {
      process.send({type: 'test_start', msg})
    })

    object.on('TEST_RESULT', (msg) => {
      process.send({type: 'test_result', msg})
    })

    object.on('UNIT_START', (msg) => {
      msg.xttPath = object.openedXttPath()
      process.send({type: 'unit_start', msg})
    })

    object.on('UNIT_END', (msg) => {
      process.send({type: 'unit_end', msg})
    })

    object.on('FOLDER_START', (msg) => {
      process.send({type: 'folder_start', msg})
    })

    object.on('FOLDER_END', (msg) => {
      process.send({type: 'folder_end', msg})
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

async function start (args) {
  const [pathname, id] = args
  try {
    let runner = new Runner(parseInt(id))
    await runner.runXTT(pathname)
  } catch (e) {
    log.error(e)
  }
}

export default start
