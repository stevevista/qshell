async function readdir (client, serial, path) {
  const regpath = path.replace(new RegExp('[/]*$'), '')
  const files = await client.readdir(serial, path)

  let items = []
  for (let file of files) {
    const isDir = file.isDirectory()
    const isLink = file.isSymbolicLink()
    let type = 'file'
    if (isDir) {
      type = 'dir'
    } else if (file.isBlockDevice()) {
      type = 'block'
    } else if (file.isFile()) {
      type = 'file'
    }

    items.push({
      name: file.name,
      mode: file.mode,
      path: regpath + '/' + file.name,
      size: file.size,
      mtime: file.mtime,
      isDir,
      isLink,
      type
    })
  }

  return items
}

function syncService (client, serial, job) {
  return client.syncService(serial)
    .then(sync => {
      return job(sync)['finally'](() => {
        return sync.end()
      })
    })
}

export {
  readdir,
  syncService
}
