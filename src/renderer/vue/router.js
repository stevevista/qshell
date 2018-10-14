import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '微信',
      component: require('./components/chat/chat').default
    },
    {
      path: '/chat/dialogue',
      name: '',
      components: {
        default: require('./components/chat/chat').default,
        subPage: require('./components/chat/dialogue').default
      }
    },
    {
      path: '/chat/dialogue/dialogue-detail',
      name: '',
      components: {
        subPage: require('./components/chat/dialogue-detail').default
      }
    },
    {
      path: '/chat/add-friend',
      name: '',
      components: {
        default: require('./components/chat/chat').default,
        subPage: require('./components/contact/add-friend').default
      }
    },
    {
      path: '/contact',
      name: '通讯录',
      component: require('./components/contact/contact').default
    },
    {
      path: '/contact/add-friend',
      name: '',
      components: {
        default: require('./components/contact/contact').default,
        subPage: require('./components/contact/add-friend').default
      }
    },
    {
      path: '/contact/details',
      name: '',
      components: {
        default: require('./components/contact/contact').default,
        subPage: require('./components/contact/details').default
      }
    },
    {
      path: '/contact/group-list',
      name: '',
      components: {
        default: require('./components/contact/contact').default,
        subPage: require('./components/contact/group-list').default
      }
    },
    {
      path: '/contact/tags',
      name: '新的朋友',
      components: {
        default: require('./components/contact/contact').default,
        subPage: require('./components/contact/tags').default
      }
    },
    {
      path: '/contact/new-friends',
      name: '',
      components: {
        default: require('./components/contact/contact').default,
        subPage: require('./components/contact/new-friends').default
      }
    },
    {
      path: '/contact/album',
      components: {
        subPage: require('./components/contact/album').default
      }
    },
    {
      path: '/contact/official-accounts',
      components: {
        subPage: require('./components/contact/official-accounts').default
      }
    },
    {
      path: '/explore',
      name: '发现',
      component: require('./components/explore/explore').default
    },
    {
      path: '/explore/moments',
      name: '朋友圈',
      components: {
        default: require('./components/explore/explore').default,
        subPage: require('./components/explore/moments').default
      }
    },
    {
      path: '/self',
      name: '我',
      component: require('./components/self/self').default
    },
    {
      path: '/self/profile',
      components: { 
        default: require('./components/self/self').default,
        subPage: require('./components/self/profile').default
      }
    },
    {
      path: '/self/settings',
      components: { 
        default: require('./components/self/self').default,
        subPage: require('./components/self/settings').default
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
