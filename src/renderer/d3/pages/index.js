const pages = []

const files = require.context('.', false, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') return
  const name = key.replace(/(\.\/|\.js)/g, '')
  pages.push(name)
})

export default pages
