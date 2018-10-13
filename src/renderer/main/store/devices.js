export default {
  state: {
    deviceList: []
  },
  reducers: {
    updateDevices (state, action) {
      return {...state, deviceList: action.devices}
    }
  }
}
