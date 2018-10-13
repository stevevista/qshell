const checkUserAuth = (evt) => {
  evt.sender.send('userAuthResult', {
    success: true
  })
}

const userAuth = (evt, prop) => {
  if (prop.username !== 'steve') {
    evt.sender.send('userAuthResult', {
      success: false,
      message: 'fail!'
    })
  } else {
    evt.sender.send('userAuthResult', {
      success: true
    })
  }
}

export default {
  checkUserAuth,
  userAuth
}
