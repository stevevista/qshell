<template>
  <div class="_full_inner _scroll _effect component-chat" :class="{'_effect--30':decline}">
    <search-bar></search-bar>
    <ul class="wechat-list">
      <li class="item _line-fine" v-for="(item, index) in wechatList" transition="chat-item">
        <v-touch
          @touchstart="info_touchstart(index)"
          @tap="info_tap(index)"
          @swipeleft="info_swipeleft(index)"
          :swipe-options="{ direction: 'horizontal' }">
          <div class="info" :class="{'current': currentIndex === index}">
            <div class="ico-box">
              <i :class="item.chatConfigModel | f_news('nclass')"
                v-text="$options.filters.f_news(item.chatBaseModel, 'ntext')"
                v-show="$options.filters.f_news(item.chatBaseModel, 'nshow')"></i>
              <div class="ico">
                <img :src="item.base.iconSrc" alt="pic">
              </div>
            </div>
            <div class="desc">
              <div class="desc-time" v-text="$options.filters.fmtDate(item.chatBaseModel.endTimeStr, 'hh:ss')"></div>
              <div class="desc-title" v-text="item.base.name"></div>
              <div class="desc-message">
                <div class="desc-mute iconfont icon-mute" :title="item.chatConfigModel.newsMute" v-show="item.chatConfigModel.newsMute"></div>
                <span :title="item.base.type" v-show="item.base.type==='friends'" v-text="item.chatBaseModel.endChatAuth+':'"></span>
                <span v-text="item.chatBaseModel.endChatTxt"></span>
              </div>
            </div>
          </div>
        </v-touch>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import searchBar from '../components/search-bar.vue'
import store from '../store'

export default {
  components: {
    searchBar
  },
  beforeRouteEnter (to, from, next) {
    store.commit('base/setMenuActive', 0)
    next()
  },
  data () {
    return {
      decline: false,
      currentIndex: -1,
      isTouchSwipe: false
    }
  },
  computed: {
    ...mapState('chat', ['wechatList'])
  },
  filters: {
    f_news (obj, attr) {
      obj = obj || {}
      let newsClass = obj.newsMute ? '_news-dot' : '_news-count'
      let newsText = !obj.newsMute ? obj.newsUnreadCount : ''
      let newsShow = (obj.newsUnreadCount > 0)
      let o = {
        nclass: newsClass,
        ntext: newsText,
        nshow: newsShow
      }
      return o[attr]
    },
    fmtDate (_date, fmt) {
      const date = new Date(_date)
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  },
  methods: {
    ...mapActions('chat', [ 'getChatList' ]),
    ...mapMutations('chat', [ 'setChat' ]),
    ...mapMutations('base', [ 'setMenuActive' ]),
    info_touchstart (_index) {
      this.currentIndex = -1
    },
    info_tap (_index) {
      const index = _index
      if (index >= 0 && !this.isTouchSwipe) {
        this.setChat(this.wechatList[index])
        this.$router.push({
          path: '/chat/dialogue'
        })
      }
      this.isTouchSwipe = false
    },
    info_swipeleft (_index) {
      console.log('swipe')
    }
  },
  created () {
    this.getChatList(() => {
      console.log('done')
    })
  }
}
</script>
