import Vue from 'vue'
import Vuex from 'vuex'
import dialogues from './mock/dialogues'
import contacts from './mock/contacts'
import moments from './mock/moments'

Vue.use(Vuex)

const users = {}
let me = {}
contacts.forEach((u, i) => {
  u.displayName = u.remark || u.nickname
  users[u.wxid] = u
  if (i === 0) {
    me = u
  }
})

let totalUnread = 0
dialogues.forEach(d => {
  if (d.messages.length) {
    d.lastMessage = d.messages[d.messages.length - 1]
  } else {
    d.lastMessage = {}
  }

  if (!d.quiet && d.unread > 0) {
    totalUnread += d.unread
  }

  d.users = d.users.map(wxid => users[wxid])
  d.messages.forEach(m => {
    m.user = users[m.user]
  })
})

let lastMomentUser = {}
moments.forEach(m => {
  m.user = users[m.user]
  m.likers = m.likers.map(wxid => users[wxid])
})

if (moments.length) {
  lastMomentUser = moments[moments.length - 1].user
}

const state = {
  showHeader: true,
  tipsOpen: false,
  pageName: '微信',
  dialogues,
  totalUnread,
  users,
  me,
  moments,
  lastMomentUser
}

const mutations = {
  setShowHeader(state, status) {
    state.showHeader = status
  },
  toggleTipsStatus(state, status) {
    if (status === -1) {
      state.tipsOpen = false
    } else {
      state.tipsOpen = !state.tipsOpen
    }
  },
  setPageName(state, name) {
    state.pageName = name
  },
  toggleMsgRead(state, id) {
    for (const d of state.dialogues) {
      if (d.id === id) {
        if (!d.quiet && d.unread > 0) {
          totalUnread -= d.unread
        }
        d.unread = 0
        break
      }
    }
  }
}

const actions = {
}

const getters = {
  contactsInitialList: state => {
    const initialList = []
    for (const id in state.users) {
      const c = state.users[id]
      if (initialList.indexOf(c.initial.toUpperCase()) === -1) {
        initialList.push(c.initial.toUpperCase())
      }
    }
    return initialList.sort()
  },
  contactsList: (state, getters) => {
    const contactsList = {}
    for (const protoTypeName of getters.contactsInitialList) {
      contactsList[protoTypeName] = []
      for (const id in state.users) {
        const c = state.users[id]
        if (c.initial.toUpperCase() === protoTypeName) {
          contactsList[protoTypeName].push(c)
        }
      }
    }
    return contactsList
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
