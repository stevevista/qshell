import fs from 'fs'
import path from 'path'

function statFile (name, lpath) {
  return new Promise((resolve, reject) => {
    const unixpath = lpath.replace(/\\/g, '/')
    fs.lstat(lpath, (err, stats) => {
      if (err) {
        resolve({
          name,
          mode: 0,
          path: unixpath,
          size: 0,
          mtime: Date.now(),
          isDir: false,
          isLink: false,
          type: 'eaccess'
        })
      } else {
        const isLink = stats.isSymbolicLink()

        const resolving = (stats) => {
          let type = ''
          const isDir = stats.isDirectory()
          if (isDir) {
            type = 'dir'
          } else if (stats.isFile()) {
            type = 'file'
          } else if (stats.isBlockDevice()) {
            type = 'block'
          } else if (stats.isCharacterDevice()) {
            type = 'character'
          } else if (stats.isFIFO()) {
            type = 'fifo'
          } else if (stats.isSocket()) {
            type = 'socket'
          }

          resolve({
            name,
            mode: stats.mode,
            path: unixpath,
            size: stats.size,
            mtime: stats.mtime,
            isDir,
            isLink,
            type
          })
        }

        if (isLink) {
          fs.stat(lpath, (err, newStats) => {
            if (err) {
              resolving(stats)
            } else {
              resolving(newStats)
            }
          })
        } else {
          resolving(stats)
        }
      }
    })
  })
}

function readDir (dirpath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if (err) {
        reject(err)
        return
      }

      let tasks = []
      for (let file of files) {
        const filepath = path.join(dirpath, file)
        tasks.push(statFile(file, filepath))
      }

      Promise.all(tasks)
        .then(statses => {
          resolve(statses)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
}

/*
listDir({ path: '/dev', isDir: true, name: 'dev' }, '/xxx', { count: 0, maxItems: 1000 })
  .then(items => {
    for (let item of items) {
      console.log(item._dest)
    }
    console.log(items.length)
  })
  .catch(err => {
    console.log(err)
  })
*/
export {
  readDir
}
