const state = {
  wechatList: [],
  chat_base: {
    id: 1,
    name: '聊天中',
    wxid: '',
    qq: '',
    email: '',
    type: 'friends',
    iconSrc: '',
    qrCode: '',
    signature: ''
  },
  dialogue_type: 'friends',
  dialogue: [],
  dialogue_bar: {
    menu: [{
      title: '',
      link: '',
      subMenu: [{
        title: '',
        link: ''
      }, {
        title: '',
        link: ''
      }]
    }]
  },
  chat_member: [{id: 1, iconSrc: '', name: ''}],
  chat_config: {
    chatBackground: null,
    groupNotice: '',
    isStick: false,
    newsMute: true,
    contactsSave: false,
    showGroupNickname: true
  }
}

const mutations = {
  setChatList: (state, value) => { state.wechatList = value },
  setChat (state, {
    base,
    chatDialogueModel,
    chatDialogueBarModel,
    chatMemberModel,
    chatConfigModel
  }) {
    state.dialogue_type = base.type
    state.chat_base = base
    state.dialogue = chatDialogueModel
    state.dialogue_bar = chatDialogueBarModel
    state.chat_member = chatMemberModel
    state.chat_config = chatConfigModel
  }
}

const actions = {
  getChatList ({ state, commit }, fn) {
    const list = require('../../mock/chat').default
    commit('setChatList', list)
    !!fn && fn()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
