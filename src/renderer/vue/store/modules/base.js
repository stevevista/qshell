const state = {
  indexNav: [{
    index: 0,
    path: {
      path: '/chat'
    },
    hint: { type: 'count', count: 0 },
    iconClass: 'icon-wechat',
    text: '微信'
  }],
  menuActive: { text: '', index: 0 },
  backPath: ''
}

const mutations = {
  setMenu (state, nav) {
    state.indexNav = nav
  },
  setMenuActive (state, index) {
    state.menuActive = state.indexNav[index]
  },
  setBackPath (state, path) {
    state.backPath = path
  }
}

const actions = {
  getIndexNav ({ commit }) {
    const nav = require('../../mock/index-nav').default
    commit('setMenu', nav)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
