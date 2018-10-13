const state = {
  personInfo: {
    base: {}
  },
  contactFriends: []
}

const mutations = {
  setPersonInfo (state, infoObj) {
    state.personInfo = infoObj
  }
}

const actions = {
  getPersonInfo ({ commit }, id, fn) {
    const infoObj = require('../../mock/person-info-' + id).default
    commit('setPersonInfo', infoObj)
    !!fn && fn()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
