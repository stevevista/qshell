import * as local from './local'
import * as adb from './adb'

function readdir (path, opt) {
  const options = opt || {}
  if (options.system === 'adb') {
    return adb.readdir(options.adb, options.id, path)
  } else if (options.system === 'efs') {
    return options.Q.connectionContext(options.id, (h) => {
      return options.Q.efsReadDir(h, path)
    })
  } else {
    return local.readDir(path)
  }
}

export default readdir
