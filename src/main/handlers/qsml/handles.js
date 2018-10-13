const switchQPST = (evt, onoff) => {
  evt.$Q.setLibraryMode(onoff ? 1 : 0)
}

export default {
  switchQPST
}
