<template>
  <div class="_cover-top">
    <div class="other">
      <v-touch @tap="tap">
        <span class="iconfont icon-tips-jia" v-show="$route.path==='/chat'"></span>
      </v-touch>
      <router-link v-show="$route.path==='/contact'" :to="'/contact/add-friends'">
        <span class="iconfont icon-tips-add-friend"></span>
      </router-link>
      <ul class="tips-menu" :class="tips_isOpen?'tips-open':'tips-close'">
        <li v-for="item in menuArr">
            <router-link :to="item._link">
            <span class="iconfont" :class="item.iconClass"></span>
            <div v-text="item.text"></div>
            </router-link>
        </li>
      </ul>
      <div class="tips-masker" v-show="tips_isOpen"></div>
    </div>
    <div class="center">
      {{menuActive.text}}
      <span class="parentheses" v-show='chatCount' v-text="indexNav[0].hint.count"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      tips_isOpen: false,
      menuArr: [
        {
          _link: {
            path: 'group-chat',
            append: true
          },
          text: '发起群聊',
          iconClass: 'icon-tips-xiaoxi'
        }
      ]
    }
  },
  computed: {
    ...mapState('base', ['menuActive', 'indexNav']),
    chatCount () {
      return this.menuActive.text === '微信' && this.indexNav[0].hint.count > 0
    }
  },
  methods: {
    tap () {
      event.stopPropagation()
      this.tips_isOpen = !this.tips_isOpen
    }

  }
}
</script>

<style scoped>
.center {
    margin: 0 auto;
    text-align: center;
}

.other {
    position: absolute;
    right: 15px;
}

.other .iconfont {
    font-size: 22px;
}

.other .tips-masker {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;
    top: 45px;
    bottom: 50px;
}

.other .tips-menu {
    position: absolute;
    z-index: 2;
    width: 133px;
    font-size: 16px;
    right: -10px;
    top: 54px;
    text-align: left;
    border-radius: 2px;
    background-color: #49484b;
    padding: 0 15px;
    transform-origin: 90% 0%;
}

.tips-open {
    transition: initial;
    opacity: 1;
}

.tips-close {
    opacity: 0;
    transition: .2s opacity ease, .6s transform ease;
    transform: scale(0);
}

.other .tips-menu li {
    position: relative;
    height: 40px;
    line-height: 40px;
}

.other .tips-menu li:not(:last-child)::after {
    content: "";
    width: 200%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: #5b5b5d;
    transform: scale(.5);
    transform-origin: 0 100%;
}

.other .tips-menu::before {
    width: 0;
    height: 0;
    position: absolute;
    top: -8px;
    right: 15px;
    content: "";
    border-width: 0 6px 8px;
    border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #49484b rgba(0, 0, 0, 0);
    border-style: solid;
}

.other .tips-menu .iconfont {
    float: left;
    font-size: 16px;
}

.other .tips-menu .iconfont {
    margin-right: 15px;
}
</style>
