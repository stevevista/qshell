const queryNvitem = (evt, comname, item) => {
  evt.$Q.connectionContext(comname, async h => {
    const len = item.size || 1
    const [iStatus, buf] = await evt.$Q.NvRead(h, item.id, len)
    console.log(iStatus, buf)
    let value = buf[0]
    if (item.type === 'hex') {
      value = buf.toString('hex')
    } else if (len <= 4) {
      value = buf.readUIntLE(0, len)
    }
    evt.sender.send('queryNvitemAck', {id: item.id, value})
  })
    .catch(err => {
      console.error(err)
    })
}

export default {
  queryNvitem
}
