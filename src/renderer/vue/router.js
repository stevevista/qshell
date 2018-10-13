import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import personInfo from './views/contact/person-info'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: require('./views/chat').default
    },
    {
      path: '/chat/dialogue',
      name: 'dialogue',
      component: require('./views/chat/dialogue').default,
      children: [
        {
          path: 'chat-detail',
          name: 'chat-detail',
          component: require('./views/chat/chat-detail').default,
          children: [
            {
              path: 'person-info',
              name: 'person-info',
              component: personInfo
            }
          ]
        }
      ]
    },
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.afterEach(function (to, from) {
  const toPath = to.path
  const toPathEnd = toPath.lastIndexOf('/')
  const backPath = toPath.slice(0, toPathEnd)
  store.commit('base/setBackPath', backPath)
})

export default router
