function f (...args) {
  process.send(...args)
}

export default f
