import fs from 'fs'

async function pull (path, opt) {
  const options = opt || {}
  if (options.system === 'adb') {
    return options.adb.pull(options.id, path)
  } else if (options.system === 'efs') {
    // const chunk = await Q.efsRead(h, path)
    return options.Q.createReadStream(options.id, path)
  } else {
    return fs.createReadStream(path)
  }
}

export default pull
